import { Component, OnInit } from '@angular/core';
import {ResourceLink} from '../../../../shared/resource-link';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Router} from '@angular/router';
import {AbstractComponent} from '../../../../shared/abstract-component';
import {LoggedUser} from '../../../../shared/logged-user';
import {UsecaseList} from '../../../../usecase-list';
import {PageRequest} from '../../../../shared/page-request';
import {Consumeitempayment} from '../../../../entities/consumeitempayment';
import {ConsumeitempaymentService} from '../../../../services/consumeitempayment.service';
import {DateHelper} from '../../../../shared/date-helper';
import {Paymenttype} from '../../../../entities/paymenttype';
import {PaymenttypeService} from '../../../../services/paymenttype.service';
import {Consumeitempurchase} from '../../../../entities/consumeitempurchase';
import {ConsumeitempurchaseService} from '../../../../services/consumeitempurchase.service';
import {Observable} from "rxjs";
import {Procurementitempurchase} from "../../../../entities/procurementitempurchase";
import {map, startWith} from "rxjs/operators";

@Component({
  selector: 'app-consumeitempayment-form',
  templateUrl: './consumeitempayment-form.component.html',
  styleUrls: ['./consumeitempayment-form.component.scss']
})
export class ConsumeitempaymentFormComponent extends AbstractComponent implements OnInit {

  consumeitempurchases: Consumeitempurchase[] = [];
  paymenttypes: Paymenttype[] = [];
  filteredOptions: Observable<Consumeitempurchase[]>;

  form = new FormGroup({
    consumeitempurchase: new FormControl(null, [
      Validators.required,
    ]),
    date: new FormControl(null ),
    amount: new FormControl(null, [
      Validators.required,
      Validators.min(0),
      Validators.max(10000000),
      Validators.pattern('^([0-9]{1,8}([.][0-9]{1,2})?)$'),
    ]),
    paymenttype: new FormControl(null, [
      Validators.required,
    ]),
    chequeno: new FormControl(),
    chequedate: new FormControl(),
    chequebank: new FormControl(),
    chequebranch: new FormControl(),
    description: new FormControl(null, [
      Validators.minLength(null),
      Validators.maxLength(65535),
    ]),
    balance: new FormControl(0),
    searchProcurementitempurchase: new FormControl(),
  });

  get consumeitempurchaseField(): FormControl{
    return this.form.controls.consumeitempurchase as FormControl;
  }

  get dateField(): FormControl{
    return this.form.controls.date as FormControl;
  }

  get amountField(): FormControl{
    return this.form.controls.amount as FormControl;
  }

  get paymenttypeField(): FormControl{
    return this.form.controls.paymenttype as FormControl;
  }

  get chequenoField(): FormControl{
    return this.form.controls.chequeno as FormControl;
  }

  get chequedateField(): FormControl{
    return this.form.controls.chequedate as FormControl;
  }

  get chequebankField(): FormControl{
    return this.form.controls.chequebank as FormControl;
  }

  get chequebranchField(): FormControl{
    return this.form.controls.chequebranch as FormControl;
  }

  get descriptionField(): FormControl{
    return this.form.controls.description as FormControl;
  }

  get searchProcurementitempurchaseField(): FormControl{
    return this.form.controls.searchProcurementitempurchase as FormControl;
  }

  get balanceField(): FormControl{
    return this.form.controls.balance as FormControl;
  }

  private _filterProcurementitempurchases(value: string): Consumeitempurchase[] {
    const filterValue = value.toLowerCase();

    return this.consumeitempurchases.filter(procurementitempurchase => procurementitempurchase.code.toLowerCase().indexOf(filterValue) === 0);
  }

  constructor(
    private consumeitempurchaseService: ConsumeitempurchaseService,
    private paymenttypeService: PaymenttypeService,
    private consumeitempaymentService: ConsumeitempaymentService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {
    super();
    this.filteredOptions = this.searchProcurementitempurchaseField.valueChanges
      .pipe(
        startWith(''),
        map(consumeitempurchase => consumeitempurchase ? this._filterProcurementitempurchases(consumeitempurchase) : this.consumeitempurchases.slice())
      );
  }

  ngOnInit(): void {
    this.loadData();
    this.refreshData();
  }

async loadData(): Promise<any>{

    this.updatePrivileges();
    if (!this.privilege.add) { return; }
    this.balanceField.disable();
    this.consumeitempurchaseService.getAllNonePayed().then((consumeitempurchaseDataPage) => {
      this.consumeitempurchases = consumeitempurchaseDataPage;
    }).catch((e) => {
      console.log(e);
      this.snackBar.open('Something is wrong', null, {duration: 2000});
    });
    this.paymenttypeService.getAll().then((paymenttypes) => {
      this.paymenttypes = paymenttypes;
    }).catch((e) => {
      console.log(e);
      this.snackBar.open('Something is wrong', null, {duration: 2000});
    });
  }

  updatePrivileges(): any {
    this.privilege.add = LoggedUser.can(UsecaseList.ADD_CONSUMEITEMPAYMENT);
    this.privilege.showAll = LoggedUser.can(UsecaseList.SHOW_ALL_CONSUMEITEMPAYMENTS);
    this.privilege.showOne = LoggedUser.can(UsecaseList.SHOW_CONSUMEITEMPAYMENT_DETAILS);
    this.privilege.delete = LoggedUser.can(UsecaseList.DELETE_CONSUMEITEMPAYMENT);
    this.privilege.update = LoggedUser.can(UsecaseList.UPDATE_CONSUMEITEMPAYMENT);
  }

  async submit(): Promise<void> {
    if (this.form.invalid) { return; }

    const consumeitempayment: Consumeitempayment = new Consumeitempayment();
    consumeitempayment.consumeitempurchase = this.consumeitempurchaseField.value;
    consumeitempayment.date = DateHelper.getDateAsString(this.dateField.value);
    consumeitempayment.amount = this.amountField.value;
    consumeitempayment.paymenttype = this.paymenttypeField.value;
    consumeitempayment.chequeno = this.chequenoField.value;
    consumeitempayment.chequedate = this.chequedateField.value ? DateHelper.getDateAsString(this.chequedateField.value) : null;
    consumeitempayment.chequebank = this.chequebankField.value;
    consumeitempayment.chequebranch = this.chequebranchField.value;
    consumeitempayment.description = this.descriptionField.value;
    try{
      const resourceLink: ResourceLink = await this.consumeitempaymentService.add(consumeitempayment);
      if (this.privilege.showOne) {
        await this.router.navigateByUrl('/consumeitempayments/' + resourceLink.id);
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
          if (msg.consumeitempurchase) { this.consumeitempurchaseField.setErrors({server: msg.consumeitempurchase}); knownError = true; }
          if (msg.date) { this.dateField.setErrors({server: msg.date}); knownError = true; }
          if (msg.amount) { this.amountField.setErrors({server: msg.amount}); knownError = true; }
          if (msg.paymenttype) { this.paymenttypeField.setErrors({server: msg.paymenttype}); knownError = true; }
          if (msg.chequeno) { this.chequenoField.setErrors({server: msg.chequeno}); knownError = true; }
          if (msg.chequedate) { this.chequedateField.setErrors({server: msg.chequedate}); knownError = true; }
          if (msg.chequebank) { this.chequebankField.setErrors({server: msg.chequebank}); knownError = true; }
          if (msg.chequebranch) { this.chequebranchField.setErrors({server: msg.chequebranch}); knownError = true; }
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

  async updateAmount(): Promise<void> {
    this.amountField.setValue(this.consumeitempurchaseField.value.balance);
    this.amountField.setValidators(Validators.max(this.consumeitempurchaseField.value.balance));
    this.amountField.updateValueAndValidity();
  }

  updateBalance(): void {
    if (this.consumeitempurchaseField.value){
      if (this.amountField.value){
        this.balanceField.patchValue(parseFloat(this.consumeitempurchaseField.value.balance) - parseFloat(this.amountField.value));
      }else {
        this.balanceField.patchValue(parseFloat(this.consumeitempurchaseField.value.balance));
      }
    }
  }

  paymentValidation(): void {
    if (this.paymenttypeField.value === 2){
      this.chequenoField.setValidators([
        Validators.required,
        Validators.minLength(null),
        Validators.maxLength(45),
        Validators.pattern('^[0-9]{5,}$'),
      ]);
      this.chequenoField.updateValueAndValidity();
      this.chequedateField.setValidators([
        Validators.required,
      ]);
      this.chequedateField.updateValueAndValidity();
      this.chequebankField.setValidators([
        Validators.required,
        Validators.minLength(null),
        Validators.maxLength(45),
        Validators.pattern('^[a-zA-Z ]{3,}$'),
      ]);
      this.chequebankField.updateValueAndValidity();
      this.chequebranchField.setValidators([
        Validators.required,
        Validators.minLength(null),
        Validators.maxLength(45),
        Validators.pattern('^[a-zA-Z ]{3,}$'),
      ]);
      this.chequebranchField.updateValueAndValidity();

    }else {
      this.chequenoField.setValidators(null);
      this.chequenoField.patchValue(null);
      this.chequenoField.updateValueAndValidity();
      this.chequenoField.reset();

      this.chequedateField.setValidators(null);
      this.chequedateField.patchValue(null);
      this.chequedateField.updateValueAndValidity();
      this.chequedateField.reset();

      this.chequebankField.setValidators(null);
      this.chequebankField.patchValue(null);
      this.chequebankField.updateValueAndValidity();
      this.chequebankField.reset();

      this.chequebranchField.setValidators(null);
      this.chequebranchField.patchValue(null);
      this.chequebranchField.updateValueAndValidity();
      this.chequebranchField.reset();
    }
  }


  setSearchValue(option: any): void{
    console.log(option);
    this.consumeitempurchaseField.patchValue(option);
    this.searchProcurementitempurchaseField.disable();
  }
}
