import { Component, OnInit } from '@angular/core';
import {ResourceLink} from '../../../../shared/resource-link';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Router} from '@angular/router';
import {AbstractComponent} from '../../../../shared/abstract-component';
import {LoggedUser} from '../../../../shared/logged-user';
import {UsecaseList} from '../../../../usecase-list';
import {PageRequest} from '../../../../shared/page-request';
import {Procurementitem} from '../../../../entities/procurementitem';
import {ProcurementitemService} from '../../../../services/procurementitem.service';
import {Vendor} from '../../../../entities/vendor';
import {DateHelper} from '../../../../shared/date-helper';
import {VendorService} from '../../../../services/vendor.service';
import {Buyingcondition} from '../../../../entities/buyingcondition';
import {Procurementitemtype} from '../../../../entities/procurementitemtype';
import {BuyingconditionService} from '../../../../services/buyingcondition.service';
import {Procurementitempurchase} from '../../../../entities/procurementitempurchase';
import {ProcurementitemtypeService} from '../../../../services/procurementitemtype.service';
import {ProcurementitempurchaseService} from '../../../../services/procurementitempurchase.service';

@Component({
  selector: 'app-procurementitem-form',
  templateUrl: './procurementitem-form.component.html',
  styleUrls: ['./procurementitem-form.component.scss']
})
export class ProcurementitemFormComponent extends AbstractComponent implements OnInit {

  vendors: Vendor[] = [];
  procurementitemtypes: Procurementitemtype[] = [];
  procurementitempurchases: Procurementitempurchase[] = [];
  buyingconditions: Buyingcondition[] = [];

  form = new FormGroup({
    vendor: new FormControl(null, [
    ]),
    procurementitemtype: new FormControl(null, [
      Validators.required,
    ]),
    procurementitempurchase: new FormControl(null, [
    ]),
    buyingcondition: new FormControl(null, [
      Validators.required,
    ]),
    itemphoto: new FormControl(),
    price: new FormControl(null, [
      Validators.min(0),
      Validators.max(10000000),
      Validators.pattern('^([0-9]{1,8}([.][0-9]{1,2})?)$'),
    ]),
    dopurchased: new FormControl(null, [
    ]),
    warrantyphoto: new FormControl(),
    invoice: new FormControl(),
    warrantyenddate: new FormControl(null, [
    ]),
    nooffreeservices: new FormControl(null, [
      Validators.min(-2147483648),
      Validators.max(2147483647),
      Validators.pattern('^([0-9]*)$'),
    ]),
    brand: new FormControl(null, [
      Validators.minLength(null),
      Validators.maxLength(45),
      Validators.pattern('^[a-zA-Z ]{3,}$'),
    ]),
    description: new FormControl(null, [
      Validators.minLength(null),
      Validators.maxLength(65535),
    ]),
  });

  get vendorField(): FormControl{
    return this.form.controls.vendor as FormControl;
  }

  get procurementitemtypeField(): FormControl{
    return this.form.controls.procurementitemtype as FormControl;
  }

  get procurementitempurchaseField(): FormControl{
    return this.form.controls.procurementitempurchase as FormControl;
  }

  get buyingconditionField(): FormControl{
    return this.form.controls.buyingcondition as FormControl;
  }

  get itemphotoField(): FormControl{
    return this.form.controls.itemphoto as FormControl;
  }

  get priceField(): FormControl{
    return this.form.controls.price as FormControl;
  }

  get dopurchasedField(): FormControl{
    return this.form.controls.dopurchased as FormControl;
  }

  get warrantyphotoField(): FormControl{
    return this.form.controls.warrantyphoto as FormControl;
  }

  get invoiceField(): FormControl{
    return this.form.controls.invoice as FormControl;
  }

  get warrantyenddateField(): FormControl{
    return this.form.controls.warrantyenddate as FormControl;
  }

  get nooffreeservicesField(): FormControl{
    return this.form.controls.nooffreeservices as FormControl;
  }

  get brandField(): FormControl{
    return this.form.controls.brand as FormControl;
  }

  get descriptionField(): FormControl{
    return this.form.controls.description as FormControl;
  }

  constructor(
    private vendorService: VendorService,
    private procurementitemtypeService: ProcurementitemtypeService,
    private procurementitempurchaseService: ProcurementitempurchaseService,
    private buyingconditionService: BuyingconditionService,
    private procurementitemService: ProcurementitemService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {
    super();
  }

  ngOnInit(): void {
    this.priceField.disable();
    this.procurementitemtypeService.getAllBasic(new PageRequest()).then((procurementitemtypeDataPage) => {
      this.procurementitemtypes = procurementitemtypeDataPage.content;
    }).catch((e) => {
      console.log(e);
      this.snackBar.open('Something is wrong', null, {duration: 2000});
    });
    this.procurementitempurchaseService.getAllBasic(new PageRequest()).then((procurementitempurchaseDataPage) => {
      this.procurementitempurchases = procurementitempurchaseDataPage.content;
    }).catch((e) => {
      console.log(e);
      this.snackBar.open('Something is wrong', null, {duration: 2000});
    });
    this.loadData();
    this.refreshData();
  }

async loadData(): Promise<any>{

    this.updatePrivileges();
    if (!this.privilege.add) { return; }

    this.vendorService.getAllBasic(new PageRequest()).then((vendorDataPage) => {
      this.vendors = vendorDataPage.content;
    }).catch((e) => {
      console.log(e);
      this.snackBar.open('Something is wrong', null, {duration: 2000});
    });
    this.buyingconditionService.getAll().then((buyingconditions) => {
      this.buyingconditions = buyingconditions;
    }).catch((e) => {
      console.log(e);
      this.snackBar.open('Something is wrong', null, {duration: 2000});
    });
  }

  updatePrivileges(): any {
    this.privilege.add = LoggedUser.can(UsecaseList.ADD_PROCUREMENTITEM);
    this.privilege.showAll = LoggedUser.can(UsecaseList.SHOW_ALL_PROCUREMENTITEMS);
    this.privilege.showOne = LoggedUser.can(UsecaseList.SHOW_PROCUREMENTITEM_DETAILS);
    this.privilege.delete = LoggedUser.can(UsecaseList.DELETE_PROCUREMENTITEM);
    this.privilege.update = LoggedUser.can(UsecaseList.UPDATE_PROCUREMENTITEM);
  }

  async submit(): Promise<void> {
    this.itemphotoField.updateValueAndValidity();
    this.itemphotoField.markAsTouched();
    this.warrantyphotoField.updateValueAndValidity();
    this.warrantyphotoField.markAsTouched();
    this.invoiceField.updateValueAndValidity();
    this.invoiceField.markAsTouched();
    if (this.form.invalid) { return; }

    const procurementitem: Procurementitem = new Procurementitem();
    procurementitem.vendor = this.vendorField.value;
    procurementitem.procurementitemtype = this.procurementitemtypeField.value;
    procurementitem.procurementitempurchase = this.procurementitempurchaseField.value;
    procurementitem.buyingcondition = this.buyingconditionField.value;
    const itemphotoIds = this.itemphotoField.value;
    if (itemphotoIds !== null && itemphotoIds !== []){
      procurementitem.itemphoto = itemphotoIds[0];
    }else{
      procurementitem.itemphoto = null;
    }
    procurementitem.price = this.priceField.value;
    procurementitem.dopurchased = this.dopurchasedField.value ? DateHelper.getDateAsString(this.dopurchasedField.value) : null;
    const warrantyphotoIds = this.warrantyphotoField.value;
    if (warrantyphotoIds !== null && warrantyphotoIds !== []){
      procurementitem.warrantyphoto = warrantyphotoIds[0];
    }else{
      procurementitem.warrantyphoto = null;
    }
    const invoiceIds = this.invoiceField.value;
    if (invoiceIds !== null && invoiceIds !== []){
      procurementitem.invoice = invoiceIds[0];
    }else{
      procurementitem.invoice = null;
    }
    procurementitem.warrantyenddate = this.warrantyenddateField.value ? DateHelper.getDateAsString(this.warrantyenddateField.value) : null;
    procurementitem.nooffreeservices = this.nooffreeservicesField.value;
    procurementitem.brand = this.brandField.value;
    procurementitem.description = this.descriptionField.value;
    try{
      const resourceLink: ResourceLink = await this.procurementitemService.add(procurementitem);
      if (this.privilege.showOne) {
        await this.router.navigateByUrl('/procurementitems/' + resourceLink.id);
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
          if (msg.procurementitemtype) { this.procurementitemtypeField.setErrors({server: msg.procurementitemtype}); knownError = true; }
          if (msg.procurementitempurchase) { this.procurementitempurchaseField.setErrors({server: msg.procurementitempurchase}); knownError = true; }
          if (msg.buyingcondition) { this.buyingconditionField.setErrors({server: msg.buyingcondition}); knownError = true; }
          if (msg.itemphoto) { this.itemphotoField.setErrors({server: msg.itemphoto}); knownError = true; }
          if (msg.price) { this.priceField.setErrors({server: msg.price}); knownError = true; }
          if (msg.dopurchased) { this.dopurchasedField.setErrors({server: msg.dopurchased}); knownError = true; }
          if (msg.warrantyphoto) { this.warrantyphotoField.setErrors({server: msg.warrantyphoto}); knownError = true; }
          if (msg.invoice) { this.invoiceField.setErrors({server: msg.invoice}); knownError = true; }
          if (msg.warrantyenddate) { this.warrantyenddateField.setErrors({server: msg.warrantyenddate}); knownError = true; }
          if (msg.nooffreeservices) { this.nooffreeservicesField.setErrors({server: msg.nooffreeservices}); knownError = true; }
          if (msg.brand) { this.brandField.setErrors({server: msg.brand}); knownError = true; }
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

  filteredDataList(): void{
    if (this.vendorField.value){
      this.procurementitemtypeService.getAllByVendor(this.vendorField.value).then((procurementitemtypes) => {
        this.procurementitemtypes = procurementitemtypes;
      }).catch((e) => {
        console.log(e);
        this.snackBar.open('Something is wrong', null, {duration: 2000});
      });
      this.procurementitempurchaseService.getAllByVendor(this.vendorField.value).then((procurementitempurchases) => {
        this.procurementitempurchases = procurementitempurchases;
      }).catch((e) => {
        console.log(e);
        this.snackBar.open('Something is wrong', null, {duration: 2000});
      });
    }
  }

  dateVaidation(): any {
    const date = new Date();
    return date;
  }
}
