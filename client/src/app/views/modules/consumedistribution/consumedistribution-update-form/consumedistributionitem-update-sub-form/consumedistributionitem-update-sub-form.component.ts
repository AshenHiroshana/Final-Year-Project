import {Component, forwardRef, OnInit} from '@angular/core';
import {FormControl, FormGroup, NG_VALIDATORS, NG_VALUE_ACCESSOR, Validators} from '@angular/forms';
import {MatDialog} from '@angular/material/dialog';
import {ApiManager} from '../../../../../shared/api-manager';
import {MatSnackBar} from '@angular/material/snack-bar';
import {PageRequest} from '../../../../../shared/page-request';
import {AbstractSubFormComponent} from '../../../../../shared/ui-components/abstract-sub-form/abstract-sub-form.component';
import {Consumedistributionitem} from '../../../../../entities/consumedistributionitem';
import {Consumeitem} from '../../../../../entities/consumeitem';
import {ConsumeitemService} from '../../../../../services/consumeitem.service';

@Component({
  selector: 'app-consumedistributionitem-update-sub-form',
  templateUrl: './consumedistributionitem-update-sub-form.component.html',
  styleUrls: ['./consumedistributionitem-update-sub-form.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ConsumedistributionitemUpdateSubFormComponent),
      multi: true
    }, {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => ConsumedistributionitemUpdateSubFormComponent),
      multi: true,
    }
  ]
})
export class ConsumedistributionitemUpdateSubFormComponent extends AbstractSubFormComponent<Consumedistributionitem> implements OnInit{

  consumeitems: Consumeitem[] = [];

  hasValidations = false;

  get thumbnailURL(): string{
    return ApiManager.getURL('/files/thumbnail/');
  }

  form = new FormGroup({
    id: new FormControl(null),
    consumeitem: new FormControl(),
    qty: new FormControl(),
  });

  get idField(): FormControl{
    return this.form.controls.id as FormControl;
  }

  get consumeitemField(): FormControl{
    return this.form.controls.consumeitem as FormControl;
  }

  get qtyField(): FormControl{
    return this.form.controls.qty as FormControl;
  }

  get isFormEmpty(): boolean{
    return this.isEmptyField(this.idField)
      &&   this.isEmptyField(this.consumeitemField)
      &&   this.isEmptyField(this.qtyField);
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
    this.consumeitemField.setValidators([Validators.required]);
    this.qtyField.setValidators([
      Validators.required,
      Validators.pattern('^([0-9]*)$'),
      Validators.max(2147483647),
      Validators.min(-2147483648),
    ]);
  }

  removeValidations(): void{
    this.hasValidations = false;
    this.consumeitemField.clearValidators();
    this.qtyField.clearValidators();
  }

  fillForm(dataItem: Consumedistributionitem): void {
    this.idField.patchValue(dataItem.id);
    this.consumeitemField.patchValue(dataItem.consumeitem.id);
    this.qtyField.patchValue(dataItem.qty);
  }

  resetForm(): void{
    this.form.reset();
    this.removeValidations();
  }

  // Operations related functions
  getDeleteConfirmMessage(consumedistributionitem: Consumedistributionitem): string {
    return 'Are you sure to remove \u201C ' + consumedistributionitem.consumeitem.name + ' \u201D from items?';
  }

  getUpdateConfirmMessage(consumedistributionitem: Consumedistributionitem): string {
    if (this.isFormEmpty){
      return 'Are you sure to update \u201C\u00A0' + consumedistributionitem.consumeitem.name + '\u00A0\u201D\u00A0?';
    }

    return 'Are you sure to update \u201C\u00A0' + consumedistributionitem.consumeitem.name + '\u00A0\u201D and discard existing form data\u00A0?';
  }

  addData(): void{
    if (this.form.invalid) { return; }

    const dataItem: Consumedistributionitem = new Consumedistributionitem();
    dataItem.id = this.idField.value;

    for (const consumeitem of this.consumeitems){
      if (this.consumeitemField.value === consumeitem.id) {
        dataItem.consumeitem = consumeitem;
        break;
      }
    }

    dataItem.qty = this.qtyField.value;
    this.addToTop(dataItem);
    this.resetForm();
  }

  customValidations(): object {
    return null;
  }
}
