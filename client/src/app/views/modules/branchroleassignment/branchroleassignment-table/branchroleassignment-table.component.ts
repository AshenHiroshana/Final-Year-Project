import {Component, OnInit} from '@angular/core';
import {FormControl} from '@angular/forms';
import {MatDialog} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import {PageRequest} from '../../../../shared/page-request';
import {LoggedUser} from '../../../../shared/logged-user';
import {UsecaseList} from '../../../../usecase-list';
import {DeleteConfirmDialogComponent} from '../../../../shared/views/delete-confirm-dialog/delete-confirm-dialog.component';
import {AbstractComponent} from '../../../../shared/abstract-component';
import {Branchroleassignment, BranchroleassignmentDataPage} from '../../../../entities/branchroleassignment';
import {BranchroleassignmentService} from '../../../../services/branchroleassignment.service';
import {Branch} from '../../../../entities/branch';
import {Employee} from '../../../../entities/employee';
import {BranchService} from '../../../../services/branch.service';
import {EmployeeService} from '../../../../services/employee.service';
import {Branchroleassignmentstatus} from '../../../../entities/branchroleassignmentstatus';
import {BranchroleassignmentstatusService} from '../../../../services/branchroleassignmentstatus.service';

@Component({
  selector: 'app-branchroleassignment-table',
  templateUrl: './branchroleassignment-table.component.html',
  styleUrls: ['./branchroleassignment-table.component.scss']
})
export class BranchroleassignmentTableComponent extends AbstractComponent implements OnInit {

  branchroleassignmentDataPage: BranchroleassignmentDataPage;
  displayedColumns: string[] = [];
  pageSize = 5;
  pageIndex = 0;

  branches: Branch[] = [];
  employees: Employee[] = [];
  branchroleassignmentstatuses: Branchroleassignmentstatus[] = [];

  codeField = new FormControl();
  branchField = new FormControl();
  employeeField = new FormControl();
  branchroleassignmentstatusField = new FormControl();

  constructor(
    private branchService: BranchService,
    private employeeService: EmployeeService,
    private branchroleassignmentstatusService: BranchroleassignmentstatusService,
    private branchroleassignmentService: BranchroleassignmentService,
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
    pageRequest.addSearchCriteria('branchroleassignmentstatus', this.branchroleassignmentstatusField.value);

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
    this.branchroleassignmentstatusService.getAll().then((branchroleassignmentstatuses) => {
      this.branchroleassignmentstatuses = branchroleassignmentstatuses;
    }).catch((e) => {
      console.log(e);
      this.snackBar.open('Something is wrong', null, {duration: 2000});
    });

    this.branchroleassignmentService.getAll(pageRequest).then((page: BranchroleassignmentDataPage) => {
      this.branchroleassignmentDataPage = page;
    }).catch( e => {
      console.log(e);
      this.snackBar.open('Something is wrong', null, {duration: 2000});
    });
  }

  updatePrivileges(): any {
    this.privilege.add = LoggedUser.can(UsecaseList.ADD_BRANCHROLEASSIGNMENT);
    this.privilege.showAll = LoggedUser.can(UsecaseList.SHOW_ALL_BRANCHROLEASSIGNMENTS);
    this.privilege.showOne = LoggedUser.can(UsecaseList.SHOW_BRANCHROLEASSIGNMENT_DETAILS);
    this.privilege.delete = LoggedUser.can(UsecaseList.DELETE_BRANCHROLEASSIGNMENT);
    this.privilege.update = LoggedUser.can(UsecaseList.UPDATE_BRANCHROLEASSIGNMENT);
  }

  setDisplayedColumns(): void{
    this.displayedColumns = ['code', 'branch', 'branchrole', 'employee', 'branchroleassignmentstatus'];

    if (this.privilege.delete) { this.displayedColumns.push('delete-col'); }
    if (this.privilege.update) { this.displayedColumns.push('update-col'); }
    if (this.privilege.showOne) { this.displayedColumns.push('more-col'); }
  }

  paginate(e): void{
    this.pageSize = e.pageSize;
    this.pageIndex = e.pageIndex;
    this.loadData();
  }

  async delete(branchroleassignment: Branchroleassignment): Promise<void>{
    const dialogRef = this.dialog.open(DeleteConfirmDialogComponent, {
      width: '300px',
      data: {message: branchroleassignment.code}
    });

    dialogRef.afterClosed().subscribe( async result => {
      if (!result) { return; }
      try {
        await this.branchroleassignmentService.delete(branchroleassignment.id);
      }catch (e) {
        this.snackBar.open(e.error.message, null, {duration: 4000});
      }
      this.loadData();
    });
  }
}
