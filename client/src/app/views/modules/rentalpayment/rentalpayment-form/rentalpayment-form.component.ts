import { Component, OnInit } from '@angular/core';
import {ResourceLink} from '../../../../shared/resource-link';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Router} from '@angular/router';
import {AbstractComponent} from '../../../../shared/abstract-component';
import {LoggedUser} from '../../../../shared/logged-user';
import {UsecaseList} from '../../../../usecase-list';
import {PageRequest} from '../../../../shared/page-request';
import {Rentalpayment} from '../../../../entities/rentalpayment';
import {RentalpaymentService} from '../../../../services/rentalpayment.service';
import {Rental} from '../../../../entities/rental';
import {DateHelper} from '../../../../shared/date-helper';
import {Paymenttype} from '../../../../entities/paymenttype';
import {RentalService} from '../../../../services/rental.service';
import {PaymenttypeService} from '../../../../services/paymenttype.service';
import {Observable} from "rxjs";
import {map, startWith} from "rxjs/operators";

@Component({
  selector: 'app-rentalpayment-form',
  templateUrl: './rentalpayment-form.component.html',
  styleUrls: ['./rentalpayment-form.component.scss']
})
export class RentalpaymentFormComponent extends AbstractComponent implements OnInit {
  date: Date;
  rentals: Rental[] = [];
  paymenttypes: Paymenttype[] = [];
  filteredOptions: Observable<Rental[]>;
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
    searchRental: new FormControl(),
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

  get searchRentalField(): FormControl{
    return this.form.controls.searchRental as FormControl;
  }

  private _filterRentals(value: string): Rental[] {
    const filterValue = value.toLowerCase();

    return this.rentals.filter(rental => rental.name.toLowerCase().indexOf(filterValue) === 0);
  }

  constructor(
    private rentalService: RentalService,
    private paymenttypeService: PaymenttypeService,
    private rentalpaymentService: RentalpaymentService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {
    super();
    this.filteredOptions = this.searchRentalField.valueChanges
      .pipe(
        startWith(''),
        map(rental => rental ? this._filterRentals(rental) : this.rentals.slice())
      );
  }

  ngOnInit(): void {
    this.loadData();
    this.refreshData();
  }

async loadData(): Promise<any>{
    this.amountField.disable();
    this.updatePrivileges();
    if (!this.privilege.add) { return; }

    if (this.dateField.value){
      // tslint:disable-next-line:label-position
      this.date = this.dateField.value;
      console.log(this.date.getMonth());
      this.rentalService.getAllForPay(this.date.getMonth() + 1).then((rentalDataPage) => {
        this.rentals = rentalDataPage;
      }).catch((e) => {
        console.log(e);
        this.snackBar.open('Something is wrong', null, {duration: 2000});
      });
    }
    this.paymenttypeService.getAll().then((paymenttypes) => {
      this.paymenttypes = paymenttypes;
    }).catch((e) => {
      console.log(e);
      this.snackBar.open('Something is wrong', null, {duration: 2000});
    });
  }

  updatePrivileges(): any {
    this.privilege.add = LoggedUser.can(UsecaseList.ADD_RENTALPAYMENT);
    this.privilege.showAll = LoggedUser.can(UsecaseList.SHOW_ALL_RENTALPAYMENTS);
    this.privilege.showOne = LoggedUser.can(UsecaseList.SHOW_RENTALPAYMENT_DETAILS);
    this.privilege.delete = LoggedUser.can(UsecaseList.DELETE_RENTALPAYMENT);
    this.privilege.update = LoggedUser.can(UsecaseList.UPDATE_RENTALPAYMENT);
  }

  async submit(): Promise<void> {
    if (this.form.invalid) { return; }

    const rentalpayment: Rentalpayment = new Rentalpayment();
    rentalpayment.rental = this.rentalField.value;
    rentalpayment.date = DateHelper.getDateAsString(this.dateField.value);
    rentalpayment.amount = this.amountField.value;
    rentalpayment.paymenttype = this.paymenttypeField.value;
    rentalpayment.chequeno = this.chequenoField.value;
    rentalpayment.chequedate = this.chequedateField.value ? DateHelper.getDateAsString(this.chequedateField.value) : null;
    rentalpayment.chequebank = this.chequebankField.value;
    rentalpayment.chequebranch = this.chequebranchField.value;
    rentalpayment.description = this.descriptionField.value;
    try{
      const resourceLink: ResourceLink = await this.rentalpaymentService.add(rentalpayment);
      if (this.privilege.showOne) {
        await this.router.navigateByUrl('/rentalpayments/' + resourceLink.id);
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
          if (msg.rental) { this.rentalField.setErrors({server: msg.rental}); knownError = true; }
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
  setSearchValue(option: any): void{
    console.log(option);
    this.rentalField.patchValue(option);
    this.searchRentalField.disable();
  }
  async updateAmount(): Promise<void> {
    console.log(this.rentalField.value.amount);
    this.amountField.setValue(this.rentalField.value.amount);
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
  dateVaidation(): any {
    const date = new Date();
    return date;
  }
}
