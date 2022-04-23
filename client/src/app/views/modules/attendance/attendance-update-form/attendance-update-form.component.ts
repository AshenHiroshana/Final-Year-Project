import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {MatSnackBar} from '@angular/material/snack-bar';
import {LoggedUser} from '../../../../shared/logged-user';
import {UsecaseList} from '../../../../usecase-list';
import {ResourceLink} from '../../../../shared/resource-link';
import {AbstractComponent} from '../../../../shared/abstract-component';
import {PageRequest} from '../../../../shared/page-request';
import {Attendance} from '../../../../entities/attendance';
import {AttendanceService} from '../../../../services/attendance.service';
import {Branch} from '../../../../entities/branch';
import {Employee} from '../../../../entities/employee';
import {DateHelper} from '../../../../shared/date-helper';
import {BranchService} from '../../../../services/branch.service';
import {EmployeeService} from '../../../../services/employee.service';
import {Observable} from "rxjs";
import {map, startWith} from "rxjs/operators";

@Component({
  selector: 'app-attendance-update-form',
  templateUrl: './attendance-update-form.component.html',
  styleUrls: ['./attendance-update-form.component.scss']
})
export class AttendanceUpdateFormComponent extends AbstractComponent implements OnInit {

  selectedId: number;
  attendance: Attendance;
  filteredOptions: Observable<Employee[]>;
  branches: Branch[] = [];
  employees: Employee[] = [];

  form = new FormGroup({
    branch: new FormControl(null, [
      Validators.required,
    ]),
    employee: new FormControl(null, [
      Validators.required,
    ]),
    date: new FormControl(null, [
      Validators.required,
    ]),
    in: new FormControl(null, [
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
    private route: ActivatedRoute,
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
    this.route.paramMap.subscribe( async (params) => {
      this.selectedId =  + params.get('id');
      await this.loadData();
      this.refreshData();
    });
  }

  async loadData(): Promise<any>{

    this.updatePrivileges();
    if (!this.privilege.update) { return; }

    this.branchService.getAllBasic(new PageRequest()).then((branchDataPage) => {
      this.branches = branchDataPage.content;
    }).catch((e) => {
      console.log(e);
      this.snackBar.open('Something is wrong', null, {duration: 2000});
    });
    this.employeeService.getAll(new PageRequest()).then((employeeDataPage) => {
      this.employees = employeeDataPage.content;
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
    this.attendance = await this.attendanceService.get(this.selectedId);
    this.setValues();
  }

  updatePrivileges(): any {
    this.privilege.add = LoggedUser.can(UsecaseList.ADD_ATTENDANCE);
    this.privilege.showAll = LoggedUser.can(UsecaseList.SHOW_ALL_ATTENDANCES);
    this.privilege.showOne = LoggedUser.can(UsecaseList.SHOW_ATTENDANCE_DETAILS);
    this.privilege.delete = LoggedUser.can(UsecaseList.DELETE_ATTENDANCE);
    this.privilege.update = LoggedUser.can(UsecaseList.UPDATE_ATTENDANCE);
  }

  discardChanges(): void{
    this.form.markAsPristine();
    this.form.markAsUntouched();
    this.setValues();
  }

  setValues(): void{
    if (this.branchField.pristine) {
      this.branchField.setValue(this.attendance.branch.id);
    }
    if (this.employeeField.pristine) {
      this.employeeField.setValue(this.attendance.employee.id);
    }
    if (this.employeeField.pristine) {
      this.searchemployeeField.setValue(this.attendance.employee.code);
    }
    if (this.dateField.pristine) {
      this.dateField.setValue(this.attendance.date);
    }
    if (this.inField.pristine) {
      this.inField.setValue(this.attendance.intime);
    }
    if (this.outField.pristine) {
      this.outField.setValue(this.attendance.outtime);
    }
}

  async submit(): Promise<void> {
    if (this.form.invalid) { return; }

    const newattendance: Attendance = new Attendance();
    newattendance.branch = this.branchField.value;
    newattendance.employee = this.employeeField.value;
    newattendance.date = DateHelper.getDateAsString(this.dateField.value);
    newattendance.intime = this.inField.value;
    newattendance.outtime = this.outField.value;
    try{
      const resourceLink: ResourceLink = await this.attendanceService.update(this.selectedId, newattendance);
      if (this.privilege.showOne) {
        await this.router.navigateByUrl('/attendances/' + resourceLink.id);
      } else {
        await this.router.navigateByUrl('/attendances');
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
