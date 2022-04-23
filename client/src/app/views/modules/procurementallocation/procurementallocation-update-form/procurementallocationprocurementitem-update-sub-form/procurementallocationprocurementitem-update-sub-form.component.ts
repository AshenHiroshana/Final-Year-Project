import {Component, forwardRef, OnInit} from '@angular/core';
import {FormControl, FormGroup, NG_VALIDATORS, NG_VALUE_ACCESSOR, Validators} from '@angular/forms';
import {MatDialog} from '@angular/material/dialog';
import {ApiManager} from '../../../../../shared/api-manager';
import {MatSnackBar} from '@angular/material/snack-bar';
import {PageRequest} from '../../../../../shared/page-request';
import {AbstractSubFormComponent} from '../../../../../shared/ui-components/abstract-sub-form/abstract-sub-form.component';
import {Procurementallocationprocurementitem} from '../../../../../entities/procurementallocationprocurementitem';
import {DateHelper} from '../../../../../shared/date-helper';
import {Procurementitem} from '../../../../../entities/procurementitem';
import {Allocationstatus} from '../../../../../entities/allocationstatus';
import {ProcurementitemService} from '../../../../../services/procurementitem.service';
import {AllocationstatusService} from '../../../../../services/allocationstatus.service';

@Component({
  selector: 'app-procurementallocationprocurementitem-update-sub-form',
  templateUrl: './procurementallocationprocurementitem-update-sub-form.component.html',
  styleUrls: ['./procurementallocationprocurementitem-update-sub-form.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ProcurementallocationprocurementitemUpdateSubFormComponent),
      multi: true
    }, {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => ProcurementallocationprocurementitemUpdateSubFormComponent),
      multi: true,
    }
  ]
})
export class ProcurementallocationprocurementitemUpdateSubFormComponent extends AbstractSubFormComponent<Procurementallocationprocurementitem> implements OnInit{

  procurementitems: Procurementitem[] = [];
  allocationstatuses: Allocationstatus[] = [];

  hasValidations = false;

  get thumbnailURL(): string{
    return ApiManager.getURL('/files/thumbnail/');
  }

  form = new FormGroup({
    id: new FormControl(null),
    dodeallocate: new FormControl(),
    procurementitem: new FormControl(),
    allocationstatus: new FormControl(),
  });

  get idField(): FormControl{
    return this.form.controls.id as FormControl;
  }

  get dodeallocateField(): FormControl{
    return this.form.controls.dodeallocate as FormControl;
  }

  get procurementitemField(): FormControl{
    return this.form.controls.procurementitem as FormControl;
  }

  get allocationstatusField(): FormControl{
    return this.form.controls.allocationstatus as FormControl;
  }

  get isFormEmpty(): boolean{
    return this.isEmptyField(this.idField)
      &&   this.isEmptyField(this.dodeallocateField)
      &&   this.isEmptyField(this.procurementitemField)
      &&   this.isEmptyField(this.allocationstatusField);
  }

  constructor(
    private procurementitemService: ProcurementitemService,
    private allocationstatusService: AllocationstatusService,
    protected dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {
    super();
  }

  ngOnInit(): void {
    this.procurementitemService.getAllItemForAllocation().then((procurementitems) => {
      this.procurementitems = procurementitems;
    }).catch((e) => {
      console.log(e);
      this.snackBar.open('Something is wrong', null, {duration: 2000});
    });
    this.allocationstatusService.getAll().then((allocationstatuses) => {
      this.allocationstatuses = allocationstatuses;
    }).catch((e) => {
      console.log(e);
      this.snackBar.open('Something is wrong', null, {duration: 2000});
    });
  }

  setValidations(): void{
    this.hasValidations = true;
    this.dodeallocateField.setValidators([Validators.required]);
    this.procurementitemField.setValidators([Validators.required]);
  }

  removeValidations(): void{
    this.hasValidations = false;
    this.dodeallocateField.clearValidators();
    this.procurementitemField.clearValidators();
  }

  fillForm(dataItem: Procurementallocationprocurementitem): void {
    this.idField.patchValue(dataItem.id);
    this.dodeallocateField.patchValue(dataItem.dodeallocate);
    this.procurementitemField.patchValue(dataItem.procurementitem.id);
    this.allocationstatusField.patchValue(dataItem.allocationstatus.id);
  }

  resetForm(): void{
    this.form.reset();
    this.removeValidations();
  }

  // Operations related functions
  getDeleteConfirmMessage(procurementallocationprocurementitem: Procurementallocationprocurementitem): string {
    return 'Are you sure to remove \u201C ' + procurementallocationprocurementitem.procurementitem.code + ' \u201D from items?';
  }

  getUpdateConfirmMessage(procurementallocationprocurementitem: Procurementallocationprocurementitem): string {
    if (this.isFormEmpty){
      return 'Are you sure to update \u201C\u00A0' + procurementallocationprocurementitem.procurementitem.code + '\u00A0\u201D\u00A0?';
    }

    return 'Are you sure to update \u201C\u00A0' + procurementallocationprocurementitem.procurementitem.code + '\u00A0\u201D and discard existing form data\u00A0?';
  }

  addData(): void{
    if (this.form.invalid) { return; }

    const dataItem: Procurementallocationprocurementitem = new Procurementallocationprocurementitem();
    dataItem.id = this.idField.value;
    dataItem.dodeallocate = DateHelper.getDateAsString(this.dodeallocateField.value);
    this.allocationstatusField.patchValue(1);
    dataItem.allocationstatus = this.allocationstatusField.value;

    for (const procurementitem of this.procurementitems){
      if (this.procurementitemField.value === procurementitem.id) {
        dataItem.procurementitem = procurementitem;
        break;
      }
    }


    for (const allocationstatus of this.allocationstatuses){
      if (this.allocationstatusField.value === allocationstatus.id) {
        dataItem.allocationstatus = allocationstatus;
        break;
      }
    }

    this.addToTop(dataItem);
    this.resetForm();
  }

  customValidations(): object {
    return null;
  }
}
