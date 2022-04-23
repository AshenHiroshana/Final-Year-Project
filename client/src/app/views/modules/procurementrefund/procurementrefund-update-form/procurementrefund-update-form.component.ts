import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {MatSnackBar} from '@angular/material/snack-bar';
import {LoggedUser} from '../../../../shared/logged-user';
import {UsecaseList} from '../../../../usecase-list';
import {ResourceLink} from '../../../../shared/resource-link';
import {AbstractComponent} from '../../../../shared/abstract-component';
import {PageRequest} from '../../../../shared/page-request';
import {Procurementrefund} from '../../../../entities/procurementrefund';
import {ProcurementrefundService} from '../../../../services/procurementrefund.service';
import {DateHelper} from '../../../../shared/date-helper';
import {Paymenttype} from '../../../../entities/paymenttype';
import {Paymentstatus} from '../../../../entities/paymentstatus';
import {Procurementitem} from '../../../../entities/procurementitem';
import {PaymenttypeService} from '../../../../services/paymenttype.service';
import {PaymentstatusService} from '../../../../services/paymentstatus.service';
import {ProcurementitemService} from '../../../../services/procurementitem.service';
import {Procurementitempurchase} from '../../../../entities/procurementitempurchase';
import {ProcurementitempurchaseService} from '../../../../services/procurementitempurchase.service';

@Component({
  selector: 'app-procurementrefund-update-form',
  templateUrl: './procurementrefund-update-form.component.html',
  styleUrls: ['./procurementrefund-update-form.component.scss']
})
export class ProcurementrefundUpdateFormComponent extends AbstractComponent implements OnInit {

  selectedId: number;
  procurementrefund: Procurementrefund;

  procurementitempurchases: Procurementitempurchase[] = [];
  paymentstatuses: Paymentstatus[] = [];
  paymenttypes: Paymenttype[] = [];
  procurementitems: Procurementitem[] = [];

  form = new FormGroup({
    procurementitempurchase: new FormControl(null, [
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
    procurementitems: new FormControl(),
    description: new FormControl(null, [
      Validators.minLength(null),
      Validators.maxLength(65535),
    ]),
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

  get procurementitemsField(): FormControl{
    return this.form.controls.procurementitems as FormControl;
  }

  get descriptionField(): FormControl{
    return this.form.controls.description as FormControl;
  }

  constructor(
    private procurementitempurchaseService: ProcurementitempurchaseService,
    private paymentstatusService: PaymentstatusService,
    private paymenttypeService: PaymenttypeService,
    private procurementitemService: ProcurementitemService,
    private procurementrefundService: ProcurementrefundService,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar,
    private router: Router
  ) {
    super();
  }

  ngOnInit(): void {
    this.procurementitemService.getAllBasic(new PageRequest()).then((procurementitemDataPage) => {
      this.procurementitems = procurementitemDataPage.content;
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

    this.procurementitempurchaseService.getAllBasic(new PageRequest()).then((procurementitempurchaseDataPage) => {
      this.procurementitempurchases = procurementitempurchaseDataPage.content;
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
    this.procurementrefund = await this.procurementrefundService.get(this.selectedId);
    this.setValues();
  }

  updatePrivileges(): any {
    this.privilege.add = LoggedUser.can(UsecaseList.ADD_PROCUREMENTREFUND);
    this.privilege.showAll = LoggedUser.can(UsecaseList.SHOW_ALL_PROCUREMENTREFUNDS);
    this.privilege.showOne = LoggedUser.can(UsecaseList.SHOW_PROCUREMENTREFUND_DETAILS);
    this.privilege.delete = LoggedUser.can(UsecaseList.DELETE_PROCUREMENTREFUND);
    this.privilege.update = LoggedUser.can(UsecaseList.UPDATE_PROCUREMENTREFUND);
  }

  discardChanges(): void{
    this.form.markAsPristine();
    this.form.markAsUntouched();
    this.setValues();
  }

  setValues(): void{
    if (this.procurementitempurchaseField.pristine) {
      this.procurementitempurchaseField.setValue(this.procurementrefund.procurementitempurchase.id);
    }
    if (this.dateField.pristine) {
      this.dateField.setValue(this.procurementrefund.date);
    }
    if (this.amountField.pristine) {
      this.amountField.setValue(this.procurementrefund.amount);
    }
    if (this.paymentstatusField.pristine) {
      this.paymentstatusField.setValue(this.procurementrefund.paymentstatus.id);
    }
    if (this.paymenttypeField.pristine) {
      this.paymenttypeField.setValue(this.procurementrefund.paymenttype.id);
    }
    if (this.chequenoField.pristine) {
      this.chequenoField.setValue(this.procurementrefund.chequeno);
    }
    if (this.chequedateField.pristine) {
      this.chequedateField.setValue(this.procurementrefund.chequedate);
    }
    if (this.chequebankField.pristine) {
      this.chequebankField.setValue(this.procurementrefund.chequebank);
    }
    if (this.chequebranchField.pristine) {
      this.chequebranchField.setValue(this.procurementrefund.chequebranch);
    }
    if (this.procurementitemsField.pristine) {
      this.procurementitemsField.setValue(this.procurementrefund.procurementitemList);
    }
    if (this.descriptionField.pristine) {
      this.descriptionField.setValue(this.procurementrefund.description);
    }
}

  async submit(): Promise<void> {
    this.procurementitemsField.updateValueAndValidity();
    this.procurementitemsField.markAsTouched();
    if (this.form.invalid) { return; }

    const newprocurementrefund: Procurementrefund = new Procurementrefund();
    newprocurementrefund.procurementitempurchase = this.procurementitempurchaseField.value;
    newprocurementrefund.date = DateHelper.getDateAsString(this.dateField.value);
    newprocurementrefund.amount = this.amountField.value;
    newprocurementrefund.paymentstatus = this.paymentstatusField.value;
    newprocurementrefund.paymenttype = this.paymenttypeField.value;
    newprocurementrefund.chequeno = this.chequenoField.value;
    newprocurementrefund.chequedate = this.chequedateField.value ? DateHelper.getDateAsString(this.chequedateField.value) : null;
    newprocurementrefund.chequebank = this.chequebankField.value;
    newprocurementrefund.chequebranch = this.chequebranchField.value;
    newprocurementrefund.procurementitemList = this.procurementitemsField.value;
    newprocurementrefund.description = this.descriptionField.value;
    try{
      const resourceLink: ResourceLink = await this.procurementrefundService.update(this.selectedId, newprocurementrefund);
      if (this.privilege.showOne) {
        await this.router.navigateByUrl('/procurementrefunds/' + resourceLink.id);
      } else {
        await this.router.navigateByUrl('/procurementrefunds');
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
          if (msg.paymentstatus) { this.paymentstatusField.setErrors({server: msg.paymentstatus}); knownError = true; }
          if (msg.paymenttype) { this.paymenttypeField.setErrors({server: msg.paymenttype}); knownError = true; }
          if (msg.chequeno) { this.chequenoField.setErrors({server: msg.chequeno}); knownError = true; }
          if (msg.chequedate) { this.chequedateField.setErrors({server: msg.chequedate}); knownError = true; }
          if (msg.chequebank) { this.chequebankField.setErrors({server: msg.chequebank}); knownError = true; }
          if (msg.chequebranch) { this.chequebranchField.setErrors({server: msg.chequebranch}); knownError = true; }
          if (msg.procurementitemList) { this.procurementitemsField.setErrors({server: msg.procurementitemList}); knownError = true; }
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
