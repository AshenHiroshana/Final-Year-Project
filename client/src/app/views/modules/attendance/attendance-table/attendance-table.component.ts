import {Component, OnInit} from '@angular/core';
import {FormControl} from '@angular/forms';
import {MatDialog} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import {PageRequest} from '../../../../shared/page-request';
import {LoggedUser} from '../../../../shared/logged-user';
import {UsecaseList} from '../../../../usecase-list';
import {DeleteConfirmDialogComponent} from '../../../../shared/views/delete-confirm-dialog/delete-confirm-dialog.component';
import {AbstractComponent} from '../../../../shared/abstract-component';
import {Attendance, AttendanceDataPage} from '../../../../entities/attendance';
import {AttendanceService} from '../../../../services/attendance.service';
import {Branch} from '../../../../entities/branch';
import {Employee} from '../../../../entities/employee';
import {BranchService} from '../../../../services/branch.service';
import {EmployeeService} from '../../../../services/employee.service';

@Component({
  selector: 'app-attendance-table',
  templateUrl: './attendance-table.component.html',
  styleUrls: ['./attendance-table.component.scss']
})
export class AttendanceTableComponent extends AbstractComponent implements OnInit {

  attendanceDataPage: AttendanceDataPage;
  displayedColumns: string[] = [];
  pageSize = 5;
  pageIndex = 0;

  branches: Branch[] = [];
  employees: Employee[] = [];

  codeField = new FormControl();
  branchField = new FormControl();
  employeeField = new FormControl();

  constructor(
    private branchService: BranchService,
    private employeeService: EmployeeService,
    private attendanceService: AttendanceService,
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
    pageRequest.addSearchCriteria('branch', this.branchField.value);
    pageRequest.addSearchCriteria('employee', this.employeeField.value);

    this.branchService.getAllBasic(new PageRequest()).then((branchDataPage) => {
      this.branches = branchDataPage.content;
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

    this.attendanceService.getAll(pageRequest).then((page: AttendanceDataPage) => {
      this.attendanceDataPage = page;
    }).catch( e => {
      console.log(e);
      this.snackBar.open('Something is wrong', null, {duration: 2000});
    });
  }

  updatePrivileges(): any {
    this.privilege.add = LoggedUser.can(UsecaseList.ADD_ATTENDANCE);
    this.privilege.showAll = LoggedUser.can(UsecaseList.SHOW_ALL_ATTENDANCES);
    this.privilege.showOne = LoggedUser.can(UsecaseList.SHOW_ATTENDANCE_DETAILS);
    this.privilege.delete = LoggedUser.can(UsecaseList.DELETE_ATTENDANCE);
    this.privilege.update = LoggedUser.can(UsecaseList.UPDATE_ATTENDANCE);
  }

  setDisplayedColumns(): void{
    this.displayedColumns = ['code', 'branch', 'employee', 'date', 'in', 'out'];

    if (this.privilege.delete) { this.displayedColumns.push('delete-col'); }
    if (this.privilege.update) { this.displayedColumns.push('update-col'); }
    if (this.privilege.showOne) { this.displayedColumns.push('more-col'); }
  }

  paginate(e): void{
    this.pageSize = e.pageSize;
    this.pageIndex = e.pageIndex;
    this.loadData();
  }

  async delete(attendance: Attendance): Promise<void>{
    const dialogRef = this.dialog.open(DeleteConfirmDialogComponent, {
      width: '300px',
      data: {message: attendance.code}
    });

    dialogRef.afterClosed().subscribe( async result => {
      if (!result) { return; }
      try {
        await this.attendanceService.delete(attendance.id);
      }catch (e) {
        this.snackBar.open(e.error.message, null, {duration: 4000});
      }
      this.loadData();
    });
  }
}
