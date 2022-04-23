import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';
import {MatDialog} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import {PageRequest} from '../../../../shared/page-request';
import {LoggedUser} from '../../../../shared/logged-user';
import {UsecaseList} from '../../../../usecase-list';
import {DeleteConfirmDialogComponent} from '../../../../shared/views/delete-confirm-dialog/delete-confirm-dialog.component';
import {AbstractComponent} from '../../../../shared/abstract-component';
import {Payroll, PayrollDataPage} from '../../../../entities/payroll';
import {PayrollService} from '../../../../services/payroll.service';
import {Employee} from '../../../../entities/employee';
import {Appointment} from '../../../../entities/appointment';
import {EmployeeService} from '../../../../services/employee.service';
import {AppointmentService} from '../../../../services/appointment.service';
import {DateHelper} from "../../../../shared/date-helper";

@Component({
  selector: 'app-payroll-table',
  templateUrl: './payroll-table.component.html',
  styleUrls: ['./payroll-table.component.scss']
})
export class PayrollTableComponent extends AbstractComponent implements OnInit {

  payrollDataPage: PayrollDataPage;
  displayedColumns: string[] = [];
  pageSize = 5;
  pageIndex = 0;

  employees: Employee[] = [];
  appointments: Appointment[] = [];

  range  = new FormGroup({
    start: new FormControl(),
    end: new FormControl()
  });


  get startField(): FormControl{
    return this.range.controls.start as FormControl;
  }

  get endField(): FormControl{
    return this.range.controls.end as FormControl;
  }

  codeField = new FormControl();
  employeeField = new FormControl();
  appointmentField = new FormControl();

  constructor(
    private employeeService: EmployeeService,
    private appointmentService: AppointmentService,
    private payrollService: PayrollService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {
    super();
  }

  async ngOnInit(): Promise<void> {

    await this.loadData();
    this.refreshData();
  }

  async loadData(): Promise<any> {
    this.updatePrivileges();

    if (!this.privilege.showAll) { return; }

    this.setDisplayedColumns();

    const pageRequest = new PageRequest();
    pageRequest.pageIndex  = this.pageIndex;
    pageRequest.pageSize  = this.pageSize;

    pageRequest.addSearchCriteria('code', this.codeField.value);
    pageRequest.addSearchCriteria('employee', this.employeeField.value);
    pageRequest.addSearchCriteria('appointment', this.appointmentField.value);

    pageRequest.addSearchCriteria('startDate', DateHelper.getDateAsString(this.startField.value));
    pageRequest.addSearchCriteria('endtDate', DateHelper.getDateAsString(this.endField.value));


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

    this.payrollService.getAll(pageRequest).then((page: PayrollDataPage) => {
      this.payrollDataPage = page;
    }).catch( e => {
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

  setDisplayedColumns(): void{
    this.displayedColumns = ['code', 'employee', 'appointment', 'basicsalary', 'paydate', 'month'];

    if (this.privilege.delete) { this.displayedColumns.push('delete-col'); }
    if (this.privilege.update) { this.displayedColumns.push('update-col'); }
    if (this.privilege.showOne) { this.displayedColumns.push('more-col'); }
  }

  paginate(e): void{
    this.pageSize = e.pageSize;
    this.pageIndex = e.pageIndex;
    this.loadData();
  }

  async delete(payroll: Payroll): Promise<void>{
    const dialogRef = this.dialog.open(DeleteConfirmDialogComponent, {
      width: '300px',
      data: {message: payroll.code + ' - ' + payroll.employee.nametitle.name + ' ' + payroll.employee.callingname}
    });

    dialogRef.afterClosed().subscribe( async result => {
      if (!result) { return; }
      try {
        await this.payrollService.delete(payroll.id);
      }catch (e) {
        this.snackBar.open(e.error.message, null, {duration: 4000});
      }
      this.loadData();
    });
  }
}
