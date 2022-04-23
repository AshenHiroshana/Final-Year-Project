import { Component, OnInit } from '@angular/core';
import {ResourceLink} from '../../../../shared/resource-link';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Router} from '@angular/router';
import {AbstractComponent} from '../../../../shared/abstract-component';
import {LoggedUser} from '../../../../shared/logged-user';
import {UsecaseList} from '../../../../usecase-list';
import {PageRequest} from '../../../../shared/page-request';
import {Designation} from '../../../../entities/designation';
import {DesignationService} from '../../../../services/designation.service';
import {Department} from '../../../../entities/department';
import {DepartmentService} from '../../../../services/department.service';

@Component({
  selector: 'app-designation-form',
  templateUrl: './designation-form.component.html',
  styleUrls: ['./designation-form.component.scss']
})
export class DesignationFormComponent extends AbstractComponent implements OnInit {

  departments: Department[] = [];

  form = new FormGroup({
    name: new FormControl(null, [
      Validators.required,
      Validators.minLength(null),
      Validators.maxLength(255),
      Validators.pattern('^[a-zA-Z ]{3,}$'),
    ]),
    department: new FormControl(null, [
      Validators.required,
    ]),
    basicsalary: new FormControl(null, [
      Validators.required,
      Validators.min(0),
      Validators.max(10000000),
      Validators.pattern('^([0-9]{1,8}([.][0-9]{1,2})?)$'),
    ]),
  });

  get nameField(): FormControl{
    return this.form.controls.name as FormControl;
  }

  get departmentField(): FormControl{
    return this.form.controls.department as FormControl;
  }

  get basicsalaryField(): FormControl{
    return this.form.controls.basicsalary as FormControl;
  }

  constructor(
    private departmentService: DepartmentService,
    private designationService: DesignationService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {
    super();
  }

  ngOnInit(): void {
    this.departmentService.getAll().then((departments) => {
      this.departments = departments;
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
    this.privilege.add = LoggedUser.can(UsecaseList.ADD_DESIGNATION);
    this.privilege.showAll = LoggedUser.can(UsecaseList.SHOW_ALL_DESIGNATIONS);
    this.privilege.showOne = LoggedUser.can(UsecaseList.SHOW_DESIGNATION_DETAILS);
    this.privilege.delete = LoggedUser.can(UsecaseList.DELETE_DESIGNATION);
    this.privilege.update = LoggedUser.can(UsecaseList.UPDATE_DESIGNATION);
  }

  async submit(): Promise<void> {
    if (this.form.invalid) { return; }

    const designation: Designation = new Designation();
    designation.name = this.nameField.value;
    designation.department = this.departmentField.value;
    designation.basicsalary = this.basicsalaryField.value;
    try{
      const resourceLink: ResourceLink = await this.designationService.add(designation);
      if (this.privilege.showOne) {
        await this.router.navigateByUrl('/designations/' + resourceLink.id);
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
          if (msg.department) { this.departmentField.setErrors({server: msg.department}); knownError = true; }
          if (msg.basicsalary) { this.basicsalaryField.setErrors({server: msg.basicsalary}); knownError = true; }
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
