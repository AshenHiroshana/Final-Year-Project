import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {MatSnackBar} from '@angular/material/snack-bar';
import {LoggedUser} from '../../../../shared/logged-user';
import {UsecaseList} from '../../../../usecase-list';
import {ResourceLink} from '../../../../shared/resource-link';
import {AbstractComponent} from '../../../../shared/abstract-component';
import {PageRequest} from '../../../../shared/page-request';
import {Procurementallocation} from '../../../../entities/procurementallocation';
import {ProcurementallocationService} from '../../../../services/procurementallocation.service';
import {ViewChild} from '@angular/core';
import {DateHelper} from '../../../../shared/date-helper';
import {Branchsection} from '../../../../entities/branchsection';
import {BranchsectionService} from '../../../../services/branchsection.service';
import {ProcurementallocationprocurementitemUpdateSubFormComponent} from './procurementallocationprocurementitem-update-sub-form/procurementallocationprocurementitem-update-sub-form.component';

@Component({
  selector: 'app-procurementallocation-update-form',
  templateUrl: './procurementallocation-update-form.component.html',
  styleUrls: ['./procurementallocation-update-form.component.scss']
})
export class ProcurementallocationUpdateFormComponent extends AbstractComponent implements OnInit {

  selectedId: number;
  procurementallocation: Procurementallocation;

  branchsections: Branchsection[] = [];
  @ViewChild(ProcurementallocationprocurementitemUpdateSubFormComponent) procurementallocationprocurementitemUpdateSubForm: ProcurementallocationprocurementitemUpdateSubFormComponent;

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

  constructor(
    private branchsectionService: BranchsectionService,
    private procurementallocationService: ProcurementallocationService,
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

    this.branchsectionService.getAllBasic(new PageRequest()).then((branchsectionDataPage) => {
      this.branchsections = branchsectionDataPage.content;
    }).catch((e) => {
      console.log(e);
      this.snackBar.open('Something is wrong', null, {duration: 2000});
    });
    this.procurementallocation = await this.procurementallocationService.get(this.selectedId);
    this.setValues();
  }

  updatePrivileges(): any {
    this.privilege.add = LoggedUser.can(UsecaseList.ADD_PROCUREMENTALLOCATION);
    this.privilege.showAll = LoggedUser.can(UsecaseList.SHOW_ALL_PROCUREMENTALLOCATIONS);
    this.privilege.showOne = LoggedUser.can(UsecaseList.SHOW_PROCUREMENTALLOCATION_DETAILS);
    this.privilege.delete = LoggedUser.can(UsecaseList.DELETE_PROCUREMENTALLOCATION);
    this.privilege.update = LoggedUser.can(UsecaseList.UPDATE_PROCUREMENTALLOCATION);
  }

  discardChanges(): void{
    this.form.markAsPristine();
    this.form.markAsUntouched();
    this.setValues();
  }

  setValues(): void{
    if (this.branchsectionField.pristine) {
      this.branchsectionField.setValue(this.procurementallocation.branchsection.id);
    }
    if (this.doallocatedField.pristine) {
      this.doallocatedField.setValue(this.procurementallocation.doallocated);
    }
    if (this.procurementallocationprocurementitemsField.pristine) {
      this.procurementallocationprocurementitemsField.setValue(this.procurementallocation.procurementallocationprocurementitemList);
    }
    if (this.descriptionField.pristine) {
      this.descriptionField.setValue(this.procurementallocation.description);
    }
}

  async submit(): Promise<void> {
    this.procurementallocationprocurementitemUpdateSubForm.resetForm();
    this.procurementallocationprocurementitemsField.markAsDirty();
    if (this.form.invalid) { return; }

    const newprocurementallocation: Procurementallocation = new Procurementallocation();
    newprocurementallocation.branchsection = this.branchsectionField.value;
    newprocurementallocation.doallocated = DateHelper.getDateAsString(this.doallocatedField.value);
    newprocurementallocation.procurementallocationprocurementitemList = this.procurementallocationprocurementitemsField.value;
    newprocurementallocation.description = this.descriptionField.value;
    try{
      const resourceLink: ResourceLink = await this.procurementallocationService.update(this.selectedId, newprocurementallocation);
      if (this.privilege.showOne) {
        await this.router.navigateByUrl('/procurementallocations/' + resourceLink.id);
      } else {
        await this.router.navigateByUrl('/procurementallocations');
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
}
