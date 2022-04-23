import {Component, forwardRef, OnInit} from '@angular/core';
import {FormControl, FormGroup, NG_VALIDATORS, NG_VALUE_ACCESSOR, Validators} from '@angular/forms';
import {MatDialog} from '@angular/material/dialog';
import {ApiManager} from '../../../../../shared/api-manager';
import {MatSnackBar} from '@angular/material/snack-bar';
import {PageRequest} from '../../../../../shared/page-request';
import {AbstractSubFormComponent} from '../../../../../shared/ui-components/abstract-sub-form/abstract-sub-form.component';
import {Payrolldeduction} from '../../../../../entities/payrolldeduction';

@Component({
  selector: 'app-payrolldeduction-update-sub-form',
  templateUrl: './payrolldeduction-update-sub-form.component.html',
  styleUrls: ['./payrolldeduction-update-sub-form.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => PayrolldeductionUpdateSubFormComponent),
      multi: true
    }, {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => PayrolldeductionUpdateSubFormComponent),
      multi: true,
    }
  ]
})
export class PayrolldeductionUpdateSubFormComponent extends AbstractSubFormComponent<Payrolldeduction> implements OnInit{


  hasValidations = false;

  get thumbnailURL(): string{
    return ApiManager.getURL('/files/thumbnail/');
  }

  form = new FormGroup({
    id: new FormControl(null),
    title: new FormControl(),
    amount: new FormControl(),
  });

  get idField(): FormControl{
    return this.form.controls.id as FormControl;
  }

  get titleField(): FormControl{
    return this.form.controls.title as FormControl;
  }

  get amountField(): FormControl{
    return this.form.controls.amount as FormControl;
  }

  get isFormEmpty(): boolean{
    return this.isEmptyField(this.idField)
      &&   this.isEmptyField(this.titleField)
      &&   this.isEmptyField(this.amountField);
  }

  constructor(
    protected dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {
    super();
  }

  ngOnInit(): void {
  }

  setValidations(): void{
    this.hasValidations = true;
    this.titleField.setValidators([
      Validators.required,
      Validators.maxLength(255),
      Validators.minLength(2),
    ]);
    this.amountField.setValidators([
      Validators.required,
      Validators.pattern('^([0-9]{1,8}([.][0-9]{1,2})?)$'),
      Validators.max(10000000),
      Validators.min(0),
    ]);
  }

  removeValidations(): void{
    this.hasValidations = false;
    this.titleField.clearValidators();
    this.amountField.clearValidators();
  }

  fillForm(dataItem: Payrolldeduction): void {
    this.idField.patchValue(dataItem.id);
    this.titleField.patchValue(dataItem.title);
    this.amountField.patchValue(dataItem.amount);
  }

  resetForm(): void{
    this.form.reset();
    this.removeValidations();
  }

  // Operations related functions
  getDeleteConfirmMessage(payrolldeduction: Payrolldeduction): string {
    return 'Are you sure to remove \u201C ' + payrolldeduction.title + ' \u201D from deduction?';
  }

  getUpdateConfirmMessage(payrolldeduction: Payrolldeduction): string {
    if (this.isFormEmpty){
      return 'Are you sure to update \u201C\u00A0' + payrolldeduction.title + '\u00A0\u201D\u00A0?';
    }

    return 'Are you sure to update \u201C\u00A0' + payrolldeduction.title + '\u00A0\u201D and discard existing form data\u00A0?';
  }

  addData(): void{
    if (this.form.invalid) { return; }

    const dataItem: Payrolldeduction = new Payrolldeduction();
    dataItem.id = this.idField.value;
    dataItem.title = this.titleField.value;
    dataItem.amount = this.amountField.value;
    this.addToTop(dataItem);
    this.resetForm();
  }

  customValidations(): object {
    return null;
  }
}
