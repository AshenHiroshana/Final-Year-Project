import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {MatSnackBar} from '@angular/material/snack-bar';
import {LoggedUser} from '../../../../shared/logged-user';
import {UsecaseList} from '../../../../usecase-list';
import {ResourceLink} from '../../../../shared/resource-link';
import {AbstractComponent} from '../../../../shared/abstract-component';
import {PageRequest} from '../../../../shared/page-request';
import {Procurementitempurchase} from '../../../../entities/procurementitempurchase';
import {ProcurementitempurchaseService} from '../../../../services/procurementitempurchase.service';
import {Vendor} from '../../../../entities/vendor';
import {DateHelper} from '../../../../shared/date-helper';
import {VendorService} from '../../../../services/vendor.service';

@Component({
  selector: 'app-procurementitempurchase-update-form',
  templateUrl: './procurementitempurchase-update-form.component.html',
  styleUrls: ['./procurementitempurchase-update-form.component.scss']
})
export class ProcurementitempurchaseUpdateFormComponent extends AbstractComponent implements OnInit {

  selectedId: number;
  procurementitempurchase: Procurementitempurchase;

  vendors: Vendor[] = [];

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

  constructor(
    private vendorService: VendorService,
    private procurementitempurchaseService: ProcurementitempurchaseService,
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
    this.procurementitempurchase = await this.procurementitempurchaseService.get(this.selectedId);
    this.setValues();
  }

  updatePrivileges(): any {
    this.privilege.add = LoggedUser.can(UsecaseList.ADD_PROCUREMENTITEMPURCHASE);
    this.privilege.showAll = LoggedUser.can(UsecaseList.SHOW_ALL_PROCUREMENTITEMPURCHASES);
    this.privilege.showOne = LoggedUser.can(UsecaseList.SHOW_PROCUREMENTITEMPURCHASE_DETAILS);
    this.privilege.delete = LoggedUser.can(UsecaseList.DELETE_PROCUREMENTITEMPURCHASE);
    this.privilege.update = LoggedUser.can(UsecaseList.UPDATE_PROCUREMENTITEMPURCHASE);
  }

  discardChanges(): void{
    this.form.markAsPristine();
    this.form.markAsUntouched();
    this.setValues();
  }

  setValues(): void{
    if (this.vendorField.pristine) {
      this.vendorField.setValue(this.procurementitempurchase.vendor.id);
    }
    if (this.dateField.pristine) {
      this.dateField.setValue(this.procurementitempurchase.date);
    }
    if (this.totalField.pristine) {
      this.totalField.setValue(this.procurementitempurchase.total);
    }
    if (this.balanceField.pristine) {
      this.balanceField.setValue(this.procurementitempurchase.balance);
    }
    if (this.invoiceField.pristine) {
      if (this.procurementitempurchase.invoice) { this.invoiceField.setValue([this.procurementitempurchase.invoice]); }
      else { this.invoiceField.setValue([]); }
    }
    if (this.descriptionField.pristine) {
      this.descriptionField.setValue(this.procurementitempurchase.description);
    }
}

  async submit(): Promise<void> {
    this.invoiceField.updateValueAndValidity();
    this.invoiceField.markAsTouched();
    if (this.form.invalid) { return; }

    const newprocurementitempurchase: Procurementitempurchase = new Procurementitempurchase();
    newprocurementitempurchase.vendor = this.vendorField.value;
    newprocurementitempurchase.date = DateHelper.getDateAsString(this.dateField.value);
    newprocurementitempurchase.total = this.totalField.value;
    newprocurementitempurchase.balance = this.balanceField.value;
    const invoiceIds = this.invoiceField.value;
    if (invoiceIds !== null && invoiceIds !== []){
      newprocurementitempurchase.invoice = invoiceIds[0];
    }else{
      newprocurementitempurchase.invoice = null;
    }
    newprocurementitempurchase.description = this.descriptionField.value;
    try{
      const resourceLink: ResourceLink = await this.procurementitempurchaseService.update(this.selectedId, newprocurementitempurchase);
      if (this.privilege.showOne) {
        await this.router.navigateByUrl('/procurementitempurchases/' + resourceLink.id);
      } else {
        await this.router.navigateByUrl('/procurementitempurchases');
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
}
