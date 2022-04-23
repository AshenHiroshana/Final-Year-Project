import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {MatSnackBar} from '@angular/material/snack-bar';
import {LoggedUser} from '../../../../shared/logged-user';
import {UsecaseList} from '../../../../usecase-list';
import {ResourceLink} from '../../../../shared/resource-link';
import {AbstractComponent} from '../../../../shared/abstract-component';
import {PageRequest} from '../../../../shared/page-request';
import {Branch} from '../../../../entities/branch';
import {BranchService} from '../../../../services/branch.service';
import {Branchstatus} from '../../../../entities/branchstatus';
import {Branchbranchplan} from '../../../../entities/branchbranchplan';
import {BranchstatusService} from '../../../../services/branchstatus.service';

@Component({
  selector: 'app-branch-update-form',
  templateUrl: './branch-update-form.component.html',
  styleUrls: ['./branch-update-form.component.scss']
})
export class BranchUpdateFormComponent extends AbstractComponent implements OnInit {

  selectedId: number;
  branch: Branch;

  branchstatuses: Branchstatus[] = [];

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
    branchstatus: new FormControl('1', [
      Validators.required,
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

  get branchstatusField(): FormControl{
    return this.form.controls.branchstatus as FormControl;
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
    private branchstatusService: BranchstatusService,
    private branchService: BranchService,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar,
    private router: Router
  ) {
    super();
  }

  ngOnInit(): void {
    this.branchstatusService.getAll().then((branchstatuses) => {
      this.branchstatuses = branchstatuses;
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

    this.branch = await this.branchService.get(this.selectedId);
    this.setValues();
  }

  updatePrivileges(): any {
    this.privilege.add = LoggedUser.can(UsecaseList.ADD_BRANCH);
    this.privilege.showAll = LoggedUser.can(UsecaseList.SHOW_ALL_BRANCHES);
    this.privilege.showOne = LoggedUser.can(UsecaseList.SHOW_BRANCH_DETAILS);
    this.privilege.delete = LoggedUser.can(UsecaseList.DELETE_BRANCH);
    this.privilege.update = LoggedUser.can(UsecaseList.UPDATE_BRANCH);
  }

  discardChanges(): void{
    this.form.markAsPristine();
    this.form.markAsUntouched();
    this.setValues();
  }

  setValues(): void{
    if (this.cityField.pristine) {
      this.cityField.setValue(this.branch.city);
    }
    if (this.primarycontactField.pristine) {
      this.primarycontactField.setValue(this.branch.primarycontact);
    }
    if (this.secondarycontactField.pristine) {
      this.secondarycontactField.setValue(this.branch.secondarycontact);
    }
    if (this.faxField.pristine) {
      this.faxField.setValue(this.branch.fax);
    }
    if (this.photoField.pristine) {
      if (this.branch.photo) { this.photoField.setValue([this.branch.photo]); }
      else { this.photoField.setValue([]); }
    }
    if (this.maplinkField.pristine) {
      this.maplinkField.setValue(this.branch.maplink);
    }
    if (this.emailField.pristine) {
      this.emailField.setValue(this.branch.email);
    }
    if (this.branchstatusField.pristine) {
      this.branchstatusField.setValue(this.branch.branchstatus.id);
    }
    if (this.addressField.pristine) {
      this.addressField.setValue(this.branch.address);
    }
    if (this.branchplanField.pristine) {
      const branchplanIds = [];
      for (const branchbranchplan of this.branch.branchbranchplanList){
        branchplanIds.push(branchbranchplan.branchplan);
      }
      this.branchplanField.setValue(branchplanIds);
    }
    if (this.descriptionField.pristine) {
      this.descriptionField.setValue(this.branch.description);
    }
}

  async submit(): Promise<void> {
    this.photoField.updateValueAndValidity();
    this.photoField.markAsTouched();
    this.branchplanField.updateValueAndValidity();
    this.branchplanField.markAsTouched();
    if (this.form.invalid) { return; }

    const newbranch: Branch = new Branch();
    newbranch.city = this.cityField.value;
    newbranch.primarycontact = this.primarycontactField.value;
    newbranch.secondarycontact = this.secondarycontactField.value;
    newbranch.fax = this.faxField.value;
    const photoIds = this.photoField.value;
    if (photoIds !== null && photoIds !== []){
      newbranch.photo = photoIds[0];
    }else{
      newbranch.photo = null;
    }
    newbranch.maplink = this.maplinkField.value;
    newbranch.email = this.emailField.value;
    newbranch.branchstatus = this.branchstatusField.value;
    newbranch.address = this.addressField.value;
    const branchplanIds = this.branchplanField.value;
    newbranch.branchbranchplanList = [];
    if (branchplanIds !== null){
      for (const id of branchplanIds){
        const newbranchbranchplan = new Branchbranchplan();
        newbranchbranchplan.branchplan = id;
        newbranch.branchbranchplanList.push(newbranchbranchplan);
      }
    }
    newbranch.description = this.descriptionField.value;
    try{
      const resourceLink: ResourceLink = await this.branchService.update(this.selectedId, newbranch);
      if (this.privilege.showOne) {
        await this.router.navigateByUrl('/branches/' + resourceLink.id);
      } else {
        await this.router.navigateByUrl('/branches');
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
          if (msg.branchstatus) { this.branchstatusField.setErrors({server: msg.branchstatus}); knownError = true; }
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
