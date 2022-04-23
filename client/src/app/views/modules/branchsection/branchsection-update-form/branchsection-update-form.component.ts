import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {MatSnackBar} from '@angular/material/snack-bar';
import {LoggedUser} from '../../../../shared/logged-user';
import {UsecaseList} from '../../../../usecase-list';
import {ResourceLink} from '../../../../shared/resource-link';
import {AbstractComponent} from '../../../../shared/abstract-component';
import {PageRequest} from '../../../../shared/page-request';
import {Branchsection} from '../../../../entities/branchsection';
import {BranchsectionService} from '../../../../services/branchsection.service';
import {Branch} from '../../../../entities/branch';
import {BranchService} from '../../../../services/branch.service';
import {Branchsectiontype} from '../../../../entities/branchsectiontype';
import {Branchsectionstatus} from '../../../../entities/branchsectionstatus';
import {BranchsectiontypeService} from '../../../../services/branchsectiontype.service';
import {BranchsectionstatusService} from '../../../../services/branchsectionstatus.service';

@Component({
  selector: 'app-branchsection-update-form',
  templateUrl: './branchsection-update-form.component.html',
  styleUrls: ['./branchsection-update-form.component.scss']
})
export class BranchsectionUpdateFormComponent extends AbstractComponent implements OnInit {

  selectedId: number;
  branchsection: Branchsection;

  branchsectionstatuses: Branchsectionstatus[] = [];
  branchsectiontypes: Branchsectiontype[] = [];
  branches: Branch[] = [];

  form = new FormGroup({
    name: new FormControl(null, [
      Validators.required,
      Validators.minLength(2),
      Validators.maxLength(45),
      Validators.pattern('^[a-zA-Z ]{3,}$'),
    ]),
    branchsectionstatus: new FormControl('1', [
      Validators.required,
    ]),
    branchsectiontype: new FormControl(null, [
      Validators.required,
    ]),
    branch: new FormControl(null, [
      Validators.required,
    ]),
    photo: new FormControl(),
    areaplan: new FormControl(),
    description: new FormControl(null, [
      Validators.minLength(null),
      Validators.maxLength(65535),
    ]),
  });

  get nameField(): FormControl{
    return this.form.controls.name as FormControl;
  }

  get branchsectionstatusField(): FormControl{
    return this.form.controls.branchsectionstatus as FormControl;
  }

  get branchsectiontypeField(): FormControl{
    return this.form.controls.branchsectiontype as FormControl;
  }

  get branchField(): FormControl{
    return this.form.controls.branch as FormControl;
  }

  get photoField(): FormControl{
    return this.form.controls.photo as FormControl;
  }

  get areaplanField(): FormControl{
    return this.form.controls.areaplan as FormControl;
  }

  get descriptionField(): FormControl{
    return this.form.controls.description as FormControl;
  }

  constructor(
    private branchsectionstatusService: BranchsectionstatusService,
    private branchsectiontypeService: BranchsectiontypeService,
    private branchService: BranchService,
    private branchsectionService: BranchsectionService,
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

    this.branchsectionstatusService.getAll().then((branchsectionstatuses) => {
      this.branchsectionstatuses = branchsectionstatuses;
    }).catch((e) => {
      console.log(e);
      this.snackBar.open('Something is wrong', null, {duration: 2000});
    });
    this.branchsectiontypeService.getAll().then((branchsectiontypes) => {
      this.branchsectiontypes = branchsectiontypes;
    }).catch((e) => {
      console.log(e);
      this.snackBar.open('Something is wrong', null, {duration: 2000});
    });
    this.branchService.getAllBasic(new PageRequest()).then((branchDataPage) => {
      this.branches = branchDataPage.content;
    }).catch((e) => {
      console.log(e);
      this.snackBar.open('Something is wrong', null, {duration: 2000});
    });
    this.branchsection = await this.branchsectionService.get(this.selectedId);
    this.setValues();
  }

  updatePrivileges(): any {
    this.privilege.add = LoggedUser.can(UsecaseList.ADD_BRANCHSECTION);
    this.privilege.showAll = LoggedUser.can(UsecaseList.SHOW_ALL_BRANCHSECTIONS);
    this.privilege.showOne = LoggedUser.can(UsecaseList.SHOW_BRANCHSECTION_DETAILS);
    this.privilege.delete = LoggedUser.can(UsecaseList.DELETE_BRANCHSECTION);
    this.privilege.update = LoggedUser.can(UsecaseList.UPDATE_BRANCHSECTION);
  }

  discardChanges(): void{
    this.form.markAsPristine();
    this.form.markAsUntouched();
    this.setValues();
  }

  setValues(): void{
    if (this.nameField.pristine) {
      this.nameField.setValue(this.branchsection.name);
    }
    if (this.branchsectionstatusField.pristine) {
      this.branchsectionstatusField.setValue(this.branchsection.branchsectionstatus.id);
    }
    if (this.branchsectiontypeField.pristine) {
      this.branchsectiontypeField.setValue(this.branchsection.branchsectiontype.id);
    }
    if (this.branchField.pristine) {
      this.branchField.setValue(this.branchsection.branch.id);
    }
    if (this.photoField.pristine) {
      if (this.branchsection.photo) { this.photoField.setValue([this.branchsection.photo]); }
      else { this.photoField.setValue([]); }
    }
    if (this.areaplanField.pristine) {
      if (this.branchsection.areaplan) { this.areaplanField.setValue([this.branchsection.areaplan]); }
      else { this.areaplanField.setValue([]); }
    }
    if (this.descriptionField.pristine) {
      this.descriptionField.setValue(this.branchsection.description);
    }
}

  async submit(): Promise<void> {
    this.photoField.updateValueAndValidity();
    this.photoField.markAsTouched();
    this.areaplanField.updateValueAndValidity();
    this.areaplanField.markAsTouched();
    if (this.form.invalid) { return; }

    const newbranchsection: Branchsection = new Branchsection();
    newbranchsection.name = this.nameField.value;
    newbranchsection.branchsectionstatus = this.branchsectionstatusField.value;
    newbranchsection.branchsectiontype = this.branchsectiontypeField.value;
    newbranchsection.branch = this.branchField.value;
    const photoIds = this.photoField.value;
    if (photoIds !== null && photoIds !== []){
      newbranchsection.photo = photoIds[0];
    }else{
      newbranchsection.photo = null;
    }
    const areaplanIds = this.areaplanField.value;
    if (areaplanIds !== null && areaplanIds !== []){
      newbranchsection.areaplan = areaplanIds[0];
    }else{
      newbranchsection.areaplan = null;
    }
    newbranchsection.description = this.descriptionField.value;
    try{
      const resourceLink: ResourceLink = await this.branchsectionService.update(this.selectedId, newbranchsection);
      if (this.privilege.showOne) {
        await this.router.navigateByUrl('/branchsections/' + resourceLink.id);
      } else {
        await this.router.navigateByUrl('/branchsections');
      }
    }catch (e) {
      switch (e.status) {
        case 401: break;
        case 403: this.snackBar.open(e.error.message, null, {duration: 2000}); break;
        case 400:
          const msg = JSON.parse(e.error.message);
          let knownError = false;
          if (msg.name) { this.nameField.setErrors({server: msg.name}); knownError = true; }
          if (msg.branchsectionstatus) { this.branchsectionstatusField.setErrors({server: msg.branchsectionstatus}); knownError = true; }
          if (msg.branchsectiontype) { this.branchsectiontypeField.setErrors({server: msg.branchsectiontype}); knownError = true; }
          if (msg.branch) { this.branchField.setErrors({server: msg.branch}); knownError = true; }
          if (msg.photo) { this.photoField.setErrors({server: msg.photo}); knownError = true; }
          if (msg.areaplan) { this.areaplanField.setErrors({server: msg.areaplan}); knownError = true; }
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
