import { Component, OnInit } from '@angular/core';
import {ResourceLink} from '../../../../shared/resource-link';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Router} from '@angular/router';
import {AbstractComponent} from '../../../../shared/abstract-component';
import {LoggedUser} from '../../../../shared/logged-user';
import {UsecaseList} from '../../../../usecase-list';
import {PageRequest} from '../../../../shared/page-request';
import {Procurementallocation} from '../../../../entities/procurementallocation';
import {ProcurementallocationService} from '../../../../services/procurementallocation.service';
import {ViewChild} from '@angular/core';
import {DateHelper} from '../../../../shared/date-helper';
import {Branchsection} from '../../../../entities/branchsection';
import {BranchsectionService} from '../../../../services/branchsection.service';
import {ProcurementallocationprocurementitemSubFormComponent} from './procurementallocationprocurementitem-sub-form/procurementallocationprocurementitem-sub-form.component';
import {Branch} from "../../../../entities/branch";
import {BranchService} from "../../../../services/branch.service";

@Component({
  selector: 'app-procurementallocation-form',
  templateUrl: './procurementallocation-form.component.html',
  styleUrls: ['./procurementallocation-form.component.scss']
})
export class ProcurementallocationFormComponent extends AbstractComponent implements OnInit {

  branchsections: Branchsection[] = [];
  branches: Branch[] = [];
  @ViewChild(ProcurementallocationprocurementitemSubFormComponent) procurementallocationprocurementitemSubForm: ProcurementallocationprocurementitemSubFormComponent;

  form = new FormGroup({
    branchsection: new FormControl(null, [
      Validators.required,
    ]),
    doallocated: new FormControl(null, [
      Validators.required,
    ]),
    procurementallocationprocurementitems: new FormControl(),
    description: new FormControl(null, [
      Validators.minLength(null),
      Validators.maxLength(65535),
    ]),
    branch: new FormControl(null, [
      Validators.required,
    ]),
  });

  get branchsectionField(): FormControl{
    return this.form.controls.branchsection as FormControl;
  }

  get doallocatedField(): FormControl{
    return this.form.controls.doallocated as FormControl;
  }

  get procurementallocationprocurementitemsField(): FormControl{
    return this.form.controls.procurementallocationprocurementitems as FormControl;
  }

  get descriptionField(): FormControl{
    return this.form.controls.description as FormControl;
  }

  get branchField(): FormControl{
    return this.form.controls.branch as FormControl;
  }

  constructor(
    private branchsectionService: BranchsectionService,
    private branchService: BranchService,
    private procurementallocationService: ProcurementallocationService,
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
    this.privilege.add = LoggedUser.can(UsecaseList.ADD_PROCUREMENTALLOCATION);
    this.privilege.showAll = LoggedUser.can(UsecaseList.SHOW_ALL_PROCUREMENTALLOCATIONS);
    this.privilege.showOne = LoggedUser.can(UsecaseList.SHOW_PROCUREMENTALLOCATION_DETAILS);
    this.privilege.delete = LoggedUser.can(UsecaseList.DELETE_PROCUREMENTALLOCATION);
    this.privilege.update = LoggedUser.can(UsecaseList.UPDATE_PROCUREMENTALLOCATION);
  }

  async submit(): Promise<void> {
    this.procurementallocationprocurementitemSubForm.resetForm();
    this.procurementallocationprocurementitemsField.markAsDirty();
    if (this.form.invalid) { return; }

    const procurementallocation: Procurementallocation = new Procurementallocation();
    procurementallocation.branchsection = this.branchsectionField.value;
    procurementallocation.doallocated = DateHelper.getDateAsString(this.doallocatedField.value);
    procurementallocation.procurementallocationprocurementitemList = this.procurementallocationprocurementitemsField.value;
    procurementallocation.description = this.descriptionField.value;
    try{
      const resourceLink: ResourceLink = await this.procurementallocationService.add(procurementallocation);
      if (this.privilege.showOne) {
        await this.router.navigateByUrl('/procurementallocations/' + resourceLink.id);
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
          if (msg.branchsection) { this.branchsectionField.setErrors({server: msg.branchsection}); knownError = true; }
          if (msg.doallocated) { this.doallocatedField.setErrors({server: msg.doallocated}); knownError = true; }
          if (msg.procurementallocationprocurementitemList) { this.procurementallocationprocurementitemsField.setErrors({server: msg.procurementallocationprocurementitemList}); knownError = true; }
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

  loadBranchSection(): void{
    this.branchField.disable();
    this.branchsectionService.getAllByBranch(this.branchField.value).then((branchsectionDataPage) => {
      this.branchsections = branchsectionDataPage;
    }).catch((e) => {
      console.log(e);
      this.snackBar.open('Something is wrong', null, {duration: 2000});
    });
  }
  dateVaidation(): any {
    const date = new Date();
    return date;
  }
}
