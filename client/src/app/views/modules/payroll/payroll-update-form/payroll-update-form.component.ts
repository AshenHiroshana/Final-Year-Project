import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {MatSnackBar} from '@angular/material/snack-bar';
import {LoggedUser} from '../../../../shared/logged-user';
import {UsecaseList} from '../../../../usecase-list';
import {ResourceLink} from '../../../../shared/resource-link';
import {AbstractComponent} from '../../../../shared/abstract-component';
import {PageRequest} from '../../../../shared/page-request';
import {Payroll} from '../../../../entities/payroll';
import {PayrollService} from '../../../../services/payroll.service';
import {ViewChild} from '@angular/core';
import {Employee} from '../../../../entities/employee';
import {DateHelper} from '../../../../shared/date-helper';
import {Appointment} from '../../../../entities/appointment';
import {EmployeeService} from '../../../../services/employee.service';
import {AppointmentService} from '../../../../services/appointment.service';
import {PayrolladditionUpdateSubFormComponent} from './payrolladdition-update-sub-form/payrolladdition-update-sub-form.component';
import {PayrolldeductionUpdateSubFormComponent} from './payrolldeduction-update-sub-form/payrolldeduction-update-sub-form.component';
import {Attendance} from '../../../../entities/attendance';
import {Payrolldeduction} from '../../../../entities/payrolldeduction';
import {Payrolladdition} from '../../../../entities/payrolladdition';
import {BranchroleassignmentService} from '../../../../services/branchroleassignment.service';
import {AttendanceService} from '../../../../services/attendance.service';

@Component({
  selector: 'app-payroll-update-form',
  templateUrl: './payroll-update-form.component.html',
  styleUrls: ['./payroll-update-form.component.scss']
})
export class PayrollUpdateFormComponent extends AbstractComponent implements OnInit {

  selectedId: number;
  payroll: Payroll;
  payrolladditionList: Payrolladdition[];
  payrolldeductionList: Payrolldeduction[];
  employee: Employee;
  employees: Employee[] = [];
  appointments: Appointment[] = [];
  @ViewChild(PayrolladditionUpdateSubFormComponent) payrolladditionUpdateSubForm: PayrolladditionUpdateSubFormComponent;
  @ViewChild(PayrolldeductionUpdateSubFormComponent) payrolldeductionUpdateSubForm: PayrolldeductionUpdateSubFormComponent;

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
    alowances: new FormControl(null, [
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
    paydate: new FormControl(null, [
      Validators.required,
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

  get paydateField(): FormControl{
    return this.form.controls.paydate as FormControl;
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
  get alowancesField(): FormControl{
    return this.form.controls.alowances as FormControl;
  }

  constructor(
    private employeeService: EmployeeService,
    private appointmentService: AppointmentService,
    private payrollService: PayrollService,
    private route: ActivatedRoute,
    private branchroleassignmentService: BranchroleassignmentService,
    private attendanceService: AttendanceService,
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
    this.netsalaryField.disable();
    this.epfamountField.disable();
    this.basicsalaryField.disable();
  }

  async loadData(): Promise<any>{

    this.updatePrivileges();
    if (!this.privilege.update) { return; }

    this.employeeService.getAllBasic(new PageRequest()).then((employeeDataPage) => {
      this.employees = employeeDataPage.content;
    }).catch((e) => {
      console.log(e);
      this.snackBar.open('Something is wrong', null, {duration: 2000});
    });
    this.appointmentService.getAllBasic(new PageRequest()).then((appointmentDataPage) => {
      this.appointments = appointmentDataPage.content;
    }).catch((e) => {
      console.log(e);
      this.snackBar.open('Something is wrong', null, {duration: 2000});
    });
    this.payroll = await this.payrollService.get(this.selectedId);
    this.setValues();

  }

  updatePrivileges(): any {
    this.privilege.add = LoggedUser.can(UsecaseList.ADD_PAYROLL);
    this.privilege.showAll = LoggedUser.can(UsecaseList.SHOW_ALL_PAYROLLS);
    this.privilege.showOne = LoggedUser.can(UsecaseList.SHOW_PAYROLL_DETAILS);
    this.privilege.delete = LoggedUser.can(UsecaseList.DELETE_PAYROLL);
    this.privilege.update = LoggedUser.can(UsecaseList.UPDATE_PAYROLL);
  }

  discardChanges(): void{
    this.form.markAsPristine();
    this.form.markAsUntouched();
    this.setValues();
  }

  setValues(): void{
    if (this.employeeField.pristine) {
      this.employeeField.setValue(this.payroll.employee.id);
    }
    if (this.appointmentField.pristine) {
      this.appointmentField.setValue(this.payroll.appointment.id);
    }
    if (this.basicsalaryField.pristine) {
      this.basicsalaryField.setValue(this.payroll.basicsalary);
    }
    if (this.epfamountField.pristine) {
      this.epfamountField.setValue(this.payroll.epfamount);
    }
    if (this.netsalaryField.pristine) {
      this.netsalaryField.setValue(this.payroll.netsalary);
    }
    if (this.paydateField.pristine) {
      this.paydateField.setValue(this.payroll.paydate);
    }
    if (this.bankaccountnoField.pristine) {
      this.bankaccountnoField.setValue(this.payroll.bankaccountno);
    }
    if (this.banknameField.pristine) {
      this.banknameField.setValue(this.payroll.bankname);
    }
    if (this.bankbranchField.pristine) {
      this.bankbranchField.setValue(this.payroll.bankbranch);
    }
    if (this.payrolladditionsField.pristine) {
      this.payrolladditionsField.setValue(this.payroll.payrolladditionList);
    }
    if (this.payrolldeductionsField.pristine) {
      this.payrolldeductionsField.setValue(this.payroll.payrolldeductionList);
    }
    if (this.descriptionField.pristine) {
      this.descriptionField.setValue(this.payroll.description);
    }
}

  async submit(): Promise<void> {
    this.payrolladditionUpdateSubForm.resetForm();
    this.payrolladditionsField.markAsDirty();
    this.payrolldeductionUpdateSubForm.resetForm();
    this.payrolldeductionsField.markAsDirty();
    if (this.form.invalid) { return; }

    const newpayroll: Payroll = new Payroll();
    newpayroll.employee = this.employeeField.value;
    newpayroll.appointment = this.appointmentField.value;
    newpayroll.basicsalary = this.basicsalaryField.value;
    newpayroll.epfamount = this.epfamountField.value;
    newpayroll.netsalary = this.netsalaryField.value;
    newpayroll.paydate = DateHelper.getDateAsString(this.paydateField.value);
    newpayroll.bankaccountno = this.bankaccountnoField.value;
    newpayroll.bankname = this.banknameField.value;
    newpayroll.bankbranch = this.bankbranchField.value;
    newpayroll.payrolladditionList = this.payrolladditionsField.value;
    newpayroll.payrolldeductionList = this.payrolldeductionsField.value;
    newpayroll.description = this.descriptionField.value;
    try{
      const resourceLink: ResourceLink = await this.payrollService.update(this.selectedId, newpayroll);
      if (this.privilege.showOne) {
        await this.router.navigateByUrl('/payrolls/' + resourceLink.id);
      } else {
        await this.router.navigateByUrl('/payrolls');
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
          if (msg.paydate) { this.paydateField.setErrors({server: msg.paydate}); knownError = true; }
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


  async salaryCalculation(): Promise<void> {
    let alowancesTotal = 0;
    let netsallary = 0;
    let epf = 0;
    const appointment = await this.appointmentService.get(this.appointmentField.value);
    const attendences: Attendance[] = await this.attendanceService.getAllByEmployeeMonth(this.payroll.employee.id);
    const branchroleassignments = await this.branchroleassignmentService.getAllForSalaryCalculation(this.payroll.employee.id);

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
    this.bankaccountnoField.patchValue(this.employee.bankaccountno);
    this.banknameField.patchValue(this.employee.bankname);
    this.bankbranchField.patchValue(this.employee.bankbranch);
  }
}
