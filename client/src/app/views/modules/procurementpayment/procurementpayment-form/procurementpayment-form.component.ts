import { Component, OnInit } from '@angular/core';
import {ResourceLink} from '../../../../shared/resource-link';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Router} from '@angular/router';
import {AbstractComponent} from '../../../../shared/abstract-component';
import {LoggedUser} from '../../../../shared/logged-user';
import {UsecaseList} from '../../../../usecase-list';
import {PageRequest} from '../../../../shared/page-request';
import {Procurementpayment} from '../../../../entities/procurementpayment';
import {ProcurementpaymentService} from '../../../../services/procurementpayment.service';
import {DateHelper} from '../../../../shared/date-helper';
import {Paymenttype} from '../../../../entities/paymenttype';
import {PaymenttypeService} from '../../../../services/paymenttype.service';
import {Procurementitempurchase} from '../../../../entities/procurementitempurchase';
import {ProcurementitempurchaseService} from '../../../../services/procurementitempurchase.service';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';

@Component({
  selector: 'app-procurementpayment-form',
  templateUrl: './procurementpayment-form.component.html',
  styleUrls: ['./procurementpayment-form.component.scss']
})
export class ProcurementpaymentFormComponent extends AbstractComponent implements OnInit {

  procurementitempurchases: Procurementitempurchase[] = [];
  paymenttypes: Paymenttype[] = [];

  filteredOptions: Observable<Procurementitempurchase[]>;

  procurementitempurchase: Procurementitempurchase;


  constructor(
    private procurementitempurchaseService: ProcurementitempurchaseService,
    private paymenttypeService: PaymenttypeService,
    private procurementpaymentService: ProcurementpaymentService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {
    super();
    this.filteredOptions = this.searchProcurementitempurchaseField.valueChanges
      .pipe(
        startWith(''),
        map(procurementitempurchase => procurementitempurchase ? this._filterProcurementitempurchases(procurementitempurchase) : this.procurementitempurchases.slice())
      );
  }

  form = new FormGroup({
    procurementitempurchase: new FormControl(null, [
      Validators.required,
    ]),
    date: new FormControl(),
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



  get procurementitempurchaseField(): FormControl{
    return this.form.controls.procurementitempurchase as FormControl;
  }

  get dateField(): FormControl{
    return this.form.controls.date as FormControl;
  }

  get amountField(): FormControl{
    return this.form.controls.amount as FormControl;
  }

  get balanceField(): FormControl{
    return this.form.controls.balance as FormControl;
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

  private _filterProcurementitempurchases(value: string): Procurementitempurchase[] {
    const filterValue = value.toLowerCase();

    return this.procurementitempurchases.filter(procurementitempurchase => procurementitempurchase.code.toLowerCase().indexOf(filterValue) === 0);
  }

  ngOnInit(): void {
    this.balanceField.disable();
    this.procurementitempurchaseService.getAllNonePayed().then((procurementitempurchase) => {
      this.procurementitempurchases = procurementitempurchase;
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
    this.loadData();
    this.refreshData();
  }

async loadData(): Promise<any>{

    this.updatePrivileges();
    if (!this.privilege.add) { return; }
  }

  updatePrivileges(): any {
    this.privilege.add = LoggedUser.can(UsecaseList.ADD_PROCUREMENTPAYMENT);
    this.privilege.showAll = LoggedUser.can(UsecaseList.SHOW_ALL_PROCUREMENTPAYMENTS);
    this.privilege.showOne = LoggedUser.can(UsecaseList.SHOW_PROCUREMENTPAYMENT_DETAILS);
    this.privilege.delete = LoggedUser.can(UsecaseList.DELETE_PROCUREMENTPAYMENT);
    this.privilege.update = LoggedUser.can(UsecaseList.UPDATE_PROCUREMENTPAYMENT);
  }

  async submit(): Promise<void> {
    if (this.form.invalid) { return; }

    const procurementpayment: Procurementpayment = new Procurementpayment();
    procurementpayment.procurementitempurchase = this.procurementitempurchaseField.value;
    procurementpayment.amount = this.amountField.value;
    procurementpayment.paymenttype = this.paymenttypeField.value;
    procurementpayment.chequeno = this.chequenoField.value;
    procurementpayment.chequedate = this.chequedateField.value ? DateHelper.getDateAsString(this.chequedateField.value) : null;
    procurementpayment.chequebank = this.chequebankField.value;
    procurementpayment.chequebranch = this.chequebranchField.value;
    procurementpayment.description = this.descriptionField.value;
    try{
      const resourceLink: ResourceLink = await this.procurementpaymentService.add(procurementpayment);
      if (this.privilege.showOne) {
        await this.router.navigateByUrl('/procurementpayments/' + resourceLink.id);
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
          if (msg.procurementitempurchase) { this.procurementitempurchaseField.setErrors({server: msg.procurementitempurchase}); knownError = true; }
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
    this.amountField.setValue(this.procurementitempurchaseField.value.balance);
    this.amountField.setValidators(Validators.max(this.procurementitempurchaseField.value.balance));
    this.amountField.updateValueAndValidity();
  }

  updateBalance(): void {
    if (this.procurementitempurchaseField.value){
      if (this.amountField.value){
        this.balanceField.patchValue(parseFloat(this.procurementitempurchaseField.value.balance) - parseFloat(this.amountField.value));
      }else {
        this.balanceField.patchValue(parseFloat(this.procurementitempurchaseField.value.balance));
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
    this.procurementitempurchaseField.patchValue(option);
    this.searchProcurementitempurchaseField.disable();
  }

}
