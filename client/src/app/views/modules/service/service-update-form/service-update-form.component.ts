import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {MatSnackBar} from '@angular/material/snack-bar';
import {LoggedUser} from '../../../../shared/logged-user';
import {UsecaseList} from '../../../../usecase-list';
import {ResourceLink} from '../../../../shared/resource-link';
import {AbstractComponent} from '../../../../shared/abstract-component';
import {PageRequest} from '../../../../shared/page-request';
import {Service} from '../../../../entities/service';
import {ServiceService} from '../../../../services/service.service';
import {ViewChild} from '@angular/core';
import {Branch} from '../../../../entities/branch';
import {Vendor} from '../../../../entities/vendor';
import {DateHelper} from '../../../../shared/date-helper';
import {Servicetype} from '../../../../entities/servicetype';
import {Servicestatus} from '../../../../entities/servicestatus';
import {BranchService} from '../../../../services/branch.service';
import {VendorService} from '../../../../services/vendor.service';
import {ServicetypeService} from '../../../../services/servicetype.service';
import {ServicestatusService} from '../../../../services/servicestatus.service';
import {ServiceprocurementitemUpdateSubFormComponent} from './serviceprocurementitem-update-sub-form/serviceprocurementitem-update-sub-form.component';
import {Serviceprocurementitem} from "../../../../entities/serviceprocurementitem";
import {BranchsectionService} from "../../../../services/branchsection.service";
import {Branchsection} from "../../../../entities/branchsection";
import { ProcurementitemService } from 'src/app/services/procurementitem.service';
import {Procurementitem} from "../../../../entities/procurementitem";

@Component({
  selector: 'app-service-update-form',
  templateUrl: './service-update-form.component.html',
  styleUrls: ['./service-update-form.component.scss']
})
export class ServiceUpdateFormComponent extends AbstractComponent implements OnInit {

  selectedId: number;
  service: Service;
  branchsections: Branchsection[] = [];
  procurementitems: Procurementitem[] = [];
  branches: Branch[] = [];
  vendors: Vendor[] = [];
  servicetypes: Servicetype[] = [];
  @ViewChild(ServiceprocurementitemUpdateSubFormComponent) serviceprocurementitemUpdateSubForm: ServiceprocurementitemUpdateSubFormComponent;
  servicestatuses: Servicestatus[] = [];

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
    servicestatus: new FormControl('1', [
      Validators.required,
    ]),
    invoice: new FormControl(),
    description: new FormControl(null, [
      Validators.minLength(null),
      Validators.maxLength(65535),
    ]),
    branchsection: new FormControl(),
  });


  get branchField(): FormControl{
    return this.form.controls.branch as FormControl;
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

  get servicestatusField(): FormControl{
    return this.form.controls.servicestatus as FormControl;
  }

  get invoiceField(): FormControl{
    return this.form.controls.invoice as FormControl;
  }

  get descriptionField(): FormControl{
    return this.form.controls.description as FormControl;
  }

  get branchSectionField(): FormControl{
    return this.form.controls.branchsection as FormControl;
  }


  constructor(
    private branchService: BranchService,
    private vendorService: VendorService,
    private servicetypeService: ServicetypeService,
    private servicestatusService: ServicestatusService,
    private serviceService: ServiceService,
    private procurementitemService: ProcurementitemService,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar,
    private branchsectionService: BranchsectionService,
    private router: Router
  ) {
    super();
  }

  async ngOnInit(): Promise<void> {
    this.route.paramMap.subscribe(async (params) => {
      this.selectedId = +params.get('id');
      await this.loadData();
      this.refreshData();
    });

  }

  async loadData(): Promise<any>{
    this.branchField.disable();
    this.vendorField.disable();
    this.balanceField.disable();
    this.totalField.disable();
    this.updatePrivileges();
    if (!this.privilege.update) { return; }

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
    this.servicetypeService.getAllBasic(new PageRequest()).then((servicetypeDataPage) => {
      this.servicetypes = servicetypeDataPage.content;
    }).catch((e) => {
      console.log(e);
      this.snackBar.open('Something is wrong', null, {duration: 2000});
    });
    this.servicestatusService.getAll().then((servicestatuses) => {
      this.servicestatuses = servicestatuses;
    }).catch((e) => {
      console.log(e);
      this.snackBar.open('Something is wrong', null, {duration: 2000});
    });

    this.branchsectionService.getAllByBranch(this.selectedId).then((procurementitemDataPage) => {
      this.branchsections = procurementitemDataPage;
    }).catch((e) => {
      console.log(e);
      this.snackBar.open('Something is wrong', null, {duration: 2000});
    });

    this.service = await this.serviceService.get(this.selectedId);
    this.setValues();
    this.loadBranchSection();
    this.loadType();
  }

  updatePrivileges(): any {
    this.privilege.add = LoggedUser.can(UsecaseList.ADD_SERVICE);
    this.privilege.showAll = LoggedUser.can(UsecaseList.SHOW_ALL_SERVICES);
    this.privilege.showOne = LoggedUser.can(UsecaseList.SHOW_SERVICE_DETAILS);
    this.privilege.delete = LoggedUser.can(UsecaseList.DELETE_SERVICE);
    this.privilege.update = LoggedUser.can(UsecaseList.UPDATE_SERVICE);
  }

  discardChanges(): void{
    this.form.markAsPristine();
    this.form.markAsUntouched();
    this.setValues();
  }

  setValues(): void{
    if (this.branchField.pristine) {
      this.branchField.setValue(this.service.branch.id);
    }
    if (this.vendorField.pristine) {
      this.vendorField.setValue(this.service.vendor.id);
    }
    if (this.servicetypeField.pristine) {
      this.servicetypeField.setValue(this.service.servicetype.id);
    }
    if (this.sdateField.pristine) {
      this.sdateField.setValue(this.service.sdate);
    }
    if (this.titleField.pristine) {
      this.titleField.setValue(this.service.title);
    }
    if (this.serviceprocurementitemsField.pristine) {
      this.serviceprocurementitemsField.setValue(this.service.serviceprocurementitemList);
    }
    if (this.totalField.pristine) {
      this.totalField.markAsDirty();
      this.totalField.setValue(this.service.total);
    }
    if (this.balanceField.pristine) {
      this.balanceField.setValue(this.service.balance);
    }
    if (this.edateField.pristine) {
      this.edateField.setValue(this.service.edate);
    }
    if (this.servicestatusField.pristine) {
      this.servicestatusField.setValue(this.service.servicestatus.id);
    }
    if (this.invoiceField.pristine) {
      if (this.service.invoice) { this.invoiceField.setValue([this.service.invoice]); }
      else { this.invoiceField.setValue([]); }
    }
    if (this.descriptionField.pristine) {
      this.descriptionField.setValue(this.service.description);
    }
}

  async submit(): Promise<void> {
    this.serviceprocurementitemUpdateSubForm.resetForm();
    this.serviceprocurementitemsField.markAsDirty();
    this.invoiceField.updateValueAndValidity();
    this.invoiceField.markAsTouched();
    if (this.form.invalid) { return; }

    const newservice: Service = new Service();
    newservice.branch = this.branchField.value;
    newservice.vendor = this.vendorField.value;
    newservice.servicetype = this.servicetypeField.value;
    newservice.sdate = DateHelper.getDateAsString(this.sdateField.value);
    newservice.title = this.titleField.value;
    newservice.serviceprocurementitemList = this.serviceprocurementitemsField.value;
    newservice.total = this.totalField.value;
    newservice.balance = this.totalField.value;
    newservice.edate = this.edateField.value ? DateHelper.getDateAsString(this.edateField.value) : null;
    newservice.servicestatus = this.servicestatusField.value;
    const invoiceIds = this.invoiceField.value;
    if (invoiceIds !== null && invoiceIds !== []){
      newservice.invoice = invoiceIds[0];
    }else{
      newservice.invoice = null;
    }
    newservice.description = this.descriptionField.value;
    try{
      const resourceLink: ResourceLink = await this.serviceService.update(this.selectedId, newservice);
      if (this.privilege.showOne) {
        await this.router.navigateByUrl('/services/' + resourceLink.id);
      } else {
        await this.router.navigateByUrl('/services');
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
          if (msg.servicestatus) { this.servicestatusField.setErrors({server: msg.servicestatus}); knownError = true; }
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
    console.log('ff');
    this.branchField.disable();
    this.branchsectionService.getAllByBranch(this.branchField.value).then((procurementitemDataPage) => {
      this.branchsections = procurementitemDataPage;
    }).catch((e) => {
      console.log(e);
      this.snackBar.open('Something is wrong', null, {duration: 2000});
    });
  }


  totalCalculation(): void {
    let total = 0 ;
    this.serviceprocurementitemsField.value.forEach((item: Serviceprocurementitem) => {
      total += parseFloat(String(item.amount));
    });
    this.totalField.patchValue(total);
  }

}
