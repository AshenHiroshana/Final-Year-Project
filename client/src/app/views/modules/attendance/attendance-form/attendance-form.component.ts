import { Component, OnInit } from '@angular/core';
import {ResourceLink} from '../../../../shared/resource-link';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Router} from '@angular/router';
import {AbstractComponent} from '../../../../shared/abstract-component';
import {LoggedUser} from '../../../../shared/logged-user';
import {UsecaseList} from '../../../../usecase-list';
import {PageRequest} from '../../../../shared/page-request';
import {Attendance} from '../../../../entities/attendance';
import {AttendanceService} from '../../../../services/attendance.service';
import {Branch} from '../../../../entities/branch';
import {Employee} from '../../../../entities/employee';
import {DateHelper} from '../../../../shared/date-helper';
import {BranchService} from '../../../../services/branch.service';
import {EmployeeService} from '../../../../services/employee.service';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import {Time} from '@angular/common';

@Component({
  selector: 'app-attendance-form',
  templateUrl: './attendance-form.component.html',
  styleUrls: ['./attendance-form.component.scss']
})
export class AttendanceFormComponent extends AbstractComponent implements OnInit {

  branches: Branch[] = [];
  employees: Employee[] = [];
  emp: Employee;
  filteredOptions: Observable<Employee[]>;
  form = new FormGroup({
    branch: new FormControl(null, [
      Validators.required,
    ]),
    employee: new FormControl(null, [
      Validators.required,
    ]),
    date: new FormControl(),
    in: new FormControl(null, [
      Validators.required,
    ]),
    out: new FormControl(null, [
    ]),
    searchemployee: new FormControl(),
  });

  get branchField(): FormControl{
    return this.form.controls.branch as FormControl;
  }

  get employeeField(): FormControl{
    return this.form.controls.employee as FormControl;
  }

  get dateField(): FormControl{
    return this.form.controls.date as FormControl;
  }

  get inField(): FormControl{
    return this.form.controls.in as FormControl;
  }

  get outField(): FormControl{
    return this.form.controls.out as FormControl;
  }
  get searchemployeeField(): FormControl{
    return this.form.controls.searchemployee as FormControl;
  }

  constructor(
    private branchService: BranchService,
    private employeeService: EmployeeService,
    private attendanceService: AttendanceService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {
    super();
    this.filteredOptions = this.searchemployeeField.valueChanges
      .pipe(
        startWith(''),
        map(employee => employee ? this._filterEmployee(employee) : this.employees.slice())
      );
  }

  private _filterEmployee(value: string): Employee[] {
    const filterValue = value.toLowerCase();
    return this.employees.filter(employee => employee.code.toLowerCase().indexOf(filterValue) === 0);
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
      this.employeeService.getAllByBranch(this.branchField.value).then((employeeDataPage) => {
        this.employees = employeeDataPage;
      }).catch((e) => {
        console.log(e);
        this.snackBar.open('Something is wrong', null, {duration: 2000});
      });
    }
  }

  updatePrivileges(): any {
    this.privilege.add = LoggedUser.can(UsecaseList.ADD_ATTENDANCE);
    this.privilege.showAll = LoggedUser.can(UsecaseList.SHOW_ALL_ATTENDANCES);
    this.privilege.showOne = LoggedUser.can(UsecaseList.SHOW_ATTENDANCE_DETAILS);
    this.privilege.delete = LoggedUser.can(UsecaseList.DELETE_ATTENDANCE);
    this.privilege.update = LoggedUser.can(UsecaseList.UPDATE_ATTENDANCE);
  }

  async submit(): Promise<void> {
    if (this.form.invalid) { return; }

    const attendance: Attendance = new Attendance();
    attendance.branch = this.branchField.value;
    this.emp = this.employeeField.value;
    attendance.employee = this.emp;
    attendance.intime = this.inField.value;
    attendance.outtime = this.outField.value;
    try{
      const resourceLink: ResourceLink = await this.attendanceService.add(attendance);
      if (this.privilege.showOne) {
        await this.router.navigateByUrl('/attendances/' + resourceLink.id);
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
          if (msg.employee) { this.employeeField.setErrors({server: msg.employee}); knownError = true; }
          if (msg.date) { this.dateField.setErrors({server: msg.date}); knownError = true; }
          if (msg.in) { this.inField.setErrors({server: msg.in}); knownError = true; }
          if (msg.out) { this.outField.setErrors({server: msg.out}); knownError = true; }
          if (!knownError) {
            this.snackBar.open('Validation Error', null, {duration: 2000});
          }
          break;
        default:
          this.snackBar.open('Something is wrong', null, {duration: 2000});
      }
    }

  }

  setSearchValue(option: any): void{
    console.log(option);
    this.employeeField.patchValue(option);
    // this.searchemployeeField.disable();
  }

  timeValidation(): void {
    console.log(this.inField.value);
    console.log(this.outField.value);
    const intime = this.inField.value.split(':');
    const intimeHours = intime[0];
    const intimeMinutes = intime[1];
    const outtime = this.outField.value.split(':');
    const outtimeHours = outtime[0];
    const outtimeMinutes = outtime[1];


    if (intimeHours < outtimeHours){
      console.log('ok');
    }else if (intimeHours === outtimeHours){
      if (intimeMinutes >= outtimeMinutes){
        console.log('nok');
        this.outField.setErrors({incorrect: true});
      }else {
        console.log('ok');
      }
    }else {
      console.log('not ok');
      this.outField.setErrors({incorrect: true});
    }

  }
}
