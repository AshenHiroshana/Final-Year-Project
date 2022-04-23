import { Component, OnInit } from '@angular/core';
import {ResourceLink} from '../../../../shared/resource-link';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Router} from '@angular/router';
import {AbstractComponent} from '../../../../shared/abstract-component';
import {LoggedUser} from '../../../../shared/logged-user';
import {UsecaseList} from '../../../../usecase-list';
import {PageRequest} from '../../../../shared/page-request';
import {Servicerefund} from '../../../../entities/servicerefund';
import {ServicerefundService} from '../../../../services/servicerefund.service';
import {Service} from '../../../../entities/service';
import {DateHelper} from '../../../../shared/date-helper';
import {Paymenttype} from '../../../../entities/paymenttype';
import {ServiceService} from '../../../../services/service.service';
import {PaymenttypeService} from '../../../../services/paymenttype.service';
import {map, startWith} from "rxjs/operators";
import {Observable} from "rxjs";

@Component({
  selector: 'app-servicerefund-form',
  templateUrl: './servicerefund-form.component.html',
  styleUrls: ['./servicerefund-form.component.scss']
})
export class ServicerefundFormComponent extends AbstractComponent implements OnInit {

  services: Service[] = [];
  paymenttypes: Paymenttype[] = [];
  filteredOptions: Observable<Service[]>;
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
    searchService: new FormControl(),
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

  get searchServiceField(): FormControl{
    return this.form.controls.searchService as FormControl;
  }

  constructor(
    private serviceService: ServiceService,
    private paymenttypeService: PaymenttypeService,
    private servicerefundService: ServicerefundService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {
    super();
    this.filteredOptions = this.searchServiceField.valueChanges
      .pipe(
        startWith(''),
        map(service => service ? this._filterService(service) : this.services.slice())
      );
  }

  private _filterService(value: string): Service[] {
    const filterValue = value.toLowerCase();

    return this.services.filter(service => service.title.toLowerCase().indexOf(filterValue) === 0);
  }

  ngOnInit(): void {
    this.loadData();
    this.refreshData();
  }

async loadData(): Promise<any>{

    this.updatePrivileges();
    if (!this.privilege.add) { return; }

    this.serviceService.getAllNoneRefunded().then((serviceDataPage) => {
      this.services = serviceDataPage;
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
    this.privilege.add = LoggedUser.can(UsecaseList.ADD_SERVICEREFUND);
    this.privilege.showAll = LoggedUser.can(UsecaseList.SHOW_ALL_SERVICEREFUNDS);
    this.privilege.showOne = LoggedUser.can(UsecaseList.SHOW_SERVICEREFUND_DETAILS);
    this.privilege.delete = LoggedUser.can(UsecaseList.DELETE_SERVICEREFUND);
    this.privilege.update = LoggedUser.can(UsecaseList.UPDATE_SERVICEREFUND);
  }

  async submit(): Promise<void> {
    if (this.form.invalid) { return; }

    const servicerefund: Servicerefund = new Servicerefund();
    servicerefund.service = this.serviceField.value;
    servicerefund.date = DateHelper.getDateAsString(this.dateField.value);
    servicerefund.amount = this.amountField.value;
    servicerefund.paymenttype = this.paymenttypeField.value;
    servicerefund.chequeno = this.chequenoField.value;
    servicerefund.chequedate = this.chequedateField.value ? DateHelper.getDateAsString(this.chequedateField.value) : null;
    servicerefund.chequebank = this.chequebankField.value;
    servicerefund.chequebranch = this.chequebranchField.value;
    servicerefund.description = this.descriptionField.value;
    try{
      const resourceLink: ResourceLink = await this.servicerefundService.add(servicerefund);
      if (this.privilege.showOne) {
        await this.router.navigateByUrl('/servicerefunds/' + resourceLink.id);
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
          if (msg.service) { this.serviceField.setErrors({server: msg.service}); knownError = true; }
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
      this.chequenoField.updateValueAndValidity();
      this.chequenoField.reset();

      this.chequedateField.setValidators(null);
      this.chequedateField.updateValueAndValidity();
      this.chequedateField.reset();

      this.chequebankField.setValidators(null);
      this.chequebankField.updateValueAndValidity();
      this.chequebankField.reset();

      this.chequebranchField.setValidators(null);
      this.chequebranchField.updateValueAndValidity();
      this.chequebranchField.reset();
    }
  }

  setSearchValue(option: any): void{
    console.log(option);
    this.serviceField.patchValue(option);
    this.searchServiceField.disable();
  }
  dateVaidation(): any {
    const date = new Date();
    return date;
  }
}
