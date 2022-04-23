import { Component, OnInit } from '@angular/core';
import {ResourceLink} from '../../../../shared/resource-link';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Router} from '@angular/router';
import {AbstractComponent} from '../../../../shared/abstract-component';
import {LoggedUser} from '../../../../shared/logged-user';
import {UsecaseList} from '../../../../usecase-list';
import {PageRequest} from '../../../../shared/page-request';
import {Consumedistribution} from '../../../../entities/consumedistribution';
import {ConsumedistributionService} from '../../../../services/consumedistribution.service';
import {ViewChild} from '@angular/core';
import {Branch} from '../../../../entities/branch';
import {DateHelper} from '../../../../shared/date-helper';
import {BranchService} from '../../../../services/branch.service';
import {ConsumedistributionitemSubFormComponent} from './consumedistributionitem-sub-form/consumedistributionitem-sub-form.component';

@Component({
  selector: 'app-consumedistribution-form',
  templateUrl: './consumedistribution-form.component.html',
  styleUrls: ['./consumedistribution-form.component.scss']
})
export class ConsumedistributionFormComponent extends AbstractComponent implements OnInit {

  branches: Branch[] = [];
  @ViewChild(ConsumedistributionitemSubFormComponent) consumedistributionitemSubForm: ConsumedistributionitemSubFormComponent;

  form = new FormGroup({
    branch: new FormControl(null, [
      Validators.required,
    ]),
    date: new FormControl(null, [
      Validators.required,
    ]),
    consumedistributionitems: new FormControl(),
    description: new FormControl(null, [
      Validators.minLength(null),
      Validators.maxLength(65535),
    ]),
  });

  get branchField(): FormControl{
    return this.form.controls.branch as FormControl;
  }

  get dateField(): FormControl{
    return this.form.controls.date as FormControl;
  }

  get consumedistributionitemsField(): FormControl{
    return this.form.controls.consumedistributionitems as FormControl;
  }

  get descriptionField(): FormControl{
    return this.form.controls.description as FormControl;
  }

  constructor(
    private branchService: BranchService,
    private consumedistributionService: ConsumedistributionService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {
    super();
  }

  ngOnInit(): void {
    this.loadData();
    this.refreshData();
  }

async loadData(): Promise<any>{

    this.updatePrivileges();
    if (!this.privilege.add) { return; }

    this.branchService.getAllBasic(new PageRequest()).then((branchDataPage) => {
      this.branches = branchDataPage.content;
    }).catch((e) => {
      console.log(e);
      this.snackBar.open('Something is wrong', null, {duration: 2000});
    });
  }

  updatePrivileges(): any {
    this.privilege.add = LoggedUser.can(UsecaseList.ADD_CONSUMEDISTRIBUTION);
    this.privilege.showAll = LoggedUser.can(UsecaseList.SHOW_ALL_CONSUMEDISTRIBUTIONS);
    this.privilege.showOne = LoggedUser.can(UsecaseList.SHOW_CONSUMEDISTRIBUTION_DETAILS);
    this.privilege.delete = LoggedUser.can(UsecaseList.DELETE_CONSUMEDISTRIBUTION);
    this.privilege.update = LoggedUser.can(UsecaseList.UPDATE_CONSUMEDISTRIBUTION);
  }

  async submit(): Promise<void> {
    this.consumedistributionitemSubForm.resetForm();
    this.consumedistributionitemsField.markAsDirty();
    if (this.form.invalid) { return; }

    const consumedistribution: Consumedistribution = new Consumedistribution();
    consumedistribution.branch = this.branchField.value;
    consumedistribution.date = DateHelper.getDateAsString(this.dateField.value);
    consumedistribution.consumedistributionitemList = this.consumedistributionitemsField.value;
    consumedistribution.description = this.descriptionField.value;
    try{
      const resourceLink: ResourceLink = await this.consumedistributionService.add(consumedistribution);
      if (this.privilege.showOne) {
        await this.router.navigateByUrl('/consumedistributions/' + resourceLink.id);
      } else {
        this.form.reset();
        this.snackBar.open('Successfully saved', null, {duration: 2000});
      }
    }catch (e) {
      switch (e.status) {
        case 401: break;
        case 403: this.snackBar.open(e.error.message, null, {duration: 2000}); break;
        case 400:
          const msg = JSON.parse(e.error.message);
          let knownError = false;
          if (msg.branch) { this.branchField.setErrors({server: msg.branch}); knownError = true; }
          if (msg.date) { this.dateField.setErrors({server: msg.date}); knownError = true; }
          if (msg.consumedistributionitemList) { this.consumedistributionitemsField.setErrors({server: msg.consumedistributionitemList}); knownError = true; }
          if (msg.description) { this.descriptionField.setErrors({server: msg.description}); knownError = true; }
          if (!knownError) {
            this.snackBar.open('Validation Error', null, {duration: 2000});
          }
          break;
        default:
          this.snackBar.open('Something is wrong', null, {duration: 2000});
      }
    }

  }
  dateVaidation(): any {
    const date = new Date();
    return date;
  }
}
