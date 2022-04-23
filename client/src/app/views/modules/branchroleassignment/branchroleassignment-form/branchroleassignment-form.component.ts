import { Component, OnInit } from '@angular/core';
import {ResourceLink} from '../../../../shared/resource-link';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Router} from '@angular/router';
import {AbstractComponent} from '../../../../shared/abstract-component';
import {LoggedUser} from '../../../../shared/logged-user';
import {UsecaseList} from '../../../../usecase-list';
import {PageRequest} from '../../../../shared/page-request';
import {Branchroleassignment} from '../../../../entities/branchroleassignment';
import {BranchroleassignmentService} from '../../../../services/branchroleassignment.service';
import {Branch} from '../../../../entities/branch';
import {Employee} from '../../../../entities/employee';
import {DateHelper} from '../../../../shared/date-helper';
import {Branchrole} from '../../../../entities/branchrole';
import {BranchService} from '../../../../services/branch.service';
import {EmployeeService} from '../../../../services/employee.service';
import {BranchroleService} from '../../../../services/branchrole.service';

@Component({
  selector: 'app-branchroleassignment-form',
  templateUrl: './branchroleassignment-form.component.html',
  styleUrls: ['./branchroleassignment-form.component.scss']
})
export class BranchroleassignmentFormComponent extends AbstractComponent implements OnInit {

  branches: Branch[] = [];
  branchroles: Branchrole[] = [];
  employees: Employee[] = [];

  form = new FormGroup({
    branch: new FormControl(null, [
      Validators.required,
    ]),
    branchrole: new FormControl(null, [
      Validators.required,
    ]),
    employee: new FormControl(null, [
      Validators.required,
    ]),
    dogrant: new FormControl(null, [
      Validators.required,
    ]),
    dorevoke: new FormControl(null, [
    ]),
    allowance: new FormControl(null, [
      Validators.min(0),
      Validators.max(10000000),
      Validators.pattern('^([0-9]{1,8}([.][0-9]{1,2})?)$'),
    ]),
  });

  get branchField(): FormControl{
    return this.form.controls.branch as FormControl;
  }

  get branchroleField(): FormControl{
    return this.form.controls.branchrole as FormControl;
  }

  get employeeField(): FormControl{
    return this.form.controls.employee as FormControl;
  }

  get dograntField(): FormControl{
    return this.form.controls.dogrant as FormControl;
  }

  get dorevokeField(): FormControl{
    return this.form.controls.dorevoke as FormControl;
  }

  get allowanceField(): FormControl{
    return this.form.controls.allowance as FormControl;
  }

  constructor(
    private branchService: BranchService,
    private branchroleService: BranchroleService,
    private employeeService: EmployeeService,
    private branchroleassignmentService: BranchroleassignmentService,
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
    if (this.branchField.value){
      this.branchroleService.getAllByBranch(this.branchField.value).then((branchroleDataPage) => {
        this.branchroles = branchroleDataPage;
      }).catch((e) => {
        console.log(e);
        this.snackBar.open('Something is wrong', null, {duration: 2000});
      });
    }
    if (this.branchField.value && this.branchroleField.value){
      const branchrole: Branchrole = await this.branchroleService.get(this.branchroleField.value);
      this.employeeService.getAllByBranchAndDepartment(this.branchField.value, branchrole.department.id).then((employeeDataPage) => {
        this.employees = employeeDataPage;
      }).catch((e) => {
        console.log(e);
        this.snackBar.open('Something is wrong', null, {duration: 2000});
      });
    }
  }

  updatePrivileges(): any {
    this.privilege.add = LoggedUser.can(UsecaseList.ADD_BRANCHROLEASSIGNMENT);
    this.privilege.showAll = LoggedUser.can(UsecaseList.SHOW_ALL_BRANCHROLEASSIGNMENTS);
    this.privilege.showOne = LoggedUser.can(UsecaseList.SHOW_BRANCHROLEASSIGNMENT_DETAILS);
    this.privilege.delete = LoggedUser.can(UsecaseList.DELETE_BRANCHROLEASSIGNMENT);
    this.privilege.update = LoggedUser.can(UsecaseList.UPDATE_BRANCHROLEASSIGNMENT);
  }

  async submit(): Promise<void> {
    if (this.form.invalid) { return; }

    const branchroleassignment: Branchroleassignment = new Branchroleassignment();
    branchroleassignment.branch = this.branchField.value;
    branchroleassignment.branchrole = this.branchroleField.value;
    branchroleassignment.employee = this.employeeField.value;
    branchroleassignment.dogrant = DateHelper.getDateAsString(this.dograntField.value);
    branchroleassignment.dorevoke = this.dorevokeField.value ? DateHelper.getDateAsString(this.dorevokeField.value) : null;
    branchroleassignment.allowance = this.allowanceField.value;
    try{
      const resourceLink: ResourceLink = await this.branchroleassignmentService.add(branchroleassignment);
      if (this.privilege.showOne) {
        await this.router.navigateByUrl('/branchroleassignments/' + resourceLink.id);
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
          if (msg.branchrole) { this.branchroleField.setErrors({server: msg.branchrole}); knownError = true; }
          if (msg.employee) { this.employeeField.setErrors({server: msg.employee}); knownError = true; }
          if (msg.dogrant) { this.dograntField.setErrors({server: msg.dogrant}); knownError = true; }
          if (msg.dorevoke) { this.dorevokeField.setErrors({server: msg.dorevoke}); knownError = true; }
          if (msg.allowance) { this.allowanceField.setErrors({server: msg.allowance}); knownError = true; }
          if (!knownError) {
            this.snackBar.open('Validation Error', null, {duration: 2000});
          }
          break;
        default:
          this.snackBar.open('Something is wrong', null, {duration: 2000});
      }
    }

  }
  dateVaidation(): any {
    const date = new Date();
    return date;
  }
}
