import { Component, OnInit } from '@angular/core';
import {ResourceLink} from '../../../../shared/resource-link';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Router} from '@angular/router';
import {AbstractComponent} from '../../../../shared/abstract-component';
import {LoggedUser} from '../../../../shared/logged-user';
import {UsecaseList} from '../../../../usecase-list';
import {PageRequest} from '../../../../shared/page-request';
import {Vendor} from '../../../../entities/vendor';
import {VendorService} from '../../../../services/vendor.service';
import {Vendortype} from '../../../../entities/vendortype';
import {VendortypeService} from '../../../../services/vendortype.service';

@Component({
  selector: 'app-vendor-form',
  templateUrl: './vendor-form.component.html',
  styleUrls: ['./vendor-form.component.scss']
})
export class VendorFormComponent extends AbstractComponent implements OnInit {

  vendortypes: Vendortype[] = [];

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

  get addressField(): FormControl{
    return this.form.controls.address as FormControl;
  }

  get descriptionField(): FormControl{
    return this.form.controls.description as FormControl;
  }

  constructor(
    private vendortypeService: VendortypeService,
    private vendorService: VendorService,
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
    this.loadData();
    this.refreshData();
  }

async loadData(): Promise<any>{

    this.updatePrivileges();
    if (!this.privilege.add) { return; }

  }

  updatePrivileges(): any {
    this.privilege.add = LoggedUser.can(UsecaseList.ADD_VENDOR);
    this.privilege.showAll = LoggedUser.can(UsecaseList.SHOW_ALL_VENDORS);
    this.privilege.showOne = LoggedUser.can(UsecaseList.SHOW_VENDOR_DETAILS);
    this.privilege.delete = LoggedUser.can(UsecaseList.DELETE_VENDOR);
    this.privilege.update = LoggedUser.can(UsecaseList.UPDATE_VENDOR);
  }

  async submit(): Promise<void> {
    if (this.form.invalid) { return; }

    const vendor: Vendor = new Vendor();
    vendor.name = this.nameField.value;
    vendor.email = this.emailField.value;
    vendor.primarycontact = this.primarycontactField.value;
    vendor.secondarycontact = this.secondarycontactField.value;
    vendor.fax = this.faxField.value;
    vendor.vendortype = this.vendortypeField.value;
    vendor.address = this.addressField.value;
    vendor.description = this.descriptionField.value;
    try{
      const resourceLink: ResourceLink = await this.vendorService.add(vendor);
      if (this.privilege.showOne) {
        await this.router.navigateByUrl('/vendors/' + resourceLink.id);
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
          if (msg.name) { this.nameField.setErrors({server: msg.name}); knownError = true; }
          if (msg.email) { this.emailField.setErrors({server: msg.email}); knownError = true; }
          if (msg.primarycontact) { this.primarycontactField.setErrors({server: msg.primarycontact}); knownError = true; }
          if (msg.secondarycontact) { this.secondarycontactField.setErrors({server: msg.secondarycontact}); knownError = true; }
          if (msg.fax) { this.faxField.setErrors({server: msg.fax}); knownError = true; }
          if (msg.vendortype) { this.vendortypeField.setErrors({server: msg.vendortype}); knownError = true; }
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
