import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {MatSnackBar} from '@angular/material/snack-bar';
import {LoggedUser} from '../../../../shared/logged-user';
import {UsecaseList} from '../../../../usecase-list';
import {ResourceLink} from '../../../../shared/resource-link';
import {AbstractComponent} from '../../../../shared/abstract-component';
import {PageRequest} from '../../../../shared/page-request';
import {Procurementitem} from '../../../../entities/procurementitem';
import {ProcurementitemService} from '../../../../services/procurementitem.service';
import {Vendor} from '../../../../entities/vendor';
import {DateHelper} from '../../../../shared/date-helper';
import {VendorService} from '../../../../services/vendor.service';
import {Buyingcondition} from '../../../../entities/buyingcondition';
import {Procurementitemtype} from '../../../../entities/procurementitemtype';
import {Procurementitemstatus} from '../../../../entities/procurementitemstatus';
import {BuyingconditionService} from '../../../../services/buyingcondition.service';
import {Procurementitempurchase} from '../../../../entities/procurementitempurchase';
import {ProcurementitemtypeService} from '../../../../services/procurementitemtype.service';
import {ProcurementitemstatusService} from '../../../../services/procurementitemstatus.service';
import {ProcurementitempurchaseService} from '../../../../services/procurementitempurchase.service';

@Component({
  selector: 'app-procurementitem-update-form',
  templateUrl: './procurementitem-update-form.component.html',
  styleUrls: ['./procurementitem-update-form.component.scss']
})
export class ProcurementitemUpdateFormComponent extends AbstractComponent implements OnInit {

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

  get procurementitemstatusField(): FormControl{
    return this.form.controls.procurementitemstatus as FormControl;
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
    private procurementitemstatusService: ProcurementitemstatusService,
    private procurementitemService: ProcurementitemService,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar,
    private router: Router
  ) {
    super();
  }

  selectedId: number;
  procurementitem: Procurementitem;

  vendors: Vendor[] = [];
  procurementitemtypes: Procurementitemtype[] = [];
  procurementitempurchases: Procurementitempurchase[] = [];
  buyingconditions: Buyingcondition[] = [];
  procurementitemstatuses: Procurementitemstatus[] = [];

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
    procurementitemstatus: new FormControl('1', [
      Validators.required,
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
  procurementitemstatusDisable = true;

  ngOnInit(): void {
    this.priceField.disable();
    this.procurementitemstatusService.getAll().then((procurementitemstatuses) => {
      this.procurementitemstatuses = procurementitemstatuses;
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

    this.vendorService.getAllBasic(new PageRequest()).then((vendorDataPage) => {
      this.vendors = vendorDataPage.content;
    }).catch((e) => {
      console.log(e);
      this.snackBar.open('Something is wrong', null, {duration: 2000});
    });
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
    this.buyingconditionService.getAll().then((buyingconditions) => {
      this.buyingconditions = buyingconditions;
    }).catch((e) => {
      console.log(e);
      this.snackBar.open('Something is wrong', null, {duration: 2000});
    });
    this.procurementitem = await this.procurementitemService.get(this.selectedId);
    this.setValues();
    this.filteredDataList();
  }

  updatePrivileges(): any {
    this.privilege.add = LoggedUser.can(UsecaseList.ADD_PROCUREMENTITEM);
    this.privilege.showAll = LoggedUser.can(UsecaseList.SHOW_ALL_PROCUREMENTITEMS);
    this.privilege.showOne = LoggedUser.can(UsecaseList.SHOW_PROCUREMENTITEM_DETAILS);
    this.privilege.delete = LoggedUser.can(UsecaseList.DELETE_PROCUREMENTITEM);
    this.privilege.update = LoggedUser.can(UsecaseList.UPDATE_PROCUREMENTITEM);
  }

  discardChanges(): void{
    this.form.markAsPristine();
    this.form.markAsUntouched();
    this.setValues();
  }

  setValues(): void{
    if (this.vendorField.pristine) {
      this.vendorField.setValue(this.procurementitem.vendor.id);
    }
    if (this.procurementitemtypeField.pristine) {
      this.procurementitemtypeField.setValue(this.procurementitem.procurementitemtype.id);
    }
    if (this.procurementitempurchaseField.pristine) {
      this.procurementitempurchaseField.setValue(this.procurementitem.procurementitempurchase.id);
    }
    if (this.buyingconditionField.pristine) {
      this.buyingconditionField.setValue(this.procurementitem.buyingcondition.id);
    }
    if (this.itemphotoField.pristine) {
      if (this.procurementitem.itemphoto) { this.itemphotoField.setValue([this.procurementitem.itemphoto]); }
      else { this.itemphotoField.setValue([]); }
    }
    if (this.priceField.pristine) {
      this.priceField.setValue(this.procurementitem.price);
    }
    if (this.dopurchasedField.pristine) {
      this.dopurchasedField.setValue(this.procurementitem.dopurchased);
    }
    if (this.procurementitemstatusField.pristine) {
      this.procurementitemstatusField.setValue(this.procurementitem.procurementitemstatus.id);
    }
    if (this.warrantyphotoField.pristine) {
      if (this.procurementitem.warrantyphoto) { this.warrantyphotoField.setValue([this.procurementitem.warrantyphoto]); }
      else { this.warrantyphotoField.setValue([]); }
    }
    if (this.invoiceField.pristine) {
      if (this.procurementitem.invoice) { this.invoiceField.setValue([this.procurementitem.invoice]); }
      else { this.invoiceField.setValue([]); }
    }
    if (this.warrantyenddateField.pristine) {
      this.warrantyenddateField.setValue(this.procurementitem.warrantyenddate);
    }
    if (this.nooffreeservicesField.pristine) {
      this.nooffreeservicesField.setValue(this.procurementitem.nooffreeservices);
    }
    if (this.brandField.pristine) {
      this.brandField.setValue(this.procurementitem.brand);
    }
    if (this.descriptionField.pristine) {
      this.descriptionField.setValue(this.procurementitem.description);
    }
}

  async submit(): Promise<void> {
    this.itemphotoField.updateValueAndValidity();
    this.itemphotoField.markAsTouched();
    this.warrantyphotoField.updateValueAndValidity();
    this.warrantyphotoField.markAsTouched();
    this.invoiceField.updateValueAndValidity();
    this.invoiceField.markAsTouched();
    if (this.form.invalid) { return; }

    const newprocurementitem: Procurementitem = new Procurementitem();
    newprocurementitem.vendor = this.vendorField.value;
    newprocurementitem.procurementitemtype = this.procurementitemtypeField.value;
    newprocurementitem.procurementitempurchase = this.procurementitempurchaseField.value;
    newprocurementitem.buyingcondition = this.buyingconditionField.value;
    const itemphotoIds = this.itemphotoField.value;
    if (itemphotoIds !== null && itemphotoIds !== []){
      newprocurementitem.itemphoto = itemphotoIds[0];
    }else{
      newprocurementitem.itemphoto = null;
    }
    newprocurementitem.price = this.priceField.value;
    newprocurementitem.dopurchased = this.dopurchasedField.value ? DateHelper.getDateAsString(this.dopurchasedField.value) : null;
    newprocurementitem.procurementitemstatus = this.procurementitemstatusField.value;
    const warrantyphotoIds = this.warrantyphotoField.value;
    if (warrantyphotoIds !== null && warrantyphotoIds !== []){
      newprocurementitem.warrantyphoto = warrantyphotoIds[0];
    }else{
      newprocurementitem.warrantyphoto = null;
    }
    const invoiceIds = this.invoiceField.value;
    if (invoiceIds !== null && invoiceIds !== []){
      newprocurementitem.invoice = invoiceIds[0];
    }else{
      newprocurementitem.invoice = null;
    }
    newprocurementitem.warrantyenddate = this.warrantyenddateField.value ? DateHelper.getDateAsString(this.warrantyenddateField.value) : null;
    newprocurementitem.nooffreeservices = this.nooffreeservicesField.value;
    newprocurementitem.brand = this.brandField.value;
    newprocurementitem.description = this.descriptionField.value;
    try{
      const resourceLink: ResourceLink = await this.procurementitemService.update(this.selectedId, newprocurementitem);
      if (this.privilege.showOne) {
        await this.router.navigateByUrl('/procurementitems/' + resourceLink.id);
      } else {
        await this.router.navigateByUrl('/procurementitems');
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
          if (msg.procurementitemstatus) { this.procurementitemstatusField.setErrors({server: msg.procurementitemstatus}); knownError = true; }
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
  /*canDispose(): void {
    console.log(this.procurementitemstatusField.value);
    if (this.procurementitemstatusField.value){
      if (this.procurementitemstatusField.value === 1 || this.procurementitemstatusField.value === 3){
        this.procurementitemstatusDisable =  false;
      }
    }
    this.procurementitemstatusDisable = true;
    console.log(this.procurementitemstatusDisable);
  }*/
}
