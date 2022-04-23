import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {MatSnackBar} from '@angular/material/snack-bar';
import {LoggedUser} from '../../../../shared/logged-user';
import {UsecaseList} from '../../../../usecase-list';
import {ResourceLink} from '../../../../shared/resource-link';
import {AbstractComponent} from '../../../../shared/abstract-component';
import {PageRequest} from '../../../../shared/page-request';
import {Servicepayment} from '../../../../entities/servicepayment';
import {ServicepaymentService} from '../../../../services/servicepayment.service';
import {Service} from '../../../../entities/service';
import {DateHelper} from '../../../../shared/date-helper';
import {Paymenttype} from '../../../../entities/paymenttype';
import {Paymentstatus} from '../../../../entities/paymentstatus';
import {ServiceService} from '../../../../services/service.service';
import {PaymenttypeService} from '../../../../services/paymenttype.service';
import {PaymentstatusService} from '../../../../services/paymentstatus.service';

@Component({
  selector: 'app-servicepayment-update-form',
  templateUrl: './servicepayment-update-form.component.html',
  styleUrls: ['./servicepayment-update-form.component.scss']
})
export class ServicepaymentUpdateFormComponent extends AbstractComponent implements OnInit {

  selectedId: number;
  servicepayment: Servicepayment;

  services: Service[] = [];
  paymentstatuses: Paymentstatus[] = [];
  paymenttypes: Paymenttype[] = [];

  form = new FormGroup({
    service: new FormControl(null, [
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
    chequeno: new FormControl(null, [
      Validators.required,
      Validators.minLength(null),
      Validators.maxLength(45),
      Validators.pattern('^[0-9]{5,}$'),
    ]),
    chequedate: new FormControl(null, [
      Validators.required,
    ]),
    chequebank: new FormControl(null, [
      Validators.required,
      Validators.minLength(null),
      Validators.maxLength(45),
      Validators.pattern('^[a-zA-Z ]{3,}$'),
    ]),
    chequebranch: new FormControl(null, [
      Validators.required,
      Validators.minLength(null),
      Validators.maxLength(45),
      Validators.pattern('^[a-zA-Z ]{3,}$'),
    ]),
    description: new FormControl(null, [
      Validators.minLength(null),
      Validators.maxLength(65535),
    ]),
    balance: new FormControl(0),
  });

  get serviceField(): FormControl{
    return this.form.controls.service as FormControl;
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
    private serviceService: ServiceService,
    private paymentstatusService: PaymentstatusService,
    private paymenttypeService: PaymenttypeService,
    private servicepaymentService: ServicepaymentService,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar,
    private router: Router
  ) {
    super();
  }

  ngOnInit(): void {
    this.balanceField.disable();
    this.serviceField.disable();
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
    this.route.paramMap.subscribe( async (params) => {
      this.selectedId =  + params.get('id');
      await this.loadData();
      this.refreshData();
    });
  }

  async loadData(): Promise<any>{

    this.updatePrivileges();
    if (!this.privilege.update) { return; }

    this.serviceService.getAllBasic(new PageRequest()).then((serviceDataPage) => {
      this.services = serviceDataPage.content;
    }).catch((e) => {
      console.log(e);
      this.snackBar.open('Something is wrong', null, {duration: 2000});
    });
    this.servicepayment = await this.servicepaymentService.get(this.selectedId);
    this.setValues();
  }

  updatePrivileges(): any {
    this.privilege.add = LoggedUser.can(UsecaseList.ADD_SERVICEPAYMENT);
    this.privilege.showAll = LoggedUser.can(UsecaseList.SHOW_ALL_SERVICEPAYMENTS);
    this.privilege.showOne = LoggedUser.can(UsecaseList.SHOW_SERVICEPAYMENT_DETAILS);
    this.privilege.delete = LoggedUser.can(UsecaseList.DELETE_SERVICEPAYMENT);
    this.privilege.update = LoggedUser.can(UsecaseList.UPDATE_SERVICEPAYMENT);
  }

  discardChanges(): void{
    this.form.markAsPristine();
    this.form.markAsUntouched();
    this.setValues();
  }

  setValues(): void{
    if (this.serviceField.pristine) {
      this.serviceField.setValue(this.servicepayment.service.id);
    }
    if (this.dateField.pristine) {
      this.dateField.setValue(this.servicepayment.date);
    }
    if (this.amountField.pristine) {
      this.amountField.setValue(this.servicepayment.amount);
    }
    if (this.paymentstatusField.pristine) {
      this.paymentstatusField.setValue(this.servicepayment.paymentstatus.id);
    }
    if (this.paymenttypeField.pristine) {
      this.paymenttypeField.setValue(this.servicepayment.paymenttype.id);
    }
    if (this.chequenoField.pristine) {
      this.chequenoField.setValue(this.servicepayment.chequeno);
    }
    if (this.chequedateField.pristine) {
      this.chequedateField.setValue(this.servicepayment.chequedate);
    }
    if (this.chequebankField.pristine) {
      this.chequebankField.setValue(this.servicepayment.chequebank);
    }
    if (this.chequebranchField.pristine) {
      this.chequebranchField.setValue(this.servicepayment.chequebranch);
    }
    if (this.descriptionField.pristine) {
      this.descriptionField.setValue(this.servicepayment.description);
    }

    if (this.amountField.pristine) {
      this.updateAmount();
      this.updateBalance();
    }
}

  async submit(): Promise<void> {
    if (this.form.invalid) { return; }

    const newservicepayment: Servicepayment = new Servicepayment();
    newservicepayment.service = this.serviceField.value;
    newservicepayment.date = DateHelper.getDateAsString(this.dateField.value);
    newservicepayment.amount = this.amountField.value;
    newservicepayment.paymentstatus = this.paymentstatusField.value;
    newservicepayment.paymenttype = this.paymenttypeField.value;
    newservicepayment.chequeno = this.chequenoField.value;
    newservicepayment.chequedate =this.chequedateField.value ? DateHelper.getDateAsString(this.chequedateField.value) : null;
    newservicepayment.chequebank = this.chequebankField.value;
    newservicepayment.chequebranch = this.chequebranchField.value;
    newservicepayment.description = this.descriptionField.value;
    try{
      const resourceLink: ResourceLink = await this.servicepaymentService.update(this.selectedId, newservicepayment);
      if (this.privilege.showOne) {
        await this.router.navigateByUrl('/servicepayments/' + resourceLink.id);
      } else {
        await this.router.navigateByUrl('/servicepayments');
      }
    }catch (e) {
      switch (e.status) {
        case 401: break;
        case 403: this.snackBar.open(e.error.message, null, {duration: 2000}); break;
        case 400:
          const msg = JSON.parse(e.error.message);
          let knownError = false;
          if (msg.service) { this.serviceField.setErrors({server: msg.service}); knownError = true; }
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
    this.amountField.setValue(this.servicepayment.amount);
    this.amountField.setValidators(Validators.max(this.servicepayment.service.balance + this.servicepayment.amount));
    this.amountField.updateValueAndValidity();
    this.balanceField.setValue(this.servicepayment.service.balance);
  }

  updateBalance(): void {
    if (this.amountField.value){
      this.balanceField.patchValue(this.servicepayment.service.balance + this.servicepayment.amount - parseFloat(this.amountField.value));
    }else {
      this.balanceField.setValue(this.servicepayment.service.balance);
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
    if (this.servicepayment.paymentstatus.id === 1){
      return true;
    }
    if (this.servicepayment.paymentstatus.id === 2){
      return false;
    }
    if (this.servicepayment.paymentstatus.id === 3){
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
