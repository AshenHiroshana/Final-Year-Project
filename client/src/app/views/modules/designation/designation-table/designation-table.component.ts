import {Component, OnInit} from '@angular/core';
import {FormControl} from '@angular/forms';
import {MatDialog} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import {PageRequest} from '../../../../shared/page-request';
import {LoggedUser} from '../../../../shared/logged-user';
import {UsecaseList} from '../../../../usecase-list';
import {DeleteConfirmDialogComponent} from '../../../../shared/views/delete-confirm-dialog/delete-confirm-dialog.component';
import {AbstractComponent} from '../../../../shared/abstract-component';
import {Designation, DesignationDataPage} from '../../../../entities/designation';
import {DesignationService} from '../../../../services/designation.service';
import {Department} from '../../../../entities/department';
import {DepartmentService} from '../../../../services/department.service';

@Component({
  selector: 'app-designation-table',
  templateUrl: './designation-table.component.html',
  styleUrls: ['./designation-table.component.scss']
})
export class DesignationTableComponent extends AbstractComponent implements OnInit {

  designationDataPage: DesignationDataPage;
  displayedColumns: string[] = [];
  pageSize = 5;
  pageIndex = 0;

  departments: Department[] = [];

  codeField = new FormControl();
  departmentField = new FormControl();

  constructor(
    private departmentService: DepartmentService,
    private designationService: DesignationService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {
    super();
  }

  async ngOnInit(): Promise<void> {
    this.departmentService.getAll().then((departments) => {
      this.departments = departments;
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
    pageRequest.addSearchCriteria('department', this.departmentField.value);


    this.designationService.getAll(pageRequest).then((page: DesignationDataPage) => {
      this.designationDataPage = page;
    }).catch( e => {
      console.log(e);
      this.snackBar.open('Something is wrong', null, {duration: 2000});
    });
  }

  updatePrivileges(): any {
    this.privilege.add = LoggedUser.can(UsecaseList.ADD_DESIGNATION);
    this.privilege.showAll = LoggedUser.can(UsecaseList.SHOW_ALL_DESIGNATIONS);
    this.privilege.showOne = LoggedUser.can(UsecaseList.SHOW_DESIGNATION_DETAILS);
    this.privilege.delete = LoggedUser.can(UsecaseList.DELETE_DESIGNATION);
    this.privilege.update = LoggedUser.can(UsecaseList.UPDATE_DESIGNATION);
  }

  setDisplayedColumns(): void{
    this.displayedColumns = ['code', 'name', 'department', 'basicsalary'];

    if (this.privilege.delete) { this.displayedColumns.push('delete-col'); }
    if (this.privilege.update) { this.displayedColumns.push('update-col'); }
    if (this.privilege.showOne) { this.displayedColumns.push('more-col'); }
  }

  paginate(e): void{
    this.pageSize = e.pageSize;
    this.pageIndex = e.pageIndex;
    this.loadData();
  }

  async delete(designation: Designation): Promise<void>{
    const dialogRef = this.dialog.open(DeleteConfirmDialogComponent, {
      width: '300px',
      data: {message: designation.code + ' - ' + designation.department.name + ' ' + designation.name}
    });

    dialogRef.afterClosed().subscribe( async result => {
      if (!result) { return; }
      try {
        await this.designationService.delete(designation.id);
      }catch (e) {
        this.snackBar.open(e.error.message, null, {duration: 4000});
      }
      this.loadData();
    });
  }
}
