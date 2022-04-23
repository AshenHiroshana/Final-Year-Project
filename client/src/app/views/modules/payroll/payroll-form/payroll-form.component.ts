import { Component, OnInit } from '@angular/core';
import {ResourceLink} from '../../../../shared/resource-link';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Router} from '@angular/router';
import {AbstractComponent} from '../../../../shared/abstract-component';
import {LoggedUser} from '../../../../shared/logged-user';
import {UsecaseList} from '../../../../usecase-list';
import {PageRequest} from '../../../../shared/page-request';
import {Payroll} from '../../../../entities/payroll';
import {PayrollService} from '../../../../services/payroll.service';
import {ViewChild} from '@angular/core';
import {Employee} from '../../../../entities/employee';
import {DateHelper} from '../../../../shared/date-helper';
import {Appointment} from '../../../../entities/appointment';
import {EmployeeService} from '../../../../services/employee.service';
import {AppointmentService} from '../../../../services/appointment.service';
import {PayrolladditionSubFormComponent} from './payrolladdition-sub-form/payrolladdition-sub-form.component';
import {PayrolldeductionSubFormComponent} from './payrolldeduction-sub-form/payrolldeduction-sub-form.component';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import {Branchrole} from '../../../../entities/branchrole';
import {Branchroleassignment} from '../../../../entities/branchroleassignment';
import {BranchroleassignmentService} from '../../../../services/branchroleassignment.service';
import {Payrolladdition} from '../../../../entities/payrolladdition';
import {Payrolldeduction} from '../../../../entities/payrolldeduction';
import {Attendance} from '../../../../entities/attendance';
import {AttendanceService} from '../../../../services/attendance.service';

@Component({
  selector: 'app-payroll-form',
  templateUrl: './payroll-form.component.html',
  styleUrls: ['./payroll-form.component.scss']
})
export class PayrollFormComponent extends AbstractComponent implements OnInit {

  employees: Employee[] = [];
  appointments: Appointment[] = [];
  filteredOptions: Observable<Employee[]>;
  payrolladditionList: Payrolladdition[];
  payrolldeductionList: Payrolldeduction[];
  employee: Employee;
  @ViewChild(PayrolladditionSubFormComponent) payrolladditionSubForm: PayrolladditionSubFormComponent;
  @ViewChild(PayrolldeductionSubFormComponent) payrolldeductionSubForm: PayrolldeductionSubFormComponent;

  form = new FormGroup({
    employee: new FormControl(null, [
      Validators.required,
    ]),
    appointment: new FormControl(null, [
      Validators.required,
    ]),
    basicsalary: new FormControl(null, [
      Validators.required,
      Validators.min(0),
      Validators.max(10000000),
      Validators.pattern('^([0-9]{1,8}([.][0-9]{1,2})?)$'),
    ]),
    epfamount: new FormControl(null, [
      Validators.required,
      Validators.min(0),
      Validators.max(10000000),
      Validators.pattern('^([0-9]{1,8}([.][0-9]{1,2})?)$'),
    ]),
    netsalary: new FormControl(null, [
      Validators.required,
      Validators.min(0),
      Validators.max(10000000),
      Validators.pattern('^([0-9]{1,8}([.][0-9]{1,2})?)$'),
    ]),
    alowances: new FormControl(null, [
      Validators.required,
      Validators.min(0),
      Validators.max(10000000),
      Validators.pattern('^([0-9]{1,8}([.][0-9]{1,2})?)$'),
    ]),
    bankaccountno: new FormControl(null, [
      Validators.required,
      Validators.minLength(null),
      Validators.maxLength(255),
    ]),
    bankname: new FormControl(null, [
      Validators.required,
      Validators.minLength(null),
      Validators.maxLength(255),
    ]),
    bankbranch: new FormControl(null, [
      Validators.required,
      Validators.minLength(null),
      Validators.maxLength(255),
    ]),
    payrolladditions: new FormControl(),
    payrolldeductions: new FormControl(),
    description: new FormControl(null, [
      Validators.minLength(null),
      Validators.maxLength(65535),
    ]),
    searchemployee: new FormControl(),
  });

  get employeeField(): FormControl{
    return this.form.controls.employee as FormControl;
  }

  get appointmentField(): FormControl{
    return this.form.controls.appointment as FormControl;
  }

  get basicsalaryField(): FormControl{
    return this.form.controls.basicsalary as FormControl;
  }

  get epfamountField(): FormControl{
    return this.form.controls.epfamount as FormControl;
  }

  get netsalaryField(): FormControl{
    return this.form.controls.netsalary as FormControl;
  }



  get monthField(): FormControl{
    return this.form.controls.month as FormControl;
  }

  get bankaccountnoField(): FormControl{
    return this.form.controls.bankaccountno as FormControl;
  }

  get banknameField(): FormControl{
    return this.form.controls.bankname as FormControl;
  }

  get bankbranchField(): FormControl{
    return this.form.controls.bankbranch as FormControl;
  }

  get payrolladditionsField(): FormControl{
    return this.form.controls.payrolladditions as FormControl;
  }

  get payrolldeductionsField(): FormControl{
    return this.form.controls.payrolldeductions as FormControl;
  }

  get descriptionField(): FormControl{
    return this.form.controls.description as FormControl;
  }

  get searchemployeeField(): FormControl{
    return this.form.controls.searchemployee as FormControl;
  }
  get alowancesField(): FormControl{
    return this.form.controls.alowances as FormControl;
  }


  constructor(
    private employeeService: EmployeeService,
    private appointmentService: AppointmentService,
    private branchroleassignmentService: BranchroleassignmentService,
    private attendanceService: AttendanceService,
    private payrollService: PayrollService,
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

    this.employeeService.getAllForPayroll().then((employeeDataPage) => {
      this.employees = employeeDataPage;
    }).catch((e) => {
      console.log(e);
      this.snackBar.open('Something is wrong', null, {duration: 2000});
    });
  }

  updatePrivileges(): any {
    this.privilege.add = LoggedUser.can(UsecaseList.ADD_PAYROLL);
    this.privilege.showAll = LoggedUser.can(UsecaseList.SHOW_ALL_PAYROLLS);
    this.privilege.showOne = LoggedUser.can(UsecaseList.SHOW_PAYROLL_DETAILS);
    this.privilege.delete = LoggedUser.can(UsecaseList.DELETE_PAYROLL);
    this.privilege.update = LoggedUser.can(UsecaseList.UPDATE_PAYROLL);
  }

  async submit(): Promise<void> {
    this.payrolladditionSubForm.resetForm();
    this.payrolladditionsField.markAsDirty();
    this.payrolldeductionSubForm.resetForm();
    this.payrolldeductionsField.markAsDirty();
    if (this.form.invalid) { return; }

    const payroll: Payroll = new Payroll();
    payroll.employee = this.employeeField.value;
    payroll.appointment = this.appointmentField.value;
    payroll.basicsalary = this.basicsalaryField.value;
    payroll.epfamount = this.epfamountField.value;
    payroll.netsalary = this.netsalaryField.value;
    payroll.alowances = this.alowancesField.value;
    payroll.bankaccountno = this.bankaccountnoField.value;
    payroll.bankname = this.banknameField.value;
    payroll.bankbranch = this.bankbranchField.value;
    payroll.payrolladditionList = this.payrolladditionsField.value;
    payroll.payrolldeductionList = this.payrolldeductionsField.value;
    payroll.description = this.descriptionField.value;
    try{
      const resourceLink: ResourceLink = await this.payrollService.add(payroll);
      if (this.privilege.showOne) {
        await this.router.navigateByUrl('/payrolls/' + resourceLink.id);
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
          if (msg.employee) { this.employeeField.setErrors({server: msg.employee}); knownError = true; }
          if (msg.appointment) { this.appointmentField.setErrors({server: msg.appointment}); knownError = true; }
          if (msg.basicsalary) { this.basicsalaryField.setErrors({server: msg.basicsalary}); knownError = true; }
          if (msg.epfamount) { this.epfamountField.setErrors({server: msg.epfamount}); knownError = true; }
          if (msg.netsalary) { this.netsalaryField.setErrors({server: msg.netsalary}); knownError = true; }
          if (msg.month) { this.monthField.setErrors({server: msg.month}); knownError = true; }
          if (msg.bankaccountno) { this.bankaccountnoField.setErrors({server: msg.bankaccountno}); knownError = true; }
          if (msg.bankname) { this.banknameField.setErrors({server: msg.bankname}); knownError = true; }
          if (msg.bankbranch) { this.bankbranchField.setErrors({server: msg.bankbranch}); knownError = true; }
          if (msg.payrolladditionList) { this.payrolladditionsField.setErrors({server: msg.payrolladditionList}); knownError = true; }
          if (msg.payrolldeductionList) { this.payrolldeductionsField.setErrors({server: msg.payrolldeductionList}); knownError = true; }
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

  setSearchValue(option: any): void{
    console.log(option);
    this.employeeField.patchValue(option);
    this.appointmentService.getAllForPayroll(option.id).then((appointmentDataPage) => {
      this.appointments = appointmentDataPage;
    }).catch((e) => {
      console.log(e);
      this.snackBar.open('Something is wrong', null, {duration: 2000});
    });
    this.setAccountDetails();
  }


  async salaryCalculation(): Promise<void> {
    let alowancesTotal = 0;
    let netsallary = 0;
    let epf = 0;
    const appointment = await this.appointmentService.get(this.appointmentField.value);
    const attendences: Attendance[] = await this.attendanceService.getAllByEmployeeMonth(this.employee.id);
    const branchroleassignments = await this.branchroleassignmentService.getAllForSalaryCalculation(this.employeeField.value.id);

    this.basicsalaryField.patchValue(appointment.designation.basicsalary - (appointment.designation.basicsalary / 100) * 8);
    appointment.appointmentallowanceList.forEach(appointmentallowence => {
      alowancesTotal += appointmentallowence.amount;
    });
    branchroleassignments.forEach(branchroleassignment => {
      alowancesTotal += branchroleassignment.allowance;
      alowancesTotal += branchroleassignment.branchrole.allowance;
    });
    this.alowancesField.patchValue(alowancesTotal);
    epf = (appointment.designation.basicsalary / 100) * 20;
    netsallary += appointment.designation.basicsalary;
    netsallary += this.alowancesField.value;
    this.epfamountField.setValue(epf);

    const payrolldeduction: Payrolldeduction = new Payrolldeduction();

    if (attendences.length !== 0){

      if (attendences.length >= 5 && attendences.length <= 10){
        payrolldeduction.title = 'Attendance between 5 and 10';
        payrolldeduction.amount = netsallary / 100 * 75;
        this.payrolldeductionsField.patchValue([payrolldeduction]);
      }else if (attendences.length >= 11 && attendences.length <= 17){
        payrolldeduction.title = 'Attendance between 11 and 17';
        payrolldeduction.amount = netsallary / 100 * 50;
        this.payrolldeductionsField.patchValue([payrolldeduction]);
      }else if (attendences.length >= 18 && attendences.length <= 24){
        payrolldeduction.title = 'Attendance between 18 and 24';
        payrolldeduction.amount = netsallary / 100 * 25;
        this.payrolldeductionsField.patchValue([payrolldeduction]);
      }else if (attendences.length < 5){
        payrolldeduction.title = 'Attendance between 4 and 0';
        payrolldeduction.amount = netsallary;
        this.payrolldeductionsField.patchValue([payrolldeduction]);
      }
      netsallary -= (appointment.designation.basicsalary / 100) * 8;
    }else {
      payrolldeduction.title = 'No Attendance';
      payrolldeduction.amount = netsallary;
      this.payrolldeductionsField.patchValue([payrolldeduction]);
    }



    if (this.payrolladditionsField.value){
      this.payrolladditionList = this.payrolladditionsField.value;
      this.payrolladditionList.forEach(addition => {
        netsallary += addition.amount;
      });
    }
    if (this.payrolldeductionsField.value){
      this.payrolldeductionList = this.payrolldeductionsField.value;
      this.payrolldeductionList.forEach(deduction => {
        netsallary -= deduction.amount;
      });
    }

    this.netsalaryField.patchValue(netsallary);

    this.netsalaryField.disable();
    this.epfamountField.disable();
    this.basicsalaryField.disable();

  }

  async setAccountDetails(): Promise<void> {
    this.employee = await this.employeeService.get(this.employeeField.value.id);
    this.bankaccountnoField.patchValue(this.employee.bankaccountno);
    this.banknameField.patchValue(this.employee.bankname);
    this.bankbranchField.patchValue(this.employee.bankbranch);
  }
}
