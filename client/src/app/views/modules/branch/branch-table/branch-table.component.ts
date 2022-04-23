import {Component, OnInit} from '@angular/core';
import {FormControl} from '@angular/forms';
import {MatDialog} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import {PageRequest} from '../../../../shared/page-request';
import {LoggedUser} from '../../../../shared/logged-user';
import {UsecaseList} from '../../../../usecase-list';
import {DeleteConfirmDialogComponent} from '../../../../shared/views/delete-confirm-dialog/delete-confirm-dialog.component';
import {AbstractComponent} from '../../../../shared/abstract-component';
import {Branch, BranchDataPage} from '../../../../entities/branch';
import {BranchService} from '../../../../services/branch.service';
import {Branchstatus} from '../../../../entities/branchstatus';
import {BranchstatusService} from '../../../../services/branchstatus.service';

@Component({
  selector: 'app-branch-table',
  templateUrl: './branch-table.component.html',
  styleUrls: ['./branch-table.component.scss']
})
export class BranchTableComponent extends AbstractComponent implements OnInit {

  branchDataPage: BranchDataPage;
  displayedColumns: string[] = [];
  pageSize = 5;
  pageIndex = 0;

  branchstatuses: Branchstatus[] = [];

  codeField = new FormControl();
  cityField = new FormControl();
  branchstatusField = new FormControl();

  constructor(
    private branchstatusService: BranchstatusService,
    private branchService: BranchService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {
    super();
  }

  async ngOnInit(): Promise<void> {
    this.branchstatusService.getAll().then((branchstatuses) => {
      this.branchstatuses = branchstatuses;
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
    pageRequest.addSearchCriteria('city', this.cityField.value);
    pageRequest.addSearchCriteria('branchstatus', this.branchstatusField.value);


    this.branchService.getAll(pageRequest).then((page: BranchDataPage) => {
      this.branchDataPage = page;
    }).catch( e => {
      console.log(e);
      this.snackBar.open('Something is wrong', null, {duration: 2000});
    });
  }

  updatePrivileges(): any {
    this.privilege.add = LoggedUser.can(UsecaseList.ADD_BRANCH);
    this.privilege.showAll = LoggedUser.can(UsecaseList.SHOW_ALL_BRANCHES);
    this.privilege.showOne = LoggedUser.can(UsecaseList.SHOW_BRANCH_DETAILS);
    this.privilege.delete = LoggedUser.can(UsecaseList.DELETE_BRANCH);
    this.privilege.update = LoggedUser.can(UsecaseList.UPDATE_BRANCH);
  }

  setDisplayedColumns(): void{
    this.displayedColumns = ['photo', 'code', 'city', 'primarycontact', 'branchstatus'];

    if (this.privilege.delete) { this.displayedColumns.push('delete-col'); }
    if (this.privilege.update) { this.displayedColumns.push('update-col'); }
    if (this.privilege.showOne) { this.displayedColumns.push('more-col'); }
  }

  paginate(e): void{
    this.pageSize = e.pageSize;
    this.pageIndex = e.pageIndex;
    this.loadData();
  }

  async delete(branch: Branch): Promise<void>{
    const dialogRef = this.dialog.open(DeleteConfirmDialogComponent, {
      width: '300px',
      data: {message: branch.code + ' - ' + branch.city}
    });

    dialogRef.afterClosed().subscribe( async result => {
      if (!result) { return; }
      try {
        await this.branchService.delete(branch.id);
      }catch (e) {
        this.snackBar.open(e.error.message, null, {duration: 4000});
      }
      this.loadData();
    });
  }
}
