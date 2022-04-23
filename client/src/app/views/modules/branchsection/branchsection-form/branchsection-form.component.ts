import { Component, OnInit } from '@angular/core';
import {ResourceLink} from '../../../../shared/resource-link';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Router} from '@angular/router';
import {AbstractComponent} from '../../../../shared/abstract-component';
import {LoggedUser} from '../../../../shared/logged-user';
import {UsecaseList} from '../../../../usecase-list';
import {PageRequest} from '../../../../shared/page-request';
import {Branchsection} from '../../../../entities/branchsection';
import {BranchsectionService} from '../../../../services/branchsection.service';
import {Branch} from '../../../../entities/branch';
import {BranchService} from '../../../../services/branch.service';
import {Branchsectiontype} from '../../../../entities/branchsectiontype';
import {BranchsectiontypeService} from '../../../../services/branchsectiontype.service';

@Component({
  selector: 'app-branchsection-form',
  templateUrl: './branchsection-form.component.html',
  styleUrls: ['./branchsection-form.component.scss']
})
export class BranchsectionFormComponent extends AbstractComponent implements OnInit {

  branchsectiontypes: Branchsectiontype[] = [];
  branches: Branch[] = [];

  form = new FormGroup({
    name: new FormControl(null, [
      Validators.required,
      Validators.minLength(2),
      Validators.maxLength(45),
      Validators.pattern('^[a-zA-Z ]{3,}$'),
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
    private branchsectiontypeService: BranchsectiontypeService,
    private branchService: BranchService,
    private branchsectionService: BranchsectionService,
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
  }

  updatePrivileges(): any {
    this.privilege.add = LoggedUser.can(UsecaseList.ADD_BRANCHSECTION);
    this.privilege.showAll = LoggedUser.can(UsecaseList.SHOW_ALL_BRANCHSECTIONS);
    this.privilege.showOne = LoggedUser.can(UsecaseList.SHOW_BRANCHSECTION_DETAILS);
    this.privilege.delete = LoggedUser.can(UsecaseList.DELETE_BRANCHSECTION);
    this.privilege.update = LoggedUser.can(UsecaseList.UPDATE_BRANCHSECTION);
  }

  async submit(): Promise<void> {
    this.photoField.updateValueAndValidity();
    this.photoField.markAsTouched();
    this.areaplanField.updateValueAndValidity();
    this.areaplanField.markAsTouched();
    if (this.form.invalid) { return; }

    const branchsection: Branchsection = new Branchsection();
    branchsection.name = this.nameField.value;
    branchsection.branchsectiontype = this.branchsectiontypeField.value;
    branchsection.branch = this.branchField.value;
    const photoIds = this.photoField.value;
    if (photoIds !== null && photoIds !== []){
      branchsection.photo = photoIds[0];
    }else{
      branchsection.photo = null;
    }
    const areaplanIds = this.areaplanField.value;
    if (areaplanIds !== null && areaplanIds !== []){
      branchsection.areaplan = areaplanIds[0];
    }else{
      branchsection.areaplan = null;
    }
    branchsection.description = this.descriptionField.value;
    try{
      const resourceLink: ResourceLink = await this.branchsectionService.add(branchsection);
      if (this.privilege.showOne) {
        await this.router.navigateByUrl('/branchsections/' + resourceLink.id);
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
