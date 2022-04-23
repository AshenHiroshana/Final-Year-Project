import {Component, forwardRef, OnInit} from '@angular/core';
import {FormControl, FormGroup, NG_VALIDATORS, NG_VALUE_ACCESSOR, Validators} from '@angular/forms';
import {MatDialog} from '@angular/material/dialog';
import {ApiManager} from '../../../../../shared/api-manager';
import {MatSnackBar} from '@angular/material/snack-bar';
import {PageRequest} from '../../../../../shared/page-request';
import {AbstractSubFormComponent} from '../../../../../shared/ui-components/abstract-sub-form/abstract-sub-form.component';
import {Consumeitempurchaseconsumeitem} from '../../../../../entities/consumeitempurchaseconsumeitem';
import {Consumeitem} from '../../../../../entities/consumeitem';
import {ConsumeitemService} from '../../../../../services/consumeitem.service';

@Component({
  selector: 'app-consumeitempurchaseconsumeitem-update-sub-form',
  templateUrl: './consumeitempurchaseconsumeitem-update-sub-form.component.html',
  styleUrls: ['./consumeitempurchaseconsumeitem-update-sub-form.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ConsumeitempurchaseconsumeitemUpdateSubFormComponent),
      multi: true
    }, {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => ConsumeitempurchaseconsumeitemUpdateSubFormComponent),
      multi: true,
    }
  ]
})
export class ConsumeitempurchaseconsumeitemUpdateSubFormComponent extends AbstractSubFormComponent<Consumeitempurchaseconsumeitem> implements OnInit{

  consumeitems: Consumeitem[] = [];

  hasValidations = false;

  get thumbnailURL(): string{
    return ApiManager.getURL('/files/thumbnail/');
  }

  form = new FormGroup({
    id: new FormControl(null),
    qty: new FormControl(),
    unitprice: new FormControl(),
    consumeitem: new FormControl(),
    linetotal: new FormControl(),
  });

  get idField(): FormControl{
    return this.form.controls.id as FormControl;
  }

  get qtyField(): FormControl{
    return this.form.controls.qty as FormControl;
  }

  get unitpriceField(): FormControl{
    return this.form.controls.unitprice as FormControl;
  }

  get consumeitemField(): FormControl{
    return this.form.controls.consumeitem as FormControl;
  }

  get linetotalField(): FormControl{
    return this.form.controls.linetotal as FormControl;
  }

  get isFormEmpty(): boolean{
    return this.isEmptyField(this.idField)
      &&   this.isEmptyField(this.qtyField)
      &&   this.isEmptyField(this.unitpriceField)
      &&   this.isEmptyField(this.consumeitemField)
      &&   this.isEmptyField(this.linetotalField);
  }

  constructor(
    private consumeitemService: ConsumeitemService,
    protected dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {
    super();
  }

  ngOnInit(): void {
    this.consumeitemService.getAllBasic(new PageRequest()).then((consumeitemDataPage) => {
      this.consumeitems = consumeitemDataPage.content;
    }).catch((e) => {
      console.log(e);
      this.snackBar.open('Something is wrong', null, {duration: 2000});
    });
  }

  setValidations(): void{
    this.hasValidations = true;
    this.qtyField.setValidators([
      Validators.required,
      Validators.pattern('^([0-9]*)$'),
      Validators.max(2147483647),
      Validators.min(-2147483648),
    ]);
    this.unitpriceField.setValidators([
      Validators.required,
      Validators.pattern('^([0-9]{1,8}([.][0-9]{1,2})?)$'),
      Validators.max(10000000),
      Validators.min(0),
    ]);
    this.consumeitemField.setValidators([Validators.required]);
    this.linetotalField.setValidators([
      Validators.required,
      Validators.pattern('^([0-9]{1,8}([.][0-9]{1,2})?)$'),
      Validators.max(10000000),
      Validators.min(0),
    ]);
  }

  removeValidations(): void{
    this.hasValidations = false;
    this.qtyField.clearValidators();
    this.unitpriceField.clearValidators();
    this.consumeitemField.clearValidators();
    this.linetotalField.clearValidators();
  }

  fillForm(dataItem: Consumeitempurchaseconsumeitem): void {
    this.idField.patchValue(dataItem.id);
    this.qtyField.patchValue(dataItem.qty);
    this.unitpriceField.patchValue(dataItem.unitprice);
    this.consumeitemField.patchValue(dataItem.consumeitem.id);
    this.linetotalField.patchValue(dataItem.linetotal);
  }

  resetForm(): void{
    this.form.reset();
    this.removeValidations();
  }

  // Operations related functions
  getDeleteConfirmMessage(consumeitempurchaseconsumeitem: Consumeitempurchaseconsumeitem): string {
    return 'Are you sure to remove \u201C ' + consumeitempurchaseconsumeitem.consumeitem.name + ' \u201D from items?';
  }

  getUpdateConfirmMessage(consumeitempurchaseconsumeitem: Consumeitempurchaseconsumeitem): string {
    if (this.isFormEmpty){
      return 'Are you sure to update \u201C\u00A0' + consumeitempurchaseconsumeitem.consumeitem.name + '\u00A0\u201D\u00A0?';
    }

    return 'Are you sure to update \u201C\u00A0' + consumeitempurchaseconsumeitem.consumeitem.name + '\u00A0\u201D and discard existing form data\u00A0?';
  }

  addData(): void{
    if (this.form.invalid) { return; }

    const dataItem: Consumeitempurchaseconsumeitem = new Consumeitempurchaseconsumeitem();
    dataItem.id = this.idField.value;
    dataItem.qty = this.qtyField.value;
    dataItem.unitprice = this.unitpriceField.value;

    for (const consumeitem of this.consumeitems){
      if (this.consumeitemField.value === consumeitem.id) {
        dataItem.consumeitem = consumeitem;
        break;
      }
    }

    dataItem.linetotal = this.linetotalField.value;
    this.addToTop(dataItem);
    this.resetForm();
  }

  customValidations(): object {
    return null;
  }
}
