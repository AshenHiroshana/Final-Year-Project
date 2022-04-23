import {Component, forwardRef, Input, OnInit} from '@angular/core';
import {AbstractSubFormComponent} from "../../../../../shared/ui-components/abstract-sub-form/abstract-sub-form.component";
import {Procurementitem} from "../../../../../entities/procurementitem";
import {FormControl, FormGroup, NG_VALIDATORS, NG_VALUE_ACCESSOR, Validators} from "@angular/forms";
import { MatDialog } from '@angular/material/dialog';
import {Procurementitemtype} from "../../../../../entities/procurementitemtype";
import {Buyingcondition} from "../../../../../entities/buyingcondition";

@Component({
  selector: 'app-procurementitempurchase-procurementitem-sub-form',
  templateUrl: './procurementitempurchase-procurementitem-sub-form.component.html',
  styleUrls: ['./procurementitempurchase-procurementitem-sub-form.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ProcurementitempurchaseProcurementitemSubFormComponent),
      multi: true
    }, {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => ProcurementitempurchaseProcurementitemSubFormComponent),
      multi: true,
    }
  ]
})
export class ProcurementitempurchaseProcurementitemSubFormComponent extends AbstractSubFormComponent<Procurementitem> {

  constructor(protected dialog: MatDialog) {
    super();
  }

  // Form related variables and functions

  @Input()
  procurementitemtypes: Procurementitemtype[] = [];
  @Input()
  buyingconditions: Buyingcondition[] = [];

  fieldValidations = {
    price: [],
    procurementitemtype: [],
    buyingcondition: [],
  };

  form = new FormGroup({
    id: new FormControl(null),
    price: new FormControl('', this.fieldValidations.price),
    procurementitemtype: new FormControl('', this.fieldValidations.procurementitemtype),
    buyingcondition: new FormControl('', this.fieldValidations.buyingcondition),
  });

  get idField(): FormControl{
    return this.form.controls.id as FormControl;
  }

  get priceField(): FormControl{
    return this.form.controls.price as FormControl;
  }

  get procurementitemtypeField(): FormControl{
    return this.form.controls.procurementitemtype as FormControl;
  }

  get buyingconditionField(): FormControl{
    return this.form.controls.buyingcondition as FormControl;
  }

  get isFormEmpty(): boolean{
    return this.isEmptyField(this.idField)
      &&   this.isEmptyField(this.priceField)
      &&   this.isEmptyField(this.procurementitemtypeField)
      &&   this.isEmptyField(this.buyingconditionField);
  }

  setValidations(): void{
    this.fieldValidations.price = [ Validators.required ];
    this.fieldValidations.procurementitemtype = [ Validators.required ];
    this.fieldValidations.buyingcondition = [ Validators.required ];
  }

  removeValidations(): void{
    this.fieldValidations.price = [];
    this.fieldValidations.procurementitemtype = [];
    this.fieldValidations.buyingcondition = [];
  }

  fillForm(dataItem: Procurementitem): void {
    this.idField.patchValue(dataItem.id);
    this.priceField.patchValue(dataItem.price);

    let procurementitemtype = new Procurementitemtype();
    this.procurementitemtypes.forEach(data => {
      if (data.id == dataItem.procurementitemtype.id){
        procurementitemtype = data;
      }
    });
    this.procurementitemtypeField.patchValue(procurementitemtype);

    let buyingcondition = new Buyingcondition();
    this.buyingconditions.forEach(data => {
      if (data.id == dataItem.buyingcondition.id){
        buyingcondition = data;
      }
    });
    this.buyingconditionField.patchValue(buyingcondition);
  }

  resetForm(): void{
    this.form.reset();
    this.removeValidations();
  }



  // Operations related functions

  getDeleteConfirmMessage(dataItem: Procurementitem): string {
    return `Are you sure to remove \u201C ${dataItem.procurementitemtype.name} \u201D from allowance list ?`;
  }

  getUpdateConfirmMessage(dataItem: Procurementitem): string {
    if (this.isFormEmpty){
      return `Are you sure to update \u201C\u00A0${dataItem.procurementitemtype.name}\u00A0\u201D\u00A0?`;
    }

    return `Are you sure to update \u201C\u00A0${dataItem.procurementitemtype.name}\u00A0\u201D and discard existing form data\u00A0?`;
  }

  addData(): void{
    if (this.form.invalid) { return; }

    const dataItem: Procurementitem = new Procurementitem();
    dataItem.id = this.idField.value;
    dataItem.price = this.priceField.value;
    dataItem.procurementitemtype = this.procurementitemtypeField.value;
    dataItem.buyingcondition = this.buyingconditionField.value;
    this.addToTop(dataItem);
    this.resetForm();
  }

  customValidations(): object {
    return null;
  }
}
