import { Component, OnInit } from '@angular/core';
import {ResourceLink} from '../../../../shared/resource-link';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Router} from '@angular/router';
import {AbstractComponent} from '../../../../shared/abstract-component';
import {LoggedUser} from '../../../../shared/logged-user';
import {UsecaseList} from '../../../../usecase-list';
import {PageRequest} from '../../../../shared/page-request';
import {Branch} from '../../../../entities/branch';
import {BranchService} from '../../../../services/branch.service';
import {Branchbranchplan} from '../../../../entities/branchbranchplan';

@Component({
  selector: 'app-branch-form',
  templateUrl: './branch-form.component.html',
  styleUrls: ['./branch-form.component.scss']
})
export class BranchFormComponent extends AbstractComponent implements OnInit {


  form = new FormGroup({
    city: new FormControl(null, [
      Validators.required,
      Validators.minLength(2),
      Validators.maxLength(45),
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
    photo: new FormControl(),
    maplink: new FormControl(null, [
      Validators.required,
      Validators.minLength(4),
    ]),
    email: new FormControl(null, [
      Validators.minLength(5),
      Validators.maxLength(255),
      Validators.pattern('^[a-zA-Z0-9]{1,}[@][a-zA-Z0-9]{1,}[.][a-zA-Z0-9]{1,}$'),
    ]),
    address: new FormControl(null, [
      Validators.required,
      Validators.minLength(4),
      Validators.maxLength(65535),
    ]),
    branchplan: new FormControl(),
    description: new FormControl(null, [
      Validators.minLength(null),
      Validators.maxLength(65535),
    ]),
  });

  get cityField(): FormControl{
    return this.form.controls.city as FormControl;
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

  get photoField(): FormControl{
    return this.form.controls.photo as FormControl;
  }

  get maplinkField(): FormControl{
    return this.form.controls.maplink as FormControl;
  }

  get emailField(): FormControl{
    return this.form.controls.email as FormControl;
  }

  get addressField(): FormControl{
    return this.form.controls.address as FormControl;
  }

  get branchplanField(): FormControl{
    return this.form.controls.branchplan as FormControl;
  }

  get descriptionField(): FormControl{
    return this.form.controls.description as FormControl;
  }

  constructor(
    private branchService: BranchService,
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

  }

  updatePrivileges(): any {
    this.privilege.add = LoggedUser.can(UsecaseList.ADD_BRANCH);
    this.privilege.showAll = LoggedUser.can(UsecaseList.SHOW_ALL_BRANCHES);
    this.privilege.showOne = LoggedUser.can(UsecaseList.SHOW_BRANCH_DETAILS);
    this.privilege.delete = LoggedUser.can(UsecaseList.DELETE_BRANCH);
    this.privilege.update = LoggedUser.can(UsecaseList.UPDATE_BRANCH);
  }

  async submit(): Promise<void> {
    this.photoField.updateValueAndValidity();
    this.photoField.markAsTouched();
    this.branchplanField.updateValueAndValidity();
    this.branchplanField.markAsTouched();
    if (this.form.invalid) { return; }

    const branch: Branch = new Branch();
    branch.city = this.cityField.value;
    branch.primarycontact = this.primarycontactField.value;
    branch.secondarycontact = this.secondarycontactField.value;
    branch.fax = this.faxField.value;
    const photoIds = this.photoField.value;
    if (photoIds !== null && photoIds !== []){
      branch.photo = photoIds[0];
    }else{
      branch.photo = null;
    }
    branch.maplink = this.maplinkField.value;
    branch.email = this.emailField.value;
    branch.address = this.addressField.value;
    const branchplanIds = this.branchplanField.value;
    branch.branchbranchplanList = [];
    if (branchplanIds !== null){
      for (const id of branchplanIds){
        const branchbranchplan = new Branchbranchplan();
        branchbranchplan.branchplan = id;
        branch.branchbranchplanList.push(branchbranchplan);
      }
    }
    branch.description = this.descriptionField.value;
    try{
      const resourceLink: ResourceLink = await this.branchService.add(branch);
      if (this.privilege.showOne) {
        await this.router.navigateByUrl('/branches/' + resourceLink.id);
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
          if (msg.city) { this.cityField.setErrors({server: msg.city}); knownError = true; }
          if (msg.primarycontact) { this.primarycontactField.setErrors({server: msg.primarycontact}); knownError = true; }
          if (msg.secondarycontact) { this.secondarycontactField.setErrors({server: msg.secondarycontact}); knownError = true; }
          if (msg.fax) { this.faxField.setErrors({server: msg.fax}); knownError = true; }
          if (msg.photo) { this.photoField.setErrors({server: msg.photo}); knownError = true; }
          if (msg.maplink) { this.maplinkField.setErrors({server: msg.maplink}); knownError = true; }
          if (msg.email) { this.emailField.setErrors({server: msg.email}); knownError = true; }
          if (msg.address) { this.addressField.setErrors({server: msg.address}); knownError = true; }
          if (msg.branchplan) { this.branchplanField.setErrors({server: msg.branchplan}); knownError = true; }
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
