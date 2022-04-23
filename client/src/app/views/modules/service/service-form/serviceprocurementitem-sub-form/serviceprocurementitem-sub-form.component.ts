import {Component, forwardRef, Input, OnInit} from '@angular/core';
import {FormControl, FormGroup, NG_VALIDATORS, NG_VALUE_ACCESSOR, Validators} from '@angular/forms';
import {MatDialog} from '@angular/material/dialog';
import {ApiManager} from '../../../../../shared/api-manager';
import {MatSnackBar} from '@angular/material/snack-bar';
import {PageRequest} from '../../../../../shared/page-request';
import {AbstractSubFormComponent} from '../../../../../shared/ui-components/abstract-sub-form/abstract-sub-form.component';
import {Serviceprocurementitem} from '../../../../../entities/serviceprocurementitem';
import {Procurementitem} from '../../../../../entities/procurementitem';
import {ProcurementitemService} from '../../../../../services/procurementitem.service';

@Component({
  selector: 'app-serviceprocurementitem-sub-form',
  templateUrl: './serviceprocurementitem-sub-form.component.html',
  styleUrls: ['./serviceprocurementitem-sub-form.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ServiceprocurementitemSubFormComponent),
      multi: true
    }, {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => ServiceprocurementitemSubFormComponent),
      multi: true,
    }
  ]
})
export class ServiceprocurementitemSubFormComponent extends AbstractSubFormComponent<Serviceprocurementitem> implements OnInit{

  @Input()
  procurementitems: Procurementitem[] = [];

  hasValidations = false;

  get thumbnailURL(): string{
    return ApiManager.getURL('/files/thumbnail/');
  }

  form = new FormGroup({
    id: new FormControl(null),
    amount: new FormControl(),
    procurementitem: new FormControl(),
  });

  get idField(): FormControl{
    return this.form.controls.id as FormControl;
  }

  get amountField(): FormControl{
    return this.form.controls.amount as FormControl;
  }

  get procurementitemField(): FormControl{
    return this.form.controls.procurementitem as FormControl;
  }

  get isFormEmpty(): boolean{
    return this.isEmptyField(this.idField)
      &&   this.isEmptyField(this.amountField)
      &&   this.isEmptyField(this.procurementitemField);
  }

  constructor(
    private procurementitemService: ProcurementitemService,
    protected dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {
    super();
  }

  ngOnInit(): void {

  }

  setValidations(): void{
    this.hasValidations = true;
    this.amountField.setValidators([
      Validators.required,
      Validators.pattern('^([0-9]{1,8}([.][0-9]{1,2})?)$'),
      Validators.max(10000000),
      Validators.min(0),
    ]);
  }

  removeValidations(): void{
    this.hasValidations = false;
    this.amountField.clearValidators();
    this.procurementitemField.clearValidators();
  }

  fillForm(dataItem: Serviceprocurementitem): void {
    this.idField.patchValue(dataItem.id);
    this.amountField.patchValue(dataItem.amount);
    this.procurementitemField.patchValue(dataItem.procurementitem.id);
  }

  resetForm(): void{
    this.form.reset();
    this.removeValidations();
  }

  // Operations related functions
  getDeleteConfirmMessage(serviceprocurementitem: Serviceprocurementitem): string {
    return 'Are you sure to remove \u201C ' + serviceprocurementitem.procurementitem.code + ' \u201D from service items?';
  }

  getUpdateConfirmMessage(serviceprocurementitem: Serviceprocurementitem): string {
    if (this.isFormEmpty){
      return 'Are you sure to update \u201C\u00A0' + serviceprocurementitem.procurementitem.code + '\u00A0\u201D\u00A0?';
    }

    return 'Are you sure to update \u201C\u00A0' + serviceprocurementitem.procurementitem.code + '\u00A0\u201D and discard existing form data\u00A0?';
  }

  addData(): void{
    if (this.form.invalid) { return; }

    const dataItem: Serviceprocurementitem = new Serviceprocurementitem();
    dataItem.id = this.idField.value;
    dataItem.amount = this.amountField.value;

    for (const procurementitem of this.procurementitems){
      if (this.procurementitemField.value === procurementitem.id) {
        dataItem.procurementitem = procurementitem;
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
