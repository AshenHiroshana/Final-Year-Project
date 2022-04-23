import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {MatSnackBar} from '@angular/material/snack-bar';
import {LoggedUser} from '../../../../shared/logged-user';
import {UsecaseList} from '../../../../usecase-list';
import {ResourceLink} from '../../../../shared/resource-link';
import {AbstractComponent} from '../../../../shared/abstract-component';
import {PageRequest} from '../../../../shared/page-request';
import {Procurementitemtype} from '../../../../entities/procurementitemtype';
import {ProcurementitemtypeService} from '../../../../services/procurementitemtype.service';
import {Vendor} from '../../../../entities/vendor';
import {VendorService} from '../../../../services/vendor.service';

@Component({
  selector: 'app-procurementitemtype-update-form',
  templateUrl: './procurementitemtype-update-form.component.html',
  styleUrls: ['./procurementitemtype-update-form.component.scss']
})
export class ProcurementitemtypeUpdateFormComponent extends AbstractComponent implements OnInit {

  selectedId: number;
  procurementitemtype: Procurementitemtype;

  vendors: Vendor[] = [];

  form = new FormGroup({
    name: new FormControl(null, [
      Validators.required,
      Validators.minLength(null),
      Validators.maxLength(255),
      Validators.pattern('^([^0-9]*)$'),
    ]),
    vendors: new FormControl(),
    description: new FormControl(null, [
      Validators.minLength(null),
      Validators.maxLength(65535),
    ]),
  });

  get nameField(): FormControl{
    return this.form.controls.name as FormControl;
  }

  get vendorsField(): FormControl{
    return this.form.controls.vendors as FormControl;
  }

  get descriptionField(): FormControl{
    return this.form.controls.description as FormControl;
  }

  constructor(
    private vendorService: VendorService,
    private procurementitemtypeService: ProcurementitemtypeService,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar,
    private router: Router
  ) {
    super();
  }

  ngOnInit(): void {
    this.vendorService.getAllBasic(new PageRequest()).then((vendorDataPage) => {
      this.vendors = vendorDataPage.content;
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

    this.procurementitemtype = await this.procurementitemtypeService.get(this.selectedId);
    this.setValues();
  }

  updatePrivileges(): any {
    this.privilege.add = LoggedUser.can(UsecaseList.ADD_PROCUREMENTITEMTYPE);
    this.privilege.showAll = LoggedUser.can(UsecaseList.SHOW_ALL_PROCUREMENTITEMTYPES);
    this.privilege.showOne = LoggedUser.can(UsecaseList.SHOW_PROCUREMENTITEMTYPE_DETAILS);
    this.privilege.delete = LoggedUser.can(UsecaseList.DELETE_PROCUREMENTITEMTYPE);
    this.privilege.update = LoggedUser.can(UsecaseList.UPDATE_PROCUREMENTITEMTYPE);
  }

  discardChanges(): void{
    this.form.markAsPristine();
    this.form.markAsUntouched();
    this.setValues();
  }

  setValues(): void{
    if (this.nameField.pristine) {
      this.nameField.setValue(this.procurementitemtype.name);
    }
    if (this.vendorsField.pristine) {
      this.vendorsField.setValue(this.procurementitemtype.vendorList);
    }
    if (this.descriptionField.pristine) {
      this.descriptionField.setValue(this.procurementitemtype.description);
    }
}

  async submit(): Promise<void> {
    this.vendorsField.updateValueAndValidity();
    this.vendorsField.markAsTouched();
    if (this.form.invalid) { return; }

    const newprocurementitemtype: Procurementitemtype = new Procurementitemtype();
    newprocurementitemtype.name = this.nameField.value;
    newprocurementitemtype.vendorList = this.vendorsField.value;
    newprocurementitemtype.description = this.descriptionField.value;
    try{
      const resourceLink: ResourceLink = await this.procurementitemtypeService.update(this.selectedId, newprocurementitemtype);
      if (this.privilege.showOne) {
        await this.router.navigateByUrl('/procurementitemtypes/' + resourceLink.id);
      } else {
        await this.router.navigateByUrl('/procurementitemtypes');
      }
    }catch (e) {
      switch (e.status) {
        case 401: break;
        case 403: this.snackBar.open(e.error.message, null, {duration: 2000}); break;
        case 400:
          const msg = JSON.parse(e.error.message);
          let knownError = false;
          if (msg.name) { this.nameField.setErrors({server: msg.name}); knownError = true; }
          if (msg.vendorList) { this.vendorsField.setErrors({server: msg.vendorList}); knownError = true; }
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
