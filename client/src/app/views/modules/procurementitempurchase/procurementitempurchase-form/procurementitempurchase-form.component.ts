import { Component, OnInit } from '@angular/core';
import {ResourceLink} from '../../../../shared/resource-link';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Router} from '@angular/router';
import {AbstractComponent} from '../../../../shared/abstract-component';
import {LoggedUser} from '../../../../shared/logged-user';
import {UsecaseList} from '../../../../usecase-list';
import {PageRequest} from '../../../../shared/page-request';
import {Procurementitempurchase} from '../../../../entities/procurementitempurchase';
import {ProcurementitempurchaseService} from '../../../../services/procurementitempurchase.service';
import {Vendor} from '../../../../entities/vendor';
import {DateHelper} from '../../../../shared/date-helper';
import {VendorService} from '../../../../services/vendor.service';
import {Observable} from "rxjs";
import {map, startWith} from "rxjs/operators";
import {Procurementitem} from "../../../../entities/procurementitem";
import {Procurementitemtype} from "../../../../entities/procurementitemtype";
import {Buyingcondition} from "../../../../entities/buyingcondition";
import {BuyingconditionService} from "../../../../services/buyingcondition.service";
import {ProcurementitemtypeService} from "../../../../services/procurementitemtype.service";
import {Procurementpayment} from "../../../../entities/procurementpayment";
import {ProcurementpaymentService} from "../../../../services/procurementpayment.service";
import {PaymenttypeService} from "../../../../services/paymenttype.service";
import {Paymenttype} from "../../../../entities/paymenttype";
import {ProcurementitemService} from "../../../../services/procurementitem.service";

@Component({
  selector: 'app-procurementitempurchase-form',
  templateUrl: './procurementitempurchase-form.component.html',
  styleUrls: ['./procurementitempurchase-form.component.scss']
})
export class ProcurementitempurchaseFormComponent extends AbstractComponent implements OnInit {

  vendors: Vendor[] = [];
  filteredOptions: Observable<Vendor[]>;
  procurementitemtypes: Procurementitemtype [] = [];
  buyingconditions: Buyingcondition [] = [];
  vendorDisable = false;
  paymenttypes: Paymenttype [] = [];
  procurementpayment: Procurementpayment = new Procurementpayment();
  paymentAddPrivilage = false;

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
    invoice: new FormControl(),
    description: new FormControl(null, [
      Validators.minLength(null),
      Validators.maxLength(65535),
    ]),
    searchVendor: new FormControl(),
    item: new FormControl(),
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
  });

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

  get invoiceField(): FormControl{
    return this.form.controls.invoice as FormControl;
  }

  get descriptionField(): FormControl{
    return this.form.controls.description as FormControl;
  }

  get searchVendorField(): FormControl{
    return this.form.controls.searchVendor as FormControl;
  }

  get itemField(): FormControl{
    return this.form.controls.item as FormControl;
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
    private procurementitempurchaseService: ProcurementitempurchaseService,
    private buyingconditionService: BuyingconditionService,
    private procurementpaymentService: ProcurementpaymentService,
    private paymenttypeService: PaymenttypeService,
    private procurementitemtypeService: ProcurementitemtypeService,
    private procurementitemService: ProcurementitemService,
    private snackBar: MatSnackBar,
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
    this.buyingconditionService.getAll().then((data) => {
      this.buyingconditions = data;
    }).catch( e => {
      console.log(e);
      this.snackBar.open('Something is wrong', null, {duration: 2000});
    });
    this.paymenttypeService.getAll().then((data) => {
      this.paymenttypes = data;
    }).catch( e => {
      console.log(e);
      this.snackBar.open('Something is wrong', null, {duration: 2000});
    });

    this.loadData();
    this.refreshData();
  }

async loadData(): Promise<any>{
    this.balanceField.disable();
    this.totalField.disable();
    this.updatePrivileges();
    if (!this.privilege.add) { return; }

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
    this.privilege.add = LoggedUser.can(UsecaseList.ADD_PROCUREMENTITEMPURCHASE);
    this.privilege.showAll = LoggedUser.can(UsecaseList.SHOW_ALL_PROCUREMENTITEMPURCHASES);
    this.privilege.showOne = LoggedUser.can(UsecaseList.SHOW_PROCUREMENTITEMPURCHASE_DETAILS);
    this.privilege.delete = LoggedUser.can(UsecaseList.DELETE_PROCUREMENTITEMPURCHASE);
    this.privilege.update = LoggedUser.can(UsecaseList.UPDATE_PROCUREMENTITEMPURCHASE);
    this.paymentAddPrivilage = LoggedUser.can(UsecaseList.ADD_PROCUREMENTPAYMENT);
  }

  async submit(): Promise<void> {
    this.invoiceField.updateValueAndValidity();
    this.invoiceField.markAsTouched();
    if (this.form.invalid) { return; }

    const procurementitempurchase: Procurementitempurchase = new Procurementitempurchase();
    procurementitempurchase.vendor = this.vendorField.value;
    procurementitempurchase.date = DateHelper.getDateAsString(this.dateField.value);
    procurementitempurchase.total = this.totalField.value;
    const invoiceIds = this.invoiceField.value;
    if (invoiceIds !== null && invoiceIds !== []){
      procurementitempurchase.invoice = invoiceIds[0];
    }else{
      procurementitempurchase.invoice = null;
    }
    procurementitempurchase.description = this.descriptionField.value;
    procurementitempurchase.procurementitemList = this.itemField.value;

    if (this.makepaymentField.value){
      this.procurementpayment.amount = this.amountField.value;
      this.procurementpayment.chequeno = (this.chequenoField.value === '') ? null : this.chequenoField.value;
      this.procurementpayment.chequedate = (this.chequedateField.value === '') ? null : this.chequedateField.value;
      this.procurementpayment.chequebank = (this.chequebankField.value === '') ? null : this.chequebankField.value;
      this.procurementpayment.chequebranch = (this.chequebranchField.value === '') ? null : this.chequebranchField.value;
      this.procurementpayment.paymenttype = this.paymenttypeField.value;
    }

    try{
      const resourceLink: ResourceLink = await this.procurementitempurchaseService.add(procurementitempurchase);
      this.procurementpayment.procurementitempurchase =  resourceLink.id;
      if (this.itemField.value != null && this.itemField.value !== ''){
        for (const item of this.itemField.value) {
          item.vendor = this.vendorField.value;
          item.procurementitempurchase = resourceLink.id;
          item.dopurchased = DateHelper.getDateAsString(this.dateField.value);
          await this.procurementitemService.add(item);
        }
      }
      if (this.procurementpayment.amount != null){
        await this.procurementpaymentService.add(this.procurementpayment);
      }

      if (this.privilege.showOne) {
        await this.router.navigateByUrl('/procurementitempurchases/' + resourceLink.id);
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
    this.itemField.value.forEach((item: Procurementitem) => {
      total += parseFloat(String(item.price));
    });
    this.totalField.patchValue(total);
  }

  itemByVendor(): void{
    this.vendorDisable = true;
    this.procurementitemtypeService.getAllByVendor(this.vendorField.value.id).then((data) => {
      this.procurementitemtypes = data;
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

      this.procurementpayment = new Procurementpayment();

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

}
