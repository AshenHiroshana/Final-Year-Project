import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {MatSnackBar} from '@angular/material/snack-bar';
import {LoggedUser} from '../../../../shared/logged-user';
import {UsecaseList} from '../../../../usecase-list';
import {ResourceLink} from '../../../../shared/resource-link';
import {AbstractComponent} from '../../../../shared/abstract-component';
import {PageRequest} from '../../../../shared/page-request';
import {Consumedistribution} from '../../../../entities/consumedistribution';
import {ConsumedistributionService} from '../../../../services/consumedistribution.service';
import {ViewChild} from '@angular/core';
import {Branch} from '../../../../entities/branch';
import {DateHelper} from '../../../../shared/date-helper';
import {BranchService} from '../../../../services/branch.service';
import {Consumedistributionstatus} from '../../../../entities/consumedistributionstatus';
import {ConsumedistributionstatusService} from '../../../../services/consumedistributionstatus.service';
import {ConsumedistributionitemUpdateSubFormComponent} from './consumedistributionitem-update-sub-form/consumedistributionitem-update-sub-form.component';

@Component({
  selector: 'app-consumedistribution-update-form',
  templateUrl: './consumedistribution-update-form.component.html',
  styleUrls: ['./consumedistribution-update-form.component.scss']
})
export class ConsumedistributionUpdateFormComponent extends AbstractComponent implements OnInit {

  selectedId: number;
  consumedistribution: Consumedistribution;

  branches: Branch[] = [];
  consumedistributionstatuses: Consumedistributionstatus[] = [];
  @ViewChild(ConsumedistributionitemUpdateSubFormComponent) consumedistributionitemUpdateSubForm: ConsumedistributionitemUpdateSubFormComponent;

  form = new FormGroup({
    branch: new FormControl(null, [
      Validators.required,
    ]),
    date: new FormControl(null, [
      Validators.required,
    ]),
    consumedistributionstatus: new FormControl('1', [
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

  get consumedistributionstatusField(): FormControl{
    return this.form.controls.consumedistributionstatus as FormControl;
  }

  get consumedistributionitemsField(): FormControl{
    return this.form.controls.consumedistributionitems as FormControl;
  }

  get descriptionField(): FormControl{
    return this.form.controls.description as FormControl;
  }

  constructor(
    private branchService: BranchService,
    private consumedistributionstatusService: ConsumedistributionstatusService,
    private consumedistributionService: ConsumedistributionService,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar,
    private router: Router
  ) {
    super();
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe( async (params) => {
      this.selectedId =  + params.get('id');
      await this.loadData();
      this.refreshData();
    });
  }

  async loadData(): Promise<any>{

    this.updatePrivileges();
    if (!this.privilege.update) { return; }

    this.branchService.getAllBasic(new PageRequest()).then((branchDataPage) => {
      this.branches = branchDataPage.content;
    }).catch((e) => {
      console.log(e);
      this.snackBar.open('Something is wrong', null, {duration: 2000});
    });
    this.consumedistributionstatusService.getAll().then((consumedistributionstatuses) => {
      this.consumedistributionstatuses = consumedistributionstatuses;
    }).catch((e) => {
      console.log(e);
      this.snackBar.open('Something is wrong', null, {duration: 2000});
    });
    this.consumedistribution = await this.consumedistributionService.get(this.selectedId);
    this.setValues();
  }

  updatePrivileges(): any {
    this.privilege.add = LoggedUser.can(UsecaseList.ADD_CONSUMEDISTRIBUTION);
    this.privilege.showAll = LoggedUser.can(UsecaseList.SHOW_ALL_CONSUMEDISTRIBUTIONS);
    this.privilege.showOne = LoggedUser.can(UsecaseList.SHOW_CONSUMEDISTRIBUTION_DETAILS);
    this.privilege.delete = LoggedUser.can(UsecaseList.DELETE_CONSUMEDISTRIBUTION);
    this.privilege.update = LoggedUser.can(UsecaseList.UPDATE_CONSUMEDISTRIBUTION);
  }

  discardChanges(): void{
    this.form.markAsPristine();
    this.form.markAsUntouched();
    this.setValues();
  }

  setValues(): void{
    if (this.branchField.pristine) {
      this.branchField.setValue(this.consumedistribution.branch.id);
    }
    if (this.dateField.pristine) {
      this.dateField.setValue(this.consumedistribution.date);
    }
    if (this.consumedistributionstatusField.pristine) {
      this.consumedistributionstatusField.setValue(this.consumedistribution.consumedistributionstatus.id);
    }
    if (this.consumedistributionitemsField.pristine) {
      this.consumedistributionitemsField.setValue(this.consumedistribution.consumedistributionitemList);
    }
    if (this.descriptionField.pristine) {
      this.descriptionField.setValue(this.consumedistribution.description);
    }
}

  async submit(): Promise<void> {
    this.consumedistributionitemUpdateSubForm.resetForm();
    this.consumedistributionitemsField.markAsDirty();
    if (this.form.invalid) { return; }

    const newconsumedistribution: Consumedistribution = new Consumedistribution();
    newconsumedistribution.branch = this.branchField.value;
    newconsumedistribution.date = DateHelper.getDateAsString(this.dateField.value);
    newconsumedistribution.consumedistributionstatus = this.consumedistributionstatusField.value;
    newconsumedistribution.consumedistributionitemList = this.consumedistributionitemsField.value;
    newconsumedistribution.description = this.descriptionField.value;
    try{
      const resourceLink: ResourceLink = await this.consumedistributionService.update(this.selectedId, newconsumedistribution);
      if (this.privilege.showOne) {
        await this.router.navigateByUrl('/consumedistributions/' + resourceLink.id);
      } else {
        await this.router.navigateByUrl('/consumedistributions');
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
          if (msg.consumedistributionstatus) { this.consumedistributionstatusField.setErrors({server: msg.consumedistributionstatus}); knownError = true; }
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
}
