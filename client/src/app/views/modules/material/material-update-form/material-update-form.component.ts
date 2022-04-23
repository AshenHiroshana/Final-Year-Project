import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {MatSnackBar} from '@angular/material/snack-bar';
import {LoggedUser} from '../../../../shared/logged-user';
import {UsecaseList} from '../../../../usecase-list';
import {ResourceLink} from '../../../../shared/resource-link';
import {AbstractComponent} from '../../../../shared/abstract-component';
import {PageRequest} from '../../../../shared/page-request';
import {Material} from '../../../../entities/material';
import {MaterialService} from '../../../../services/material.service';
import {Materialtype} from '../../../../entities/materialtype';
import {Materialstatus} from '../../../../entities/materialstatus';
import {MaterialtypeService} from '../../../../services/materialtype.service';
import {MaterialstatusService} from '../../../../services/materialstatus.service';

@Component({
  selector: 'app-material-update-form',
  templateUrl: './material-update-form.component.html',
  styleUrls: ['./material-update-form.component.scss']
})
export class MaterialUpdateFormComponent extends AbstractComponent implements OnInit {

  selectedId: number;
  material: Material;

  materialtypes: Materialtype[] = [];
  materialstatuses: Materialstatus[] = [];

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
    materialstatus: new FormControl('1', [
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

  get materialstatusField(): FormControl{
    return this.form.controls.materialstatus as FormControl;
  }

  get fileField(): FormControl{
    return this.form.controls.file as FormControl;
  }

  constructor(
    private materialtypeService: MaterialtypeService,
    private materialstatusService: MaterialstatusService,
    private materialService: MaterialService,
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
    this.fileField.disable();
    this.updatePrivileges();
    if (!this.privilege.update) { return; }

    this.materialtypeService.getAll().then((materialtypes) => {
      this.materialtypes = materialtypes;
    }).catch((e) => {
      console.log(e);
      this.snackBar.open('Something is wrong', null, {duration: 2000});
    });
    this.materialstatusService.getAll().then((materialstatuses) => {
      this.materialstatuses = materialstatuses;
    }).catch((e) => {
      console.log(e);
      this.snackBar.open('Something is wrong', null, {duration: 2000});
    });
    this.material = await this.materialService.get(this.selectedId);
    this.setValues();
  }

  updatePrivileges(): any {
    this.privilege.add = LoggedUser.can(UsecaseList.ADD_MATERIAL);
    this.privilege.showAll = LoggedUser.can(UsecaseList.SHOW_ALL_MATERIALS);
    this.privilege.showOne = LoggedUser.can(UsecaseList.SHOW_MATERIAL_DETAILS);
    this.privilege.delete = LoggedUser.can(UsecaseList.DELETE_MATERIAL);
    this.privilege.update = LoggedUser.can(UsecaseList.UPDATE_MATERIAL);
  }

  discardChanges(): void{
    this.form.markAsPristine();
    this.form.markAsUntouched();
    this.setValues();
  }

  setValues(): void{
    if (this.nameField.pristine) {
      this.nameField.setValue(this.material.name);
    }
    if (this.pagecountField.pristine) {
      this.pagecountField.setValue(this.material.pagecount);
    }
    if (this.materialtypeField.pristine) {
      this.materialtypeField.setValue(this.material.materialtype.id);
    }
    if (this.materialstatusField.pristine) {
      this.materialstatusField.setValue(this.material.materialstatus.id);
    }
    if (this.fileField.pristine) {
      if (this.material.file) { this.fileField.setValue([this.material.file]); }
      else { this.fileField.setValue([]); }
    }
}

  async submit(): Promise<void> {
    this.fileField.updateValueAndValidity();
    this.fileField.markAsTouched();
    if (this.form.invalid) { return; }

    const newmaterial: Material = new Material();
    newmaterial.name = this.nameField.value;
    newmaterial.pagecount = this.pagecountField.value;
    newmaterial.materialtype = this.materialtypeField.value;
    newmaterial.materialstatus = this.materialstatusField.value;
    const fileIds = this.fileField.value;
    if (fileIds !== null && fileIds !== []){
      newmaterial.file = fileIds[0];
    }else{
      newmaterial.file = null;
    }
    try{
      const resourceLink: ResourceLink = await this.materialService.update(this.selectedId, newmaterial);
      if (this.privilege.showOne) {
        await this.router.navigateByUrl('/materials/' + resourceLink.id);
      } else {
        await this.router.navigateByUrl('/materials');
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
          if (msg.materialstatus) { this.materialstatusField.setErrors({server: msg.materialstatus}); knownError = true; }
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
