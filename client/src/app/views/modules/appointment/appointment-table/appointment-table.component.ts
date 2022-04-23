import {Component, OnInit} from '@angular/core';
import {FormControl} from '@angular/forms';
import {MatDialog} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import {PageRequest} from '../../../../shared/page-request';
import {LoggedUser} from '../../../../shared/logged-user';
import {UsecaseList} from '../../../../usecase-list';
import {DeleteConfirmDialogComponent} from '../../../../shared/views/delete-confirm-dialog/delete-confirm-dialog.component';
import {AbstractComponent} from '../../../../shared/abstract-component';
import {Appointment, AppointmentDataPage} from '../../../../entities/appointment';
import {AppointmentService} from '../../../../services/appointment.service';
import {Employee} from '../../../../entities/employee';
import {Designation} from '../../../../entities/designation';
import {EmployeeService} from '../../../../services/employee.service';
import {Appointmentstatus} from '../../../../entities/appointmentstatus';
import {DesignationService} from '../../../../services/designation.service';
import {AppointmentstatusService} from '../../../../services/appointmentstatus.service';

@Component({
  selector: 'app-appointment-table',
  templateUrl: './appointment-table.component.html',
  styleUrls: ['./appointment-table.component.scss']
})
export class AppointmentTableComponent extends AbstractComponent implements OnInit {

  appointmentDataPage: AppointmentDataPage;
  displayedColumns: string[] = [];
  pageSize = 5;
  pageIndex = 0;

  designations: Designation[] = [];
  employees: Employee[] = [];
  appointmentstatuses: Appointmentstatus[] = [];

  codeField = new FormControl();
  designationField = new FormControl();
  employeeField = new FormControl();
  appointmentstatusField = new FormControl();

  constructor(
    private designationService: DesignationService,
    private employeeService: EmployeeService,
    private appointmentstatusService: AppointmentstatusService,
    private appointmentService: AppointmentService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {
    super();
  }

  async ngOnInit(): Promise<void> {
    this.appointmentstatusService.getAll().then((appointmentstatuses) => {
      this.appointmentstatuses = appointmentstatuses;
    }).catch((e) => {
      console.log(e);
      this.snackBar.open('Something is wrong', null, {duration: 2000});
    });

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
    pageRequest.addSearchCriteria('designation', this.designationField.value);
    pageRequest.addSearchCriteria('employee', this.employeeField.value);
    pageRequest.addSearchCriteria('appointmentstatus', this.appointmentstatusField.value);

    this.designationService.getAllBasic(new PageRequest()).then((designationDataPage) => {
      this.designations = designationDataPage.content;
    }).catch((e) => {
      console.log(e);
      this.snackBar.open('Something is wrong', null, {duration: 2000});
    });
    this.employeeService.getAllBasic(new PageRequest()).then((employeeDataPage) => {
      this.employees = employeeDataPage.content;
    }).catch((e) => {
      console.log(e);
      this.snackBar.open('Something is wrong', null, {duration: 2000});
    });

    this.appointmentService.getAll(pageRequest).then((page: AppointmentDataPage) => {
      this.appointmentDataPage = page;
    }).catch( e => {
      console.log(e);
      this.snackBar.open('Something is wrong', null, {duration: 2000});
    });
  }

  updatePrivileges(): any {
    this.privilege.add = LoggedUser.can(UsecaseList.ADD_APPOINTMENT);
    this.privilege.showAll = LoggedUser.can(UsecaseList.SHOW_ALL_APPOINTMENTS);
    this.privilege.showOne = LoggedUser.can(UsecaseList.SHOW_APPOINTMENT_DETAILS);
    this.privilege.delete = LoggedUser.can(UsecaseList.DELETE_APPOINTMENT);
    this.privilege.update = LoggedUser.can(UsecaseList.UPDATE_APPOINTMENT);
  }

  setDisplayedColumns(): void{
    this.displayedColumns = ['code', 'designation', 'employee', 'appointmentstatus', 'dogrant'];

    if (this.privilege.delete) { this.displayedColumns.push('delete-col'); }
    if (this.privilege.update) { this.displayedColumns.push('update-col'); }
    if (this.privilege.showOne) { this.displayedColumns.push('more-col'); }
  }

  paginate(e): void{
    this.pageSize = e.pageSize;
    this.pageIndex = e.pageIndex;
    this.loadData();
  }

  async delete(appointment: Appointment): Promise<void>{
    const dialogRef = this.dialog.open(DeleteConfirmDialogComponent, {
      width: '300px',
      data: {message: appointment.code}
    });

    dialogRef.afterClosed().subscribe( async result => {
      if (!result) { return; }
      try {
        await this.appointmentService.delete(appointment.id);
      }catch (e) {
        this.snackBar.open(e.error.message, null, {duration: 4000});
      }
      this.loadData();
    });
  }
}
