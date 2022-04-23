import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {MatSnackBar} from '@angular/material/snack-bar';
import {LoggedUser} from '../../../../shared/logged-user';
import {UsecaseList} from '../../../../usecase-list';
import {ResourceLink} from '../../../../shared/resource-link';
import {AbstractComponent} from '../../../../shared/abstract-component';
import {PageRequest} from '../../../../shared/page-request';
import {Consumeitem} from '../../../../entities/consumeitem';
import {ConsumeitemService} from '../../../../services/consumeitem.service';
import {Unit} from '../../../../entities/unit';
import {Vendor} from '../../../../entities/vendor';
import {UnitService} from '../../../../services/unit.service';
import {VendorService} from '../../../../services/vendor.service';
import {Consumeitemcategory} from '../../../../entities/consumeitemcategory';
import {ConsumeitemcategoryService} from '../../../../services/consumeitemcategory.service';

@Component({
  selector: 'app-consumeitem-update-form',
  templateUrl: './consumeitem-update-form.component.html',
  styleUrls: ['./consumeitem-update-form.component.scss']
})
export class ConsumeitemUpdateFormComponent extends AbstractComponent implements OnInit {

  selectedId: number;
  consumeitem: Consumeitem;

  consumeitemcategories: Consumeitemcategory[] = [];
  units: Unit[] = [];
  vendors: Vendor[] = [];

  form = new FormGroup({
    consumeitemcategory: new FormControl(null, [
      Validators.required,
    ]),
    name: new FormControl(null, [
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(255),
    ]),
    unit: new FormControl(null, [
      Validators.required,
    ]),
    qty: new FormControl(null, [
      Validators.required,
      Validators.min(-2147483648),
      Validators.max(2147483647),
      Validators.pattern('^([0-9]*)$'),
    ]),
    photo: new FormControl(),
    vendors: new FormControl(),
    description: new FormControl(null, [
      Validators.minLength(null),
      Validators.maxLength(65535),
    ]),
  });

  get consumeitemcategoryField(): FormControl{
    return this.form.controls.consumeitemcategory as FormControl;
  }

  get nameField(): FormControl{
    return this.form.controls.name as FormControl;
  }

  get unitField(): FormControl{
    return this.form.controls.unit as FormControl;
  }

  get qtyField(): FormControl{
    return this.form.controls.qty as FormControl;
  }

  get photoField(): FormControl{
    return this.form.controls.photo as FormControl;
  }

  get vendorsField(): FormControl{
    return this.form.controls.vendors as FormControl;
  }

  get descriptionField(): FormControl{
    return this.form.controls.description as FormControl;
  }

  constructor(
    private consumeitemcategoryService: ConsumeitemcategoryService,
    private unitService: UnitService,
    private vendorService: VendorService,
    private consumeitemService: ConsumeitemService,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar,
    private router: Router
  ) {
    super();
  }

  ngOnInit(): void {
    this.consumeitemcategoryService.getAll().then((consumeitemcategories) => {
      this.consumeitemcategories = consumeitemcategories;
    }).catch((e) => {
      console.log(e);
      this.snackBar.open('Something is wrong', null, {duration: 2000});
    });
    this.unitService.getAll().then((units) => {
      this.units = units;
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
    this.route.paramMap.subscribe( async (params) => {
      this.selectedId =  + params.get('id');
      await this.loadData();
      this.refreshData();
    });
  }

  async loadData(): Promise<any>{

    this.updatePrivileges();
    if (!this.privilege.update) { return; }

    this.consumeitem = await this.consumeitemService.get(this.selectedId);
    this.setValues();
  }

  updatePrivileges(): any {
    this.privilege.add = LoggedUser.can(UsecaseList.ADD_CONSUMEITEM);
    this.privilege.showAll = LoggedUser.can(UsecaseList.SHOW_ALL_CONSUMEITEMS);
    this.privilege.showOne = LoggedUser.can(UsecaseList.SHOW_CONSUMEITEM_DETAILS);
    this.privilege.delete = LoggedUser.can(UsecaseList.DELETE_CONSUMEITEM);
    this.privilege.update = LoggedUser.can(UsecaseList.UPDATE_CONSUMEITEM);
  }

  discardChanges(): void{
    this.form.markAsPristine();
    this.form.markAsUntouched();
    this.setValues();
  }

  setValues(): void{
    if (this.consumeitemcategoryField.pristine) {
      this.consumeitemcategoryField.setValue(this.consumeitem.consumeitemcategory.id);
    }
    if (this.nameField.pristine) {
      this.nameField.setValue(this.consumeitem.name);
    }
    if (this.unitField.pristine) {
      this.unitField.setValue(this.consumeitem.unit.id);
    }
    if (this.qtyField.pristine) {
      this.qtyField.setValue(this.consumeitem.qty);
    }
    if (this.photoField.pristine) {
      if (this.consumeitem.photo) { this.photoField.setValue([this.consumeitem.photo]); }
      else { this.photoField.setValue([]); }
    }
    if (this.vendorsField.pristine) {
      this.vendorsField.setValue(this.consumeitem.vendorList);
    }
    if (this.descriptionField.pristine) {
      this.descriptionField.setValue(this.consumeitem.description);
    }
}

  async submit(): Promise<void> {
    this.photoField.updateValueAndValidity();
    this.photoField.markAsTouched();
    this.vendorsField.updateValueAndValidity();
    this.vendorsField.markAsTouched();
    if (this.form.invalid) { return; }

    const newconsumeitem: Consumeitem = new Consumeitem();
    newconsumeitem.consumeitemcategory = this.consumeitemcategoryField.value;
    newconsumeitem.name = this.nameField.value;
    newconsumeitem.unit = this.unitField.value;
    newconsumeitem.qty = this.qtyField.value;
    const photoIds = this.photoField.value;
    if (photoIds !== null && photoIds !== []){
      newconsumeitem.photo = photoIds[0];
    }else{
      newconsumeitem.photo = null;
    }
    newconsumeitem.vendorList = this.vendorsField.value;
    newconsumeitem.description = this.descriptionField.value;
    try{
      const resourceLink: ResourceLink = await this.consumeitemService.update(this.selectedId, newconsumeitem);
      if (this.privilege.showOne) {
        await this.router.navigateByUrl('/consumeitems/' + resourceLink.id);
      } else {
        await this.router.navigateByUrl('/consumeitems');
      }
    }catch (e) {
      switch (e.status) {
        case 401: break;
        case 403: this.snackBar.open(e.error.message, null, {duration: 2000}); break;
        case 400:
          const msg = JSON.parse(e.error.message);
          let knownError = false;
          if (msg.consumeitemcategory) { this.consumeitemcategoryField.setErrors({server: msg.consumeitemcategory}); knownError = true; }
          if (msg.name) { this.nameField.setErrors({server: msg.name}); knownError = true; }
          if (msg.unit) { this.unitField.setErrors({server: msg.unit}); knownError = true; }
          if (msg.qty) { this.qtyField.setErrors({server: msg.qty}); knownError = true; }
          if (msg.photo) { this.photoField.setErrors({server: msg.photo}); knownError = true; }
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
