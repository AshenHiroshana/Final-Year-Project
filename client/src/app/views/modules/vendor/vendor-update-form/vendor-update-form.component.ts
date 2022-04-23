import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {MatSnackBar} from '@angular/material/snack-bar';
import {LoggedUser} from '../../../../shared/logged-user';
import {UsecaseList} from '../../../../usecase-list';
import {ResourceLink} from '../../../../shared/resource-link';
import {AbstractComponent} from '../../../../shared/abstract-component';
import {PageRequest} from '../../../../shared/page-request';
import {Vendor} from '../../../../entities/vendor';
import {VendorService} from '../../../../services/vendor.service';
import {Vendortype} from '../../../../entities/vendortype';
import {Vendorstatus} from '../../../../entities/vendorstatus';
import {VendortypeService} from '../../../../services/vendortype.service';
import {VendorstatusService} from '../../../../services/vendorstatus.service';

@Component({
  selector: 'app-vendor-update-form',
  templateUrl: './vendor-update-form.component.html',
  styleUrls: ['./vendor-update-form.component.scss']
})
export class VendorUpdateFormComponent extends AbstractComponent implements OnInit {

  selectedId: number;
  vendor: Vendor;

  vendortypes: Vendortype[] = [];
  vendorstatuses: Vendorstatus[] = [];

  form = new FormGroup({
    name: new FormControl(null, [
      Validators.required,
      Validators.minLength(null),
      Validators.maxLength(255),
    ]),
    email: new FormControl(null, [
      Validators.minLength(5),
      Validators.maxLength(255),
      Validators.pattern('^[a-zA-Z0-9]{1,}[@][a-zA-Z0-9]{1,}[.][a-zA-Z0-9]{1,}$'),
    ]),
    primarycontact: new FormControl(null, [
      Validators.required,
      Validators.minLength(10),
      Validators.maxLength(10),
      Validators.pattern('^[0][0-9]{9}$'),
    ]),
    secondarycontact: new FormControl(null, [
      Validators.minLength(10),
      Validators.maxLength(10),
      Validators.pattern('^[0][0-9]{9}$'),
    ]),
    fax: new FormControl(null, [
      Validators.minLength(10),
      Validators.maxLength(10),
      Validators.pattern('^[0][0-9]{9}$'),
    ]),
    vendortype: new FormControl(null, [
      Validators.required,
    ]),
    vendorstatus: new FormControl('1', [
      Validators.required,
    ]),
    starrate: new FormControl(null, [
      Validators.min(0),
      Validators.max(3),
      Validators.pattern('^([0-9]{1,8}([.][0-9]{1,2})?)$'),
    ]),
    address: new FormControl(null, [
      Validators.required,
      Validators.minLength(4),
      Validators.maxLength(65535),
    ]),
    description: new FormControl(null, [
      Validators.minLength(null),
      Validators.maxLength(65535),
    ]),
  });

  get nameField(): FormControl{
    return this.form.controls.name as FormControl;
  }

  get emailField(): FormControl{
    return this.form.controls.email as FormControl;
  }

  get primarycontactField(): FormControl{
    return this.form.controls.primarycontact as FormControl;
  }

  get secondarycontactField(): FormControl{
    return this.form.controls.secondarycontact as FormControl;
  }

  get faxField(): FormControl{
    return this.form.controls.fax as FormControl;
  }

  get vendortypeField(): FormControl{
    return this.form.controls.vendortype as FormControl;
  }

  get vendorstatusField(): FormControl{
    return this.form.controls.vendorstatus as FormControl;
  }

  get starrateField(): FormControl{
    return this.form.controls.starrate as FormControl;
  }

  get addressField(): FormControl{
    return this.form.controls.address as FormControl;
  }

  get descriptionField(): FormControl{
    return this.form.controls.description as FormControl;
  }

  constructor(
    private vendortypeService: VendortypeService,
    private vendorstatusService: VendorstatusService,
    private vendorService: VendorService,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar,
    private router: Router
  ) {
    super();
  }

  ngOnInit(): void {
    this.vendortypeService.getAll().then((vendortypes) => {
      this.vendortypes = vendortypes;
    }).catch((e) => {
      console.log(e);
      this.snackBar.open('Something is wrong', null, {duration: 2000});
    });
    this.vendorstatusService.getAll().then((vendorstatuses) => {
      this.vendorstatuses = vendorstatuses;
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

    this.vendor = await this.vendorService.get(this.selectedId);
    this.setValues();
  }

  updatePrivileges(): any {
    this.privilege.add = LoggedUser.can(UsecaseList.ADD_VENDOR);
    this.privilege.showAll = LoggedUser.can(UsecaseList.SHOW_ALL_VENDORS);
    this.privilege.showOne = LoggedUser.can(UsecaseList.SHOW_VENDOR_DETAILS);
    this.privilege.delete = LoggedUser.can(UsecaseList.DELETE_VENDOR);
    this.privilege.update = LoggedUser.can(UsecaseList.UPDATE_VENDOR);
  }

  discardChanges(): void{
    this.form.markAsPristine();
    this.form.markAsUntouched();
    this.setValues();
  }

  setValues(): void{
    if (this.nameField.pristine) {
      this.nameField.setValue(this.vendor.name);
    }
    if (this.emailField.pristine) {
      this.emailField.setValue(this.vendor.email);
    }
    if (this.primarycontactField.pristine) {
      this.primarycontactField.setValue(this.vendor.primarycontact);
    }
    if (this.secondarycontactField.pristine) {
      this.secondarycontactField.setValue(this.vendor.secondarycontact);
    }
    if (this.faxField.pristine) {
      this.faxField.setValue(this.vendor.fax);
    }
    if (this.vendortypeField.pristine) {
      this.vendortypeField.setValue(this.vendor.vendortype.id);
    }
    if (this.vendorstatusField.pristine) {
      this.vendorstatusField.setValue(this.vendor.vendorstatus.id);
    }
    if (this.starrateField.pristine) {
      this.starrateField.setValue(this.vendor.starrate);
    }
    if (this.addressField.pristine) {
      this.addressField.setValue(this.vendor.address);
    }
    if (this.descriptionField.pristine) {
      this.descriptionField.setValue(this.vendor.description);
    }
}

  async submit(): Promise<void> {
    if (this.form.invalid) { return; }

    const newvendor: Vendor = new Vendor();
    newvendor.name = this.nameField.value;
    newvendor.email = this.emailField.value;
    newvendor.primarycontact = this.primarycontactField.value;
    newvendor.secondarycontact = this.secondarycontactField.value;
    newvendor.fax = this.faxField.value;
    newvendor.vendortype = this.vendortypeField.value;
    newvendor.vendorstatus = this.vendorstatusField.value;
    newvendor.starrate = this.starrateField.value;
    newvendor.address = this.addressField.value;
    newvendor.description = this.descriptionField.value;
    try{
      const resourceLink: ResourceLink = await this.vendorService.update(this.selectedId, newvendor);
      if (this.privilege.showOne) {
        await this.router.navigateByUrl('/vendors/' + resourceLink.id);
      } else {
        await this.router.navigateByUrl('/vendors');
      }
    }catch (e) {
      switch (e.status) {
        case 401: break;
        case 403: this.snackBar.open(e.error.message, null, {duration: 2000}); break;
        case 400:
          const msg = JSON.parse(e.error.message);
          let knownError = false;
          if (msg.name) { this.nameField.setErrors({server: msg.name}); knownError = true; }
          if (msg.email) { this.emailField.setErrors({server: msg.email}); knownError = true; }
          if (msg.primarycontact) { this.primarycontactField.setErrors({server: msg.primarycontact}); knownError = true; }
          if (msg.secondarycontact) { this.secondarycontactField.setErrors({server: msg.secondarycontact}); knownError = true; }
          if (msg.fax) { this.faxField.setErrors({server: msg.fax}); knownError = true; }
          if (msg.vendortype) { this.vendortypeField.setErrors({server: msg.vendortype}); knownError = true; }
          if (msg.vendorstatus) { this.vendorstatusField.setErrors({server: msg.vendorstatus}); knownError = true; }
          if (msg.starrate) { this.starrateField.setErrors({server: msg.starrate}); knownError = true; }
          if (msg.address) { this.addressField.setErrors({server: msg.address}); knownError = true; }
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
