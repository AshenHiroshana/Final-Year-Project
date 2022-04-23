import { Component, OnInit } from '@angular/core';
import {ResourceLink} from '../../../../shared/resource-link';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Router} from '@angular/router';
import {AbstractComponent} from '../../../../shared/abstract-component';
import {LoggedUser} from '../../../../shared/logged-user';
import {UsecaseList} from '../../../../usecase-list';
import {PageRequest} from '../../../../shared/page-request';
import {Service} from '../../../../entities/service';
import {ServiceService} from '../../../../services/service.service';
import {ViewChild} from '@angular/core';
import {Branch} from '../../../../entities/branch';
import {Vendor} from '../../../../entities/vendor';
import {DateHelper} from '../../../../shared/date-helper';
import {Servicetype} from '../../../../entities/servicetype';
import {BranchService} from '../../../../services/branch.service';
import {VendorService} from '../../../../services/vendor.service';
import {ServicetypeService} from '../../../../services/servicetype.service';
import {ServiceprocurementitemSubFormComponent} from './serviceprocurementitem-sub-form/serviceprocurementitem-sub-form.component';
import {ProcurementitemService} from "../../../../services/procurementitem.service";
import {Procurementitem} from "../../../../entities/procurementitem";
import {Branchsection} from "../../../../entities/branchsection";
import {BranchsectionService} from "../../../../services/branchsection.service";
import {Procurementpayment} from "../../../../entities/procurementpayment";
import {Servicepayment} from "../../../../entities/servicepayment";
import {ServicepaymentService} from "../../../../services/servicepayment.service";
import {PaymenttypeService} from "../../../../services/paymenttype.service";
import {Paymenttype} from "../../../../entities/paymenttype";
import {Serviceprocurementitem} from "../../../../entities/serviceprocurementitem";

@Component({
  selector: 'app-service-form',
  templateUrl: './service-form.component.html',
  styleUrls: ['./service-form.component.scss']
})
export class ServiceFormComponent extends AbstractComponent implements OnInit {

  branches: Branch[] = [];
  branchsections: Branchsection[] = [];
  vendors: Vendor[] = [];
  servicetypes: Servicetype[] = [];
  procurementitems: Procurementitem[] = [];
  paymentAddPrivilage = false;
  servicepayment: Servicepayment = new Servicepayment();
  paymenttypes: Paymenttype[] = [];

  @ViewChild(ServiceprocurementitemSubFormComponent) serviceprocurementitemSubForm: ServiceprocurementitemSubFormComponent;

  form = new FormGroup({
    branch: new FormControl(null, [
      Validators.required,
    ]),
    vendor: new FormControl(null, [
      Validators.required,
    ]),
    servicetype: new FormControl(null, [
      Validators.required,
    ]),
    sdate: new FormControl(null, [
      Validators.required,
    ]),
    title: new FormControl(null, [
      Validators.required,
      Validators.minLength(5),
      Validators.maxLength(255),
    ]),
    serviceprocurementitems: new FormControl(),
    total: new FormControl(null, [
      Validators.required,
      Validators.min(0),
      Validators.max(10000000),
      Validators.pattern('^([0-9]{1,8}([.][0-9]{1,2})?)$'),
    ]),
    balance: new FormControl(),
    edate: new FormControl(null, [
    ]),
    description: new FormControl(null, [
      Validators.minLength(null),
      Validators.maxLength(65535),
    ]),
    branchsection: new FormControl(),
    makepayment: new FormControl(''),
    amount: new FormControl(),
    paymenttype: new FormControl(),
    chequeno: new FormControl(),
    chequedate: new FormControl(),
    chequebank: new FormControl(),
    chequebranch: new FormControl(),
  });

  get branchField(): FormControl{
    return this.form.controls.branch as FormControl;
  }

  get branchSectionField(): FormControl{
    return this.form.controls.branchsection as FormControl;
  }

  get vendorField(): FormControl{
    return this.form.controls.vendor as FormControl;
  }

  get servicetypeField(): FormControl{
    return this.form.controls.servicetype as FormControl;
  }

  get sdateField(): FormControl{
    return this.form.controls.sdate as FormControl;
  }

  get titleField(): FormControl{
    return this.form.controls.title as FormControl;
  }

  get serviceprocurementitemsField(): FormControl{
    return this.form.controls.serviceprocurementitems as FormControl;
  }

  get totalField(): FormControl{
    return this.form.controls.total as FormControl;
  }

  get balanceField(): FormControl{
    return this.form.controls.balance as FormControl;
  }

  get edateField(): FormControl{
    return this.form.controls.edate as FormControl;
  }

  get descriptionField(): FormControl{
    return this.form.controls.description as FormControl;
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
    private branchService: BranchService,
    private vendorService: VendorService,
    private servicetypeService: ServicetypeService,
    private procurementitemService: ProcurementitemService,
    private branchsectionService: BranchsectionService,
    private servicepaymentService: ServicepaymentService,
    private serviceService: ServiceService,
    private paymenttypeService: PaymenttypeService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {
    super();
  }

  ngOnInit(): void {
    this.loadData();
    this.refreshData();
    this.totalField.disable();
  }

async loadData(): Promise<any>{
    this.updatePrivileges();
    if (!this.privilege.add) { return; }

    this.branchService.getAllBasic(new PageRequest()).then((branchDataPage) => {
      this.branches = branchDataPage.content;
    }).catch((e) => {
      console.log(e);
      this.snackBar.open('Something is wrong', null, {duration: 2000});
    });
    this.vendorService.getAllBasic(new PageRequest()).then((vendorDataPage) => {
      this.vendors = vendorDataPage.content;
    }).catch((e) => {
      console.log(e);
      this.snackBar.open('Something is wrong', null, {duration: 2000});
    });
    this.paymenttypeService.getAll().then((data) => {
      this.paymenttypes = data;
    }).catch( e => {
      console.log(e);
      this.snackBar.open('Something is wrong', null, {duration: 2000});
    });
  }

  updatePrivileges(): any {
    this.privilege.add = LoggedUser.can(UsecaseList.ADD_SERVICE);
    this.privilege.showAll = LoggedUser.can(UsecaseList.SHOW_ALL_SERVICES);
    this.privilege.showOne = LoggedUser.can(UsecaseList.SHOW_SERVICE_DETAILS);
    this.privilege.delete = LoggedUser.can(UsecaseList.DELETE_SERVICE);
    this.privilege.update = LoggedUser.can(UsecaseList.UPDATE_SERVICE);
    this.paymentAddPrivilage = LoggedUser.can(UsecaseList.ADD_SERVICEPAYMENT);
  }

  async submit(): Promise<void> {
    this.serviceprocurementitemSubForm.resetForm();
    this.serviceprocurementitemsField.markAsDirty();
    if (this.form.invalid) { return; }

    const service: Service = new Service();
    service.branch = this.branchField.value;
    service.vendor = this.vendorField.value;
    service.servicetype = this.servicetypeField.value;
    service.sdate = DateHelper.getDateAsString(this.sdateField.value);
    service.title = this.titleField.value;
    service.serviceprocurementitemList = this.serviceprocurementitemsField.value;
    service.total = this.totalField.value;
    service.balance = this.totalField.value;
    service.description = this.descriptionField.value;

    if (this.makepaymentField.value){
      this.servicepayment.amount = this.amountField.value;
      this.servicepayment.chequeno = (this.chequenoField.value === '') ? null : this.chequenoField.value;
      this.servicepayment.chequedate = (this.chequedateField.value === '') ? null : this.chequedateField.value;
      this.servicepayment.chequebank = (this.chequebankField.value === '') ? null : this.chequebankField.value;
      this.servicepayment.chequebranch = (this.chequebranchField.value === '') ? null : this.chequebranchField.value;
      this.servicepayment.paymenttype = this.paymenttypeField.value;
    }

    try{
      const resourceLink: ResourceLink = await this.serviceService.add(service);

      this.servicepayment.service =  resourceLink.id;

      if (this.servicepayment.amount != null){
        await this.servicepaymentService.add(this.servicepayment);
      }

      if (this.privilege.showOne) {
        await this.router.navigateByUrl('/services/' + resourceLink.id);
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
          if (msg.branch) { this.branchField.setErrors({server: msg.branch}); knownError = true; }
          if (msg.vendor) { this.vendorField.setErrors({server: msg.vendor}); knownError = true; }
          if (msg.servicetype) { this.servicetypeField.setErrors({server: msg.servicetype}); knownError = true; }
          if (msg.sdate) { this.sdateField.setErrors({server: msg.sdate}); knownError = true; }
          if (msg.title) { this.titleField.setErrors({server: msg.title}); knownError = true; }
          if (msg.serviceprocurementitemList) { this.serviceprocurementitemsField.setErrors({server: msg.serviceprocurementitemList}); knownError = true; }
          if (msg.total) { this.totalField.setErrors({server: msg.total}); knownError = true; }
          if (msg.balance) { this.balanceField.setErrors({server: msg.balance}); knownError = true; }
          if (msg.edate) { this.edateField.setErrors({server: msg.edate}); knownError = true; }
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

  loadType(): void{
    this.vendorField.disable();
    this.servicetypeService.getAllByVendor(this.vendorField.value).then((servicetypeDataPage) => {
      this.servicetypes = servicetypeDataPage;
    }).catch((e) => {
      console.log(e);
      this.snackBar.open('Something is wrong', null, {duration: 2000});
    });
  }

  loadItem(): void{
    this.procurementitemService.getAllByBranchSection(this.branchSectionField.value).then((procurementitemDataPage) => {
      this.procurementitems = procurementitemDataPage;
    }).catch((e) => {
      console.log(e);
      this.snackBar.open('Something is wrong', null, {duration: 2000});
    });
  }

  loadBranchSection(): void{
    this.branchField.disable();
    this.branchsectionService.getAllByBranch(this.branchField.value).then((procurementitemDataPage) => {
      this.branchsections = procurementitemDataPage;
    }).catch((e) => {
      console.log(e);
      this.snackBar.open('Something is wrong', null, {duration: 2000});
    });
  }

  unlock(): void {
    this.vendorField.enable();
    this.branchSectionField.enable();
    this.branchField.enable();
  }

  setBalance(): void {
    this.balanceField.patchValue(this.totalField.value);
  }

  totalCalculation(): void {
    let total = 0 ;
    this.serviceprocurementitemsField.value.forEach((item: Serviceprocurementitem) => {
      total += parseFloat(String(item.amount));
    });
    this.totalField.patchValue(total);
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

      this.servicepayment = new Servicepayment();

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
