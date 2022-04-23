import { Component, OnInit } from '@angular/core';
import {ResourceLink} from '../../../../shared/resource-link';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Router} from '@angular/router';
import {AbstractComponent} from '../../../../shared/abstract-component';
import {LoggedUser} from '../../../../shared/logged-user';
import {UsecaseList} from '../../../../usecase-list';
import {PageRequest} from '../../../../shared/page-request';
import {Branchrole} from '../../../../entities/branchrole';
import {BranchroleService} from '../../../../services/branchrole.service';
import {Branch} from '../../../../entities/branch';
import {Department} from '../../../../entities/department';
import {BranchService} from '../../../../services/branch.service';
import {DepartmentService} from '../../../../services/department.service';

@Component({
  selector: 'app-branchrole-form',
  templateUrl: './branchrole-form.component.html',
  styleUrls: ['./branchrole-form.component.scss']
})
export class BranchroleFormComponent extends AbstractComponent implements OnInit {

  branches: Branch[] = [];
  departments: Department[] = [];

  form = new FormGroup({
    branch: new FormControl(null, [
      Validators.required,
    ]),
    name: new FormControl(null, [
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(255),
      Validators.pattern('^[a-zA-Z ]{3,}$'),
    ]),
    min: new FormControl(null, [
      Validators.required,
      Validators.min(-2147483648),
      Validators.max(2147483647),
      Validators.pattern('^([0-9]*)$'),
    ]),
    max: new FormControl(null, [
      Validators.required,
      Validators.min(-2147483648),
      Validators.max(2147483647),
      Validators.pattern('^([0-9]*)$'),
    ]),
    allowance: new FormControl(null, [
      Validators.min(0),
      Validators.max(10000000),
      Validators.pattern('^([0-9]{1,8}([.][0-9]{1,2})?)$'),
    ]),
    department: new FormControl(null, [
      Validators.required,
    ]),
  });

  get branchField(): FormControl{
    return this.form.controls.branch as FormControl;
  }

  get nameField(): FormControl{
    return this.form.controls.name as FormControl;
  }

  get minField(): FormControl{
    return this.form.controls.min as FormControl;
  }

  get maxField(): FormControl{
    return this.form.controls.max as FormControl;
  }

  get allowanceField(): FormControl{
    return this.form.controls.allowance as FormControl;
  }

  get departmentField(): FormControl{
    return this.form.controls.department as FormControl;
  }

  constructor(
    private branchService: BranchService,
    private departmentService: DepartmentService,
    private branchroleService: BranchroleService,
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

    this.branchService.getAllBasic(new PageRequest()).then((branchDataPage) => {
      this.branches = branchDataPage.content;
    }).catch((e) => {
      console.log(e);
      this.snackBar.open('Something is wrong', null, {duration: 2000});
    });
    this.departmentService.getAll().then((departments) => {
      this.departments = departments;
    }).catch((e) => {
      console.log(e);
      this.snackBar.open('Something is wrong', null, {duration: 2000});
    });
  }

  updatePrivileges(): any {
    this.privilege.add = LoggedUser.can(UsecaseList.ADD_BRANCHROLE);
    this.privilege.showAll = LoggedUser.can(UsecaseList.SHOW_ALL_BRANCHROLES);
    this.privilege.showOne = LoggedUser.can(UsecaseList.SHOW_BRANCHROLE_DETAILS);
    this.privilege.delete = LoggedUser.can(UsecaseList.DELETE_BRANCHROLE);
    this.privilege.update = LoggedUser.can(UsecaseList.UPDATE_BRANCHROLE);
  }

  async submit(): Promise<void> {
    if (this.form.invalid) { return; }

    const branchrole: Branchrole = new Branchrole();
    branchrole.branch = this.branchField.value;
    branchrole.name = this.nameField.value;
    branchrole.min = this.minField.value;
    branchrole.max = this.maxField.value;
    branchrole.allowance = this.allowanceField.value;
    branchrole.department = this.departmentField.value;
    try{
      const resourceLink: ResourceLink = await this.branchroleService.add(branchrole);
      if (this.privilege.showOne) {
        await this.router.navigateByUrl('/branchroles/' + resourceLink.id);
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
          if (msg.branch) { this.branchField.setErrors({server: msg.branch}); knownError = true; }
          if (msg.name) { this.nameField.setErrors({server: msg.name}); knownError = true; }
          if (msg.min) { this.minField.setErrors({server: msg.min}); knownError = true; }
          if (msg.max) { this.maxField.setErrors({server: msg.max}); knownError = true; }
          if (msg.allowance) { this.allowanceField.setErrors({server: msg.allowance}); knownError = true; }
          if (msg.department) { this.departmentField.setErrors({server: msg.department}); knownError = true; }
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
