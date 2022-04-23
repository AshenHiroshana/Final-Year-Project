import { Component, OnInit } from '@angular/core';
import {ResourceLink} from '../../../../shared/resource-link';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Router} from '@angular/router';
import {AbstractComponent} from '../../../../shared/abstract-component';
import {LoggedUser} from '../../../../shared/logged-user';
import {UsecaseList} from '../../../../usecase-list';
import {PageRequest} from '../../../../shared/page-request';
import {Consumeitempurchase} from '../../../../entities/consumeitempurchase';
import {ConsumeitempurchaseService} from '../../../../services/consumeitempurchase.service';
import {ViewChild} from '@angular/core';
import {Vendor} from '../../../../entities/vendor';
import {DateHelper} from '../../../../shared/date-helper';
import {VendorService} from '../../../../services/vendor.service';
import {ConsumeitempurchaseconsumeitemSubFormComponent} from './consumeitempurchaseconsumeitem-sub-form/consumeitempurchaseconsumeitem-sub-form.component';
import {Consumeitem} from "../../../../entities/consumeitem";
import {ConsumeitemService} from "../../../../services/consumeitem.service";
import {Observable} from "rxjs";
import {map, startWith} from "rxjs/operators";
import {Procurementitem} from "../../../../entities/procurementitem";
import {Procurementpayment} from "../../../../entities/procurementpayment";
import {Paymenttype} from "../../../../entities/paymenttype";
import {Consumeitempayment} from "../../../../entities/consumeitempayment";
import {PaymenttypeService} from "../../../../services/paymenttype.service";
import {ConsumeitempaymentService} from "../../../../services/consumeitempayment.service";
import {Consumeitempurchaseconsumeitem} from "../../../../entities/consumeitempurchaseconsumeitem";

@Component({
  selector: 'app-consumeitempurchase-form',
  templateUrl: './consumeitempurchase-form.component.html',
  styleUrls: ['./consumeitempurchase-form.component.scss']
})
export class ConsumeitempurchaseFormComponent extends AbstractComponent implements OnInit {

  vendors: Vendor[] = [];
  consumeitems: Consumeitem[] = [];
  filteredOptions: Observable<Vendor[]>;
  @ViewChild(ConsumeitempurchaseconsumeitemSubFormComponent) consumeitempurchaseconsumeitemSubForm: ConsumeitempurchaseconsumeitemSubFormComponent;
  paymentAddPrivilage = false;
  vendorDisable = false;
  paymenttypes: Paymenttype [] = [];
  consumeitempayment: Consumeitempayment = new Consumeitempayment();

  form = new FormGroup({
    vendor: new FormControl(null, [
      Validators.required,
    ]),
    date: new FormControl(null, [
      Validators.required,
    ]),
    total: new FormControl(null, [
      Validators.required,
      Validators.min(0),
      Validators.max(10000000),
      Validators.pattern('^([0-9]{1,8}([.][0-9]{1,2})?)$'),
    ]),
    balance: new FormControl(null, [
      Validators.required,
      Validators.min(0),
      Validators.max(10000000),
      Validators.pattern('^([0-9]{1,8}([.][0-9]{1,2})?)$'),
    ]),
    consumeitempurchaseconsumeitems: new FormControl(),
    invoice: new FormControl(),
    description: new FormControl(null, [
      Validators.minLength(null),
      Validators.maxLength(65535),
    ]),
    searchVendor: new FormControl(),
    makepayment: new FormControl(''),
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
    discount: new FormControl(),
  });

  get discountField(): FormControl{
    return this.form.controls.discount as FormControl;
  }

  get vendorField(): FormControl{
    return this.form.controls.vendor as FormControl;
  }

  get dateField(): FormControl{
    return this.form.controls.date as FormControl;
  }

  get totalField(): FormControl{
    return this.form.controls.total as FormControl;
  }

  get balanceField(): FormControl{
    return this.form.controls.balance as FormControl;
  }

  get consumeitempurchaseconsumeitemsField(): FormControl{
    return this.form.controls.consumeitempurchaseconsumeitems as FormControl;
  }

  get invoiceField(): FormControl{
    return this.form.controls.invoice as FormControl;
  }

  get descriptionField(): FormControl{
    return this.form.controls.description as FormControl;
  }
  get searchVendorField(): FormControl{
    return this.form.controls.searchVendor as FormControl;
  }

  get makepaymentField(): FormControl{
    return this.form.controls.makepayment as FormControl;
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


  constructor(
    private vendorService: VendorService,
    private consumeitempurchaseService: ConsumeitempurchaseService,
    private consumeitemService: ConsumeitemService,
    private consumeitempaymentService: ConsumeitempaymentService,
    private snackBar: MatSnackBar,
    private paymenttypeService: PaymenttypeService,
    private router: Router
  ) {
    super();
    this.filteredOptions = this.searchVendorField.valueChanges
      .pipe(
        startWith(''),
        map(vendor => vendor ? this._filterProcurementitempurchases(vendor) : this.vendors.slice())
      );
  }

  private _filterProcurementitempurchases(value: string): Vendor[] {
    const filterValue = value.toLowerCase();
    return this.vendors.filter(vendor => vendor.name.toLowerCase().indexOf(filterValue) === 0);
  }


  ngOnInit(): void {
    this.loadData();
    this.refreshData();
  }

async loadData(): Promise<any>{
    this.balanceField.disable();
    this.totalField.disable();
    this.updatePrivileges();
    this.updatePrivileges();
    if (!this.privilege.add) { return; }

    this.paymenttypeService.getAll().then((data) => {
      this.paymenttypes = data;
    }).catch( e => {
      console.log(e);
      this.snackBar.open('Something is wrong', null, {duration: 2000});
    });
    this.vendorService.getAllBasic(new PageRequest()).then((vendorDataPage) => {
      this.vendors = vendorDataPage.content;
    }).catch((e) => {
      console.log(e);
      this.snackBar.open('Something is wrong', null, {duration: 2000});
    });
    this.paymentValidation();
    this.chequePaymentValidation();
  }

  updatePrivileges(): any {
    this.privilege.add = LoggedUser.can(UsecaseList.ADD_CONSUMEITEMPURCHASE);
    this.privilege.showAll = LoggedUser.can(UsecaseList.SHOW_ALL_CONSUMEITEMPURCHASES);
    this.privilege.showOne = LoggedUser.can(UsecaseList.SHOW_CONSUMEITEMPURCHASE_DETAILS);
    this.privilege.delete = LoggedUser.can(UsecaseList.DELETE_CONSUMEITEMPURCHASE);
    this.privilege.update = LoggedUser.can(UsecaseList.UPDATE_CONSUMEITEMPURCHASE);
    this.paymentAddPrivilage = LoggedUser.can(UsecaseList.ADD_PROCUREMENTPAYMENT);

  }

  async submit(): Promise<void> {
    this.consumeitempurchaseconsumeitemSubForm.resetForm();
    this.consumeitempurchaseconsumeitemsField.markAsDirty();
    this.invoiceField.updateValueAndValidity();
    this.invoiceField.markAsTouched();
    if (this.form.invalid) { return; }

    const consumeitempurchase: Consumeitempurchase = new Consumeitempurchase();
    consumeitempurchase.vendor = this.vendorField.value;
    consumeitempurchase.date = DateHelper.getDateAsString(this.dateField.value);
    consumeitempurchase.total = this.totalField.value;
    if (this.discountField.value){
      consumeitempurchase.discount = this.discountField.value;
    }
    if (this.totalField.value){
      let total = 0 ;
      this.consumeitempurchaseconsumeitemsField.value.forEach((item: Consumeitempurchaseconsumeitem) => {
        total += parseFloat(String(item.linetotal));
      });
      consumeitempurchase.gorsamount = total;
    }
    consumeitempurchase.balance = this.totalField.value;
    consumeitempurchase.consumeitempurchaseconsumeitemList = this.consumeitempurchaseconsumeitemsField.value;
    const invoiceIds = this.invoiceField.value;
    if (invoiceIds !== null && invoiceIds !== []){
      consumeitempurchase.invoice = invoiceIds[0];
    }else{
      consumeitempurchase.invoice = null;
    }
    consumeitempurchase.description = this.descriptionField.value;

    if (this.makepaymentField.value){
      this.consumeitempayment.amount = this.amountField.value;
      this.consumeitempayment.chequeno = (this.chequenoField.value === '') ? null : this.chequenoField.value;
      this.consumeitempayment.chequedate = (this.chequedateField.value === '') ? null : this.chequedateField.value;
      this.consumeitempayment.chequebank = (this.chequebankField.value === '') ? null : this.chequebankField.value;
      this.consumeitempayment.chequebranch = (this.chequebranchField.value === '') ? null : this.chequebranchField.value;
      this.consumeitempayment.paymenttype = this.paymenttypeField.value;
    }


    try{
      const resourceLink: ResourceLink = await this.consumeitempurchaseService.add(consumeitempurchase);
      this.consumeitempayment.consumeitempurchase =  resourceLink.id;
      if (this.consumeitempayment.amount != null){
        await this.consumeitempaymentService.add(this.consumeitempayment);
      }
      if (this.privilege.showOne) {
        await this.router.navigateByUrl('/consumeitempurchases/' + resourceLink.id);
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
          if (msg.vendor) { this.vendorField.setErrors({server: msg.vendor}); knownError = true; }
          if (msg.date) { this.dateField.setErrors({server: msg.date}); knownError = true; }
          if (msg.total) { this.totalField.setErrors({server: msg.total}); knownError = true; }
          if (msg.balance) { this.balanceField.setErrors({server: msg.balance}); knownError = true; }
          if (msg.consumeitempurchaseconsumeitemList) { this.consumeitempurchaseconsumeitemsField.setErrors({server: msg.consumeitempurchaseconsumeitemList}); knownError = true; }
          if (msg.invoice) { this.invoiceField.setErrors({server: msg.invoice}); knownError = true; }
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

  setBalance(): void {
    this.balanceField.patchValue(this.totalField.value);
  }

  setSearchValue(option: any): void{
    console.log(option);
    this.vendorField.patchValue(option);
    this.searchVendorField.disable();
  }

  totalCalculation(): void {
    let total = 0 ;
    this.consumeitempurchaseconsumeitemsField.value.forEach((item: Consumeitempurchaseconsumeitem) => {
      total += parseFloat(String(item.linetotal));
    });
    this.totalField.patchValue(total);
  }

  itemByVendor(): void{
    this.vendorDisable = true;
    this.consumeitemService.getAllByVendor(this.vendorField.value.id).then((data) => {
      this.consumeitems = data;
    }).catch( e => {
      console.log(e);
      this.snackBar.open('Something is wrong', null, {duration: 2000});
    });
  }

  chequePaymentValidation(): void {
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

  paymentValidation() : void {
    console.log("pv");
    if(this.makepaymentField.value){
      console.log("pva");
      this.paymenttypeField.setValidators(Validators.required);
      this.paymenttypeField.updateValueAndValidity();

      this.amountField.setValidators([
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(10),
        // Validators.pattern('^([0]?[0-9]{9})$'),
      ]);
      this.amountField.updateValueAndValidity();


    }else {
      console.log("pvr");
      this.paymenttypeField.setValidators(null);
      this.paymenttypeField.updateValueAndValidity();
      this.paymenttypeField.reset();

      this.amountField.setValidators(null);
      this.amountField.updateValueAndValidity();
      this.amountField.reset();
      this.balanceField.reset();

      this.consumeitempayment = new Consumeitempayment();

    }
  }

  updateBalance(): void {
    if (this.amountField.value){
      this.balanceField.patchValue(parseFloat(this.totalField.value) - parseFloat(this.amountField.value));
    }else {
      this.balanceField.patchValue(parseFloat(this.amountField.value));
    }
  }

  dateVaidation(): any {
    const date = new Date();
    return date;
  }

  calculateDiscount(): void {
    let total = 0 ;
    this.consumeitempurchaseconsumeitemsField.value.forEach((item: Consumeitempurchaseconsumeitem) => {
      total += parseFloat(String(item.linetotal));
    });
    this.totalField.patchValue(total);
    if (this.discountField.value !== 0){
      const d = this.discountField.value;
      let b = this.totalField.value;
      b -= ( b / 100 ) * d;
      this.totalField.patchValue(b);
    }
  }

}
