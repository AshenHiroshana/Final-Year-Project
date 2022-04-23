import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {MatSnackBar} from '@angular/material/snack-bar';
import {LoggedUser} from '../../../../shared/logged-user';
import {UsecaseList} from '../../../../usecase-list';
import {ResourceLink} from '../../../../shared/resource-link';
import {AbstractComponent} from '../../../../shared/abstract-component';
import {PageRequest} from '../../../../shared/page-request';
import {Servicerefund} from '../../../../entities/servicerefund';
import {ServicerefundService} from '../../../../services/servicerefund.service';
import {Service} from '../../../../entities/service';
import {DateHelper} from '../../../../shared/date-helper';
import {Paymenttype} from '../../../../entities/paymenttype';
import {Paymentstatus} from '../../../../entities/paymentstatus';
import {ServiceService} from '../../../../services/service.service';
import {PaymenttypeService} from '../../../../services/paymenttype.service';
import {PaymentstatusService} from '../../../../services/paymentstatus.service';

@Component({
  selector: 'app-servicerefund-update-form',
  templateUrl: './servicerefund-update-form.component.html',
  styleUrls: ['./servicerefund-update-form.component.scss']
})
export class ServicerefundUpdateFormComponent extends AbstractComponent implements OnInit {

  selectedId: number;
  servicerefund: Servicerefund;

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

  constructor(
    private serviceService: ServiceService,
    private paymentstatusService: PaymentstatusService,
    private paymenttypeService: PaymenttypeService,
    private servicerefundService: ServicerefundService,
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

    this.updatePrivileges();
    if (!this.privilege.update) { return; }

    this.serviceService.getAllBasic(new PageRequest()).then((serviceDataPage) => {
      this.services = serviceDataPage.content;
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
    this.servicerefund = await this.servicerefundService.get(this.selectedId);
    this.setValues();
  }

  updatePrivileges(): any {
    this.privilege.add = LoggedUser.can(UsecaseList.ADD_SERVICEREFUND);
    this.privilege.showAll = LoggedUser.can(UsecaseList.SHOW_ALL_SERVICEREFUNDS);
    this.privilege.showOne = LoggedUser.can(UsecaseList.SHOW_SERVICEREFUND_DETAILS);
    this.privilege.delete = LoggedUser.can(UsecaseList.DELETE_SERVICEREFUND);
    this.privilege.update = LoggedUser.can(UsecaseList.UPDATE_SERVICEREFUND);
  }

  discardChanges(): void{
    this.form.markAsPristine();
    this.form.markAsUntouched();
    this.setValues();
  }

  setValues(): void{
    if (this.serviceField.pristine) {
      this.serviceField.setValue(this.servicerefund.service.id);
    }
    if (this.dateField.pristine) {
      this.dateField.setValue(this.servicerefund.date);
    }
    if (this.amountField.pristine) {
      this.amountField.setValue(this.servicerefund.amount);
    }
    if (this.paymentstatusField.pristine) {
      this.paymentstatusField.setValue(this.servicerefund.paymentstatus.id);
    }
    if (this.paymenttypeField.pristine) {
      this.paymenttypeField.setValue(this.servicerefund.paymenttype.id);
    }
    if (this.chequenoField.pristine) {
      this.chequenoField.setValue(this.servicerefund.chequeno);
    }
    if (this.chequedateField.pristine) {
      this.chequedateField.setValue(this.servicerefund.chequedate);
    }
    if (this.chequebankField.pristine) {
      this.chequebankField.setValue(this.servicerefund.chequebank);
    }
    if (this.chequebranchField.pristine) {
      this.chequebranchField.setValue(this.servicerefund.chequebranch);
    }
    if (this.descriptionField.pristine) {
      this.descriptionField.setValue(this.servicerefund.description);
    }
}

  async submit(): Promise<void> {
    if (this.form.invalid) { return; }

    const newservicerefund: Servicerefund = new Servicerefund();
    newservicerefund.service = this.serviceField.value;
    newservicerefund.date = DateHelper.getDateAsString(this.dateField.value);
    newservicerefund.amount = this.amountField.value;
    newservicerefund.paymentstatus = this.paymentstatusField.value;
    newservicerefund.paymenttype = this.paymenttypeField.value;
    newservicerefund.chequeno = this.chequenoField.value;
    newservicerefund.chequedate = this.chequedateField.value ? DateHelper.getDateAsString(this.chequedateField.value) : null;
    newservicerefund.chequebank = this.chequebankField.value;
    newservicerefund.chequebranch = this.chequebranchField.value;
    newservicerefund.description = this.descriptionField.value;
    try{
      const resourceLink: ResourceLink = await this.servicerefundService.update(this.selectedId, newservicerefund);
      if (this.privilege.showOne) {
        await this.router.navigateByUrl('/servicerefunds/' + resourceLink.id);
      } else {
        await this.router.navigateByUrl('/servicerefunds');
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
}
