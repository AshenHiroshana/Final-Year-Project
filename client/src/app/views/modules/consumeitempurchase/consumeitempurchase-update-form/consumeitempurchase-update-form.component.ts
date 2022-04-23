import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {MatSnackBar} from '@angular/material/snack-bar';
import {LoggedUser} from '../../../../shared/logged-user';
import {UsecaseList} from '../../../../usecase-list';
import {ResourceLink} from '../../../../shared/resource-link';
import {AbstractComponent} from '../../../../shared/abstract-component';
import {PageRequest} from '../../../../shared/page-request';
import {Consumeitempurchase} from '../../../../entities/consumeitempurchase';
import {ConsumeitempurchaseService} from '../../../../services/consumeitempurchase.service';
import {ViewChild} from '@angular/core';
import {Vendor} from '../../../../entities/vendor';
import {DateHelper} from '../../../../shared/date-helper';
import {VendorService} from '../../../../services/vendor.service';
import {ConsumeitempurchaseconsumeitemUpdateSubFormComponent} from './consumeitempurchaseconsumeitem-update-sub-form/consumeitempurchaseconsumeitem-update-sub-form.component';

@Component({
  selector: 'app-consumeitempurchase-update-form',
  templateUrl: './consumeitempurchase-update-form.component.html',
  styleUrls: ['./consumeitempurchase-update-form.component.scss']
})
export class ConsumeitempurchaseUpdateFormComponent extends AbstractComponent implements OnInit {

  selectedId: number;
  consumeitempurchase: Consumeitempurchase;

  vendors: Vendor[] = [];
  @ViewChild(ConsumeitempurchaseconsumeitemUpdateSubFormComponent) consumeitempurchaseconsumeitemUpdateSubForm: ConsumeitempurchaseconsumeitemUpdateSubFormComponent;

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

  get consumeitempurchaseconsumeitemsField(): FormControl{
    return this.form.controls.consumeitempurchaseconsumeitems as FormControl;
  }

  get invoiceField(): FormControl{
    return this.form.controls.invoice as FormControl;
  }

  get descriptionField(): FormControl{
    return this.form.controls.description as FormControl;
  }

  constructor(
    private vendorService: VendorService,
    private consumeitempurchaseService: ConsumeitempurchaseService,
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

    this.vendorService.getAllBasic(new PageRequest()).then((vendorDataPage) => {
      this.vendors = vendorDataPage.content;
    }).catch((e) => {
      console.log(e);
      this.snackBar.open('Something is wrong', null, {duration: 2000});
    });
    this.consumeitempurchase = await this.consumeitempurchaseService.get(this.selectedId);
    this.setValues();
  }

  updatePrivileges(): any {
    this.privilege.add = LoggedUser.can(UsecaseList.ADD_CONSUMEITEMPURCHASE);
    this.privilege.showAll = LoggedUser.can(UsecaseList.SHOW_ALL_CONSUMEITEMPURCHASES);
    this.privilege.showOne = LoggedUser.can(UsecaseList.SHOW_CONSUMEITEMPURCHASE_DETAILS);
    this.privilege.delete = LoggedUser.can(UsecaseList.DELETE_CONSUMEITEMPURCHASE);
    this.privilege.update = LoggedUser.can(UsecaseList.UPDATE_CONSUMEITEMPURCHASE);
  }

  discardChanges(): void{
    this.form.markAsPristine();
    this.form.markAsUntouched();
    this.setValues();
  }

  setValues(): void{
    if (this.vendorField.pristine) {
      this.vendorField.setValue(this.consumeitempurchase.vendor.id);
    }
    if (this.dateField.pristine) {
      this.dateField.setValue(this.consumeitempurchase.date);
    }
    if (this.totalField.pristine) {
      this.totalField.setValue(this.consumeitempurchase.total);
    }
    if (this.balanceField.pristine) {
      this.balanceField.setValue(this.consumeitempurchase.balance);
    }
    if (this.consumeitempurchaseconsumeitemsField.pristine) {
      this.consumeitempurchaseconsumeitemsField.setValue(this.consumeitempurchase.consumeitempurchaseconsumeitemList);
    }
    if (this.invoiceField.pristine) {
      if (this.consumeitempurchase.invoice) { this.invoiceField.setValue([this.consumeitempurchase.invoice]); }
      else { this.invoiceField.setValue([]); }
    }
    if (this.descriptionField.pristine) {
      this.descriptionField.setValue(this.consumeitempurchase.description);
    }
}

  async submit(): Promise<void> {
    this.consumeitempurchaseconsumeitemUpdateSubForm.resetForm();
    this.consumeitempurchaseconsumeitemsField.markAsDirty();
    this.invoiceField.updateValueAndValidity();
    this.invoiceField.markAsTouched();
    if (this.form.invalid) { return; }

    const newconsumeitempurchase: Consumeitempurchase = new Consumeitempurchase();
    newconsumeitempurchase.vendor = this.vendorField.value;
    newconsumeitempurchase.date = DateHelper.getDateAsString(this.dateField.value);
    newconsumeitempurchase.total = this.totalField.value;
    newconsumeitempurchase.balance = this.balanceField.value;
    newconsumeitempurchase.consumeitempurchaseconsumeitemList = this.consumeitempurchaseconsumeitemsField.value;
    const invoiceIds = this.invoiceField.value;
    if (invoiceIds !== null && invoiceIds !== []){
      newconsumeitempurchase.invoice = invoiceIds[0];
    }else{
      newconsumeitempurchase.invoice = null;
    }
    newconsumeitempurchase.description = this.descriptionField.value;
    try{
      const resourceLink: ResourceLink = await this.consumeitempurchaseService.update(this.selectedId, newconsumeitempurchase);
      if (this.privilege.showOne) {
        await this.router.navigateByUrl('/consumeitempurchases/' + resourceLink.id);
      } else {
        await this.router.navigateByUrl('/consumeitempurchases');
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
}
