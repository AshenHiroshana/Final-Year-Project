import { Component, OnInit } from '@angular/core';
import {ResourceLink} from '../../../../shared/resource-link';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Router} from '@angular/router';
import {AbstractComponent} from '../../../../shared/abstract-component';
import {LoggedUser} from '../../../../shared/logged-user';
import {UsecaseList} from '../../../../usecase-list';
import {PageRequest} from '../../../../shared/page-request';
import {Material} from '../../../../entities/material';
import {MaterialService} from '../../../../services/material.service';
import {Materialtype} from '../../../../entities/materialtype';
import {MaterialtypeService} from '../../../../services/materialtype.service';

@Component({
  selector: 'app-material-form',
  templateUrl: './material-form.component.html',
  styleUrls: ['./material-form.component.scss']
})
export class MaterialFormComponent extends AbstractComponent implements OnInit {

  materialtypes: Materialtype[] = [];

  form = new FormGroup({
    name: new FormControl(null, [
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(255),
    ]),
    pagecount: new FormControl(null, [
      Validators.required,
      Validators.min(-2147483648),
      Validators.max(2147483647),
      Validators.pattern('^([0-9]*)$'),
    ]),
    materialtype: new FormControl(null, [
      Validators.required,
    ]),
    file: new FormControl(),
  });

  get nameField(): FormControl{
    return this.form.controls.name as FormControl;
  }

  get pagecountField(): FormControl{
    return this.form.controls.pagecount as FormControl;
  }

  get materialtypeField(): FormControl{
    return this.form.controls.materialtype as FormControl;
  }

  get fileField(): FormControl{
    return this.form.controls.file as FormControl;
  }

  constructor(
    private materialtypeService: MaterialtypeService,
    private materialService: MaterialService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {
    super();
  }

  ngOnInit(): void {
    this.loadData();
    this.refreshData();
  }

async loadData(): Promise<any>{

    this.updatePrivileges();
    if (!this.privilege.add) { return; }

    this.materialtypeService.getAll().then((materialtypes) => {
      this.materialtypes = materialtypes;
    }).catch((e) => {
      console.log(e);
      this.snackBar.open('Something is wrong', null, {duration: 2000});
    });
  }

  updatePrivileges(): any {
    this.privilege.add = LoggedUser.can(UsecaseList.ADD_MATERIAL);
    this.privilege.showAll = LoggedUser.can(UsecaseList.SHOW_ALL_MATERIALS);
    this.privilege.showOne = LoggedUser.can(UsecaseList.SHOW_MATERIAL_DETAILS);
    this.privilege.delete = LoggedUser.can(UsecaseList.DELETE_MATERIAL);
    this.privilege.update = LoggedUser.can(UsecaseList.UPDATE_MATERIAL);
  }

  async submit(): Promise<void> {
    this.fileField.updateValueAndValidity();
    this.fileField.markAsTouched();
    if (this.form.invalid) { return; }

    const material: Material = new Material();
    material.name = this.nameField.value;
    material.pagecount = this.pagecountField.value;
    material.materialtype = this.materialtypeField.value;
    const fileIds = this.fileField.value;
    if (fileIds !== null && fileIds !== []){
      material.file = fileIds[0];
    }else{
      material.file = null;
    }
    try{
      const resourceLink: ResourceLink = await this.materialService.add(material);
      if (this.privilege.showOne) {
        await this.router.navigateByUrl('/materials/' + resourceLink.id);
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
          if (msg.pagecount) { this.pagecountField.setErrors({server: msg.pagecount}); knownError = true; }
          if (msg.materialtype) { this.materialtypeField.setErrors({server: msg.materialtype}); knownError = true; }
          if (msg.file) { this.fileField.setErrors({server: msg.file}); knownError = true; }
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
