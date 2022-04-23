import {Component, OnInit} from '@angular/core';
import {FormControl} from '@angular/forms';
import {MatDialog} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import {PageRequest} from '../../../../shared/page-request';
import {LoggedUser} from '../../../../shared/logged-user';
import {UsecaseList} from '../../../../usecase-list';
import {DeleteConfirmDialogComponent} from '../../../../shared/views/delete-confirm-dialog/delete-confirm-dialog.component';
import {AbstractComponent} from '../../../../shared/abstract-component';
import {Branchrole, BranchroleDataPage} from '../../../../entities/branchrole';
import {BranchroleService} from '../../../../services/branchrole.service';
import {Branch} from '../../../../entities/branch';
import {Department} from '../../../../entities/department';
import {BranchService} from '../../../../services/branch.service';
import {Branchrolestatus} from '../../../../entities/branchrolestatus';
import {DepartmentService} from '../../../../services/department.service';
import {BranchrolestatusService} from '../../../../services/branchrolestatus.service';

@Component({
  selector: 'app-branchrole-table',
  templateUrl: './branchrole-table.component.html',
  styleUrls: ['./branchrole-table.component.scss']
})
export class BranchroleTableComponent extends AbstractComponent implements OnInit {

  branchroleDataPage: BranchroleDataPage;
  displayedColumns: string[] = [];
  pageSize = 5;
  pageIndex = 0;

  branches: Branch[] = [];
  branchrolestatuses: Branchrolestatus[] = [];
  departments: Department[] = [];

  branchField = new FormControl();
  nameField = new FormControl();
  branchrolestatusField = new FormControl();
  departmentField = new FormControl();

  constructor(
    private branchService: BranchService,
    private branchrolestatusService: BranchrolestatusService,
    private departmentService: DepartmentService,
    private branchroleService: BranchroleService,
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

    pageRequest.addSearchCriteria('branch', this.branchField.value);
    pageRequest.addSearchCriteria('name', this.nameField.value);
    pageRequest.addSearchCriteria('branchrolestatus', this.branchrolestatusField.value);
    pageRequest.addSearchCriteria('department', this.departmentField.value);

    this.branchService.getAllBasic(new PageRequest()).then((branchDataPage) => {
      this.branches = branchDataPage.content;
    }).catch((e) => {
      console.log(e);
      this.snackBar.open('Something is wrong', null, {duration: 2000});
    });
    this.branchrolestatusService.getAll().then((branchrolestatuses) => {
      this.branchrolestatuses = branchrolestatuses;
    }).catch((e) => {
      console.log(e);
      this.snackBar.open('Something is wrong', null, {duration: 2000});
    });
    this.departmentService.getAll().then((departments) => {
      this.departments = departments;
    }).catch((e) => {
      console.log(e);
      this.snackBar.open('Something is wrong', null, {duration: 2000});
    });

    this.branchroleService.getAll(pageRequest).then((page: BranchroleDataPage) => {
      this.branchroleDataPage = page;
    }).catch( e => {
      console.log(e);
      this.snackBar.open('Something is wrong', null, {duration: 2000});
    });
  }

  updatePrivileges(): any {
    this.privilege.add = LoggedUser.can(UsecaseList.ADD_BRANCHROLE);
    this.privilege.showAll = LoggedUser.can(UsecaseList.SHOW_ALL_BRANCHROLES);
    this.privilege.showOne = LoggedUser.can(UsecaseList.SHOW_BRANCHROLE_DETAILS);
    this.privilege.delete = LoggedUser.can(UsecaseList.DELETE_BRANCHROLE);
    this.privilege.update = LoggedUser.can(UsecaseList.UPDATE_BRANCHROLE);
  }

  setDisplayedColumns(): void{
    this.displayedColumns = ['code', 'branch', 'name', 'branchrolestatus', 'department'];

    if (this.privilege.delete) { this.displayedColumns.push('delete-col'); }
    if (this.privilege.update) { this.displayedColumns.push('update-col'); }
    if (this.privilege.showOne) { this.displayedColumns.push('more-col'); }
  }

  paginate(e): void{
    this.pageSize = e.pageSize;
    this.pageIndex = e.pageIndex;
    this.loadData();
  }

  async delete(branchrole: Branchrole): Promise<void>{
    const dialogRef = this.dialog.open(DeleteConfirmDialogComponent, {
      width: '300px',
      data: {message: branchrole.code + ' - ' + branchrole.name}
    });

    dialogRef.afterClosed().subscribe( async result => {
      if (!result) { return; }
      try {
        await this.branchroleService.delete(branchrole.id);
      }catch (e) {
        this.snackBar.open(e.error.message, null, {duration: 4000});
      }
      this.loadData();
    });
  }
}
