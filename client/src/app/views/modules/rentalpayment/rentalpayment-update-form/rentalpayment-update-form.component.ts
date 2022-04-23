import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {MatSnackBar} from '@angular/material/snack-bar';
import {LoggedUser} from '../../../../shared/logged-user';
import {UsecaseList} from '../../../../usecase-list';
import {ResourceLink} from '../../../../shared/resource-link';
import {AbstractComponent} from '../../../../shared/abstract-component';
import {PageRequest} from '../../../../shared/page-request';
import {Rentalpayment} from '../../../../entities/rentalpayment';
import {RentalpaymentService} from '../../../../services/rentalpayment.service';
import {Rental} from '../../../../entities/rental';
import {DateHelper} from '../../../../shared/date-helper';
import {Paymenttype} from '../../../../entities/paymenttype';
import {Paymentstatus} from '../../../../entities/paymentstatus';
import {RentalService} from '../../../../services/rental.service';
import {PaymenttypeService} from '../../../../services/paymenttype.service';
import {PaymentstatusService} from '../../../../services/paymentstatus.service';

@Component({
  selector: 'app-rentalpayment-update-form',
  templateUrl: './rentalpayment-update-form.component.html',
  styleUrls: ['./rentalpayment-update-form.component.scss']
})
export class RentalpaymentUpdateFormComponent extends AbstractComponent implements OnInit {

  selectedId: number;
  rentalpayment: Rentalpayment;

  rentals: Rental[] = [];
  paymentstatuses: Paymentstatus[] = [];
  paymenttypes: Paymenttype[] = [];

  form = new FormGroup({
    rental: new FormControl(null, [
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
  });

  get rentalField(): FormControl{
    return this.form.controls.rental as FormControl;
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

  constructor(
    private rentalService: RentalService,
    private paymentstatusService: PaymentstatusService,
    private paymenttypeService: PaymenttypeService,
    private rentalpaymentService: RentalpaymentService,
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
    this.amountField.disable();
    this.updatePrivileges();
    if (!this.privilege.update) { return; }

    this.rentalService.getAllBasic(new PageRequest()).then((rentalDataPage) => {
      this.rentals = rentalDataPage.content;
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
    this.rentalpayment = await this.rentalpaymentService.get(this.selectedId);
    this.setValues();
  }

  updatePrivileges(): any {
    this.privilege.add = LoggedUser.can(UsecaseList.ADD_RENTALPAYMENT);
    this.privilege.showAll = LoggedUser.can(UsecaseList.SHOW_ALL_RENTALPAYMENTS);
    this.privilege.showOne = LoggedUser.can(UsecaseList.SHOW_RENTALPAYMENT_DETAILS);
    this.privilege.delete = LoggedUser.can(UsecaseList.DELETE_RENTALPAYMENT);
    this.privilege.update = LoggedUser.can(UsecaseList.UPDATE_RENTALPAYMENT);
  }

  discardChanges(): void{
    this.form.markAsPristine();
    this.form.markAsUntouched();
    this.setValues();
  }

  setValues(): void{
    if (this.rentalField.pristine) {
      this.rentalField.setValue(this.rentalpayment.rental.id);
    }
    if (this.dateField.pristine) {
      this.dateField.setValue(this.rentalpayment.date);
    }
    if (this.amountField.pristine) {
      this.amountField.setValue(this.rentalpayment.amount);
    }
    if (this.paymentstatusField.pristine) {
      this.paymentstatusField.setValue(this.rentalpayment.paymentstatus.id);
    }
    if (this.paymenttypeField.pristine) {
      this.paymenttypeField.setValue(this.rentalpayment.paymenttype.id);
    }
    if (this.chequenoField.pristine) {
      this.chequenoField.setValue(this.rentalpayment.chequeno);
    }
    if (this.chequedateField.pristine) {
      this.chequedateField.setValue(this.rentalpayment.chequedate);
    }
    if (this.chequebankField.pristine) {
      this.chequebankField.setValue(this.rentalpayment.chequebank);
    }
    if (this.chequebranchField.pristine) {
      this.chequebranchField.setValue(this.rentalpayment.chequebranch);
    }
    if (this.descriptionField.pristine) {
      this.descriptionField.setValue(this.rentalpayment.description);
    }
}

  async submit(): Promise<void> {
    if (this.form.invalid) { return; }

    const newrentalpayment: Rentalpayment = new Rentalpayment();
    newrentalpayment.rental = this.rentalField.value;
    newrentalpayment.date = DateHelper.getDateAsString(this.dateField.value);
    newrentalpayment.amount = this.amountField.value;
    newrentalpayment.paymentstatus = this.paymentstatusField.value;
    newrentalpayment.paymenttype = this.paymenttypeField.value;
    newrentalpayment.chequeno = this.chequenoField.value;
    newrentalpayment.chequedate = this.chequedateField.value ? DateHelper.getDateAsString(this.chequedateField.value) : null;
    newrentalpayment.chequebank = this.chequebankField.value;
    newrentalpayment.chequebranch = this.chequebranchField.value;
    newrentalpayment.description = this.descriptionField.value;
    try{
      const resourceLink: ResourceLink = await this.rentalpaymentService.update(this.selectedId, newrentalpayment);
      if (this.privilege.showOne) {
        await this.router.navigateByUrl('/rentalpayments/' + resourceLink.id);
      } else {
        await this.router.navigateByUrl('/rentalpayments');
      }
    }catch (e) {
      switch (e.status) {
        case 401: break;
        case 403: this.snackBar.open(e.error.message, null, {duration: 2000}); break;
        case 400:
          const msg = JSON.parse(e.error.message);
          let knownError = false;
          if (msg.rental) { this.rentalField.setErrors({server: msg.rental}); knownError = true; }
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

  paymentValidation(): void {
    if (this.paymenttypeField.value === 2) {
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

    } else {
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
}
