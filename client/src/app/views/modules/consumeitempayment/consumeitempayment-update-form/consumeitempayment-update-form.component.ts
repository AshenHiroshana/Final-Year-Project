import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {MatSnackBar} from '@angular/material/snack-bar';
import {LoggedUser} from '../../../../shared/logged-user';
import {UsecaseList} from '../../../../usecase-list';
import {ResourceLink} from '../../../../shared/resource-link';
import {AbstractComponent} from '../../../../shared/abstract-component';
import {PageRequest} from '../../../../shared/page-request';
import {Consumeitempayment} from '../../../../entities/consumeitempayment';
import {ConsumeitempaymentService} from '../../../../services/consumeitempayment.service';
import {DateHelper} from '../../../../shared/date-helper';
import {Paymenttype} from '../../../../entities/paymenttype';
import {Paymentstatus} from '../../../../entities/paymentstatus';
import {PaymenttypeService} from '../../../../services/paymenttype.service';
import {Consumeitempurchase} from '../../../../entities/consumeitempurchase';
import {PaymentstatusService} from '../../../../services/paymentstatus.service';
import {ConsumeitempurchaseService} from '../../../../services/consumeitempurchase.service';

@Component({
  selector: 'app-consumeitempayment-update-form',
  templateUrl: './consumeitempayment-update-form.component.html',
  styleUrls: ['./consumeitempayment-update-form.component.scss']
})
export class ConsumeitempaymentUpdateFormComponent extends AbstractComponent implements OnInit {

  selectedId: number;
  consumeitempayment: Consumeitempayment;

  consumeitempurchases: Consumeitempurchase[] = [];
  paymentstatuses: Paymentstatus[] = [];
  paymenttypes: Paymenttype[] = [];

  form = new FormGroup({
    consumeitempurchase: new FormControl(null, [
      Validators.required,
    ]),
    date: new FormControl(null, [
      Validators.required,
    ]),
    amount: new FormControl(null, [
      Validators.required,
      Validators.min(0),
      Validators.max(10000000),
      Validators.pattern('^([0-9]{1,8}([.][0-9]{1,2})?)$'),
    ]),
    paymentstatus: new FormControl('1', [
      Validators.required,
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

  get paymentstatusField(): FormControl{
    return this.form.controls.paymentstatus as FormControl;
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

  get balanceField(): FormControl{
    return this.form.controls.balance as FormControl;
  }

  constructor(
    private consumeitempurchaseService: ConsumeitempurchaseService,
    private paymentstatusService: PaymentstatusService,
    private paymenttypeService: PaymenttypeService,
    private consumeitempaymentService: ConsumeitempaymentService,
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
    this.balanceField.disable();
    this.updatePrivileges();
    if (!this.privilege.update) { return; }

    this.consumeitempurchaseService.getAllBasic(new PageRequest()).then((consumeitempurchaseDataPage) => {
      this.consumeitempurchases = consumeitempurchaseDataPage.content;
    }).catch((e) => {
      console.log(e);
      this.snackBar.open('Something is wrong', null, {duration: 2000});
    });
    this.paymentstatusService.getAll().then((paymentstatuses) => {
      this.paymentstatuses = paymentstatuses;
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
    this.consumeitempayment = await this.consumeitempaymentService.get(this.selectedId);
    this.setValues();
  }

  updatePrivileges(): any {
    this.privilege.add = LoggedUser.can(UsecaseList.ADD_CONSUMEITEMPAYMENT);
    this.privilege.showAll = LoggedUser.can(UsecaseList.SHOW_ALL_CONSUMEITEMPAYMENTS);
    this.privilege.showOne = LoggedUser.can(UsecaseList.SHOW_CONSUMEITEMPAYMENT_DETAILS);
    this.privilege.delete = LoggedUser.can(UsecaseList.DELETE_CONSUMEITEMPAYMENT);
    this.privilege.update = LoggedUser.can(UsecaseList.UPDATE_CONSUMEITEMPAYMENT);
  }

  discardChanges(): void{
    this.form.markAsPristine();
    this.form.markAsUntouched();
    this.setValues();
  }

  setValues(): void{
    if (this.consumeitempurchaseField.pristine) {
      this.consumeitempurchaseField.setValue(this.consumeitempayment.consumeitempurchase.id);
    }
    if (this.dateField.pristine) {
      this.dateField.setValue(this.consumeitempayment.date);
    }
    if (this.amountField.pristine) {
      this.amountField.setValue(this.consumeitempayment.amount);
    }
    if (this.paymentstatusField.pristine) {
      this.paymentstatusField.setValue(this.consumeitempayment.paymentstatus.id);
    }
    if (this.paymenttypeField.pristine) {
      this.paymenttypeField.setValue(this.consumeitempayment.paymenttype.id);
    }
    if (this.chequenoField.pristine) {
      this.chequenoField.setValue(this.consumeitempayment.chequeno);
    }
    if (this.chequedateField.pristine) {
      this.chequedateField.setValue(this.consumeitempayment.chequedate);
    }
    if (this.chequebankField.pristine) {
      this.chequebankField.setValue(this.consumeitempayment.chequebank);
    }
    if (this.chequebranchField.pristine) {
      this.chequebranchField.setValue(this.consumeitempayment.chequebranch);
    }
    if (this.descriptionField.pristine) {
      this.descriptionField.setValue(this.consumeitempayment.description);
    }

    if (this.amountField.pristine) {
      this.updateAmount();
      this.updateBalance();
    }
}

  async submit(): Promise<void> {
    if (this.form.invalid) { return; }

    const newconsumeitempayment: Consumeitempayment = new Consumeitempayment();
    newconsumeitempayment.consumeitempurchase = this.consumeitempurchaseField.value;
    newconsumeitempayment.date = DateHelper.getDateAsString(this.dateField.value);
    newconsumeitempayment.amount = this.amountField.value;
    newconsumeitempayment.paymentstatus = this.paymentstatusField.value;
    newconsumeitempayment.paymenttype = this.paymenttypeField.value;
    newconsumeitempayment.chequeno = this.chequenoField.value;
    newconsumeitempayment.chequedate = this.chequedateField.value ? DateHelper.getDateAsString(this.chequedateField.value) : null;
    newconsumeitempayment.chequebank = this.chequebankField.value;
    newconsumeitempayment.chequebranch = this.chequebranchField.value;
    newconsumeitempayment.description = this.descriptionField.value;
    try{
      const resourceLink: ResourceLink = await this.consumeitempaymentService.update(this.selectedId, newconsumeitempayment);
      if (this.privilege.showOne) {
        await this.router.navigateByUrl('/consumeitempayments/' + resourceLink.id);
      } else {
        await this.router.navigateByUrl('/consumeitempayments');
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
          if (msg.paymentstatus) { this.paymentstatusField.setErrors({server: msg.paymentstatus}); knownError = true; }
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

  updateAmount(): void{
    this.amountField.setValue(this.consumeitempayment.amount);
    this.amountField.setValidators(Validators.max(this.consumeitempayment.consumeitempurchase.balance + this.consumeitempayment.amount));
    this.amountField.updateValueAndValidity();
    this.balanceField.setValue(this.consumeitempayment.consumeitempurchase.balance);
  }

  updateBalance(): void {
    if (this.amountField.value){
      this.balanceField.patchValue(this.consumeitempayment.consumeitempurchase.balance + this.consumeitempayment.amount - parseFloat(this.amountField.value));
    }else {
      this.balanceField.setValue(this.consumeitempayment.consumeitempurchase.balance);
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

  paymentstatuseOptionDisable(paymentstatus: any): boolean {
    if (this.consumeitempayment.paymentstatus.id === 1){
      return true;
    }
    if (this.consumeitempayment.paymentstatus.id === 2){
      return false;
    }
    if (this.consumeitempayment.paymentstatus.id === 3){
      if (paymentstatus.id === 1){
        return true;
      }else if (paymentstatus.id === 2){
        return false;
      }else if (paymentstatus.id === 3){
        return false;
      }
    }
    return  false;
  }
}
