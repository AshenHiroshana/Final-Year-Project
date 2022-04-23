import {Component, OnInit} from '@angular/core';
import {FormControl} from '@angular/forms';
import {MatDialog} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import {PageRequest} from '../../../../shared/page-request';
import {LoggedUser} from '../../../../shared/logged-user';
import {UsecaseList} from '../../../../usecase-list';
import {DeleteConfirmDialogComponent} from '../../../../shared/views/delete-confirm-dialog/delete-confirm-dialog.component';
import {AbstractComponent} from '../../../../shared/abstract-component';
import {Branchsection, BranchsectionDataPage} from '../../../../entities/branchsection';
import {BranchsectionService} from '../../../../services/branchsection.service';
import {Branch} from '../../../../entities/branch';
import {BranchService} from '../../../../services/branch.service';
import {Branchsectiontype} from '../../../../entities/branchsectiontype';
import {Branchsectionstatus} from '../../../../entities/branchsectionstatus';
import {BranchsectiontypeService} from '../../../../services/branchsectiontype.service';
import {BranchsectionstatusService} from '../../../../services/branchsectionstatus.service';

@Component({
  selector: 'app-branchsection-table',
  templateUrl: './branchsection-table.component.html',
  styleUrls: ['./branchsection-table.component.scss']
})
export class BranchsectionTableComponent extends AbstractComponent implements OnInit {

  branchsectionDataPage: BranchsectionDataPage;
  displayedColumns: string[] = [];
  pageSize = 5;
  pageIndex = 0;

  branchsectionstatuses: Branchsectionstatus[] = [];
  branchsectiontypes: Branchsectiontype[] = [];
  branches: Branch[] = [];

  codeField = new FormControl();
  branchsectionstatusField = new FormControl();
  branchsectiontypeField = new FormControl();
  branchField = new FormControl();

  constructor(
    private branchsectionstatusService: BranchsectionstatusService,
    private branchsectiontypeService: BranchsectiontypeService,
    private branchService: BranchService,
    private branchsectionService: BranchsectionService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {
    super();
  }

  async ngOnInit(): Promise<void> {
    this.branchsectionstatusService.getAll().then((branchsectionstatuses) => {
      this.branchsectionstatuses = branchsectionstatuses;
    }).catch((e) => {
      console.log(e);
      this.snackBar.open('Something is wrong', null, {duration: 2000});
    });
    this.branchsectiontypeService.getAll().then((branchsectiontypes) => {
      this.branchsectiontypes = branchsectiontypes;
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
    pageRequest.addSearchCriteria('branchsectionstatus', this.branchsectionstatusField.value);
    pageRequest.addSearchCriteria('branchsectiontype', this.branchsectiontypeField.value);
    pageRequest.addSearchCriteria('branch', this.branchField.value);

    this.branchService.getAllBasic(new PageRequest()).then((branchDataPage) => {
      this.branches = branchDataPage.content;
    }).catch((e) => {
      console.log(e);
      this.snackBar.open('Something is wrong', null, {duration: 2000});
    });

    this.branchsectionService.getAll(pageRequest).then((page: BranchsectionDataPage) => {
      this.branchsectionDataPage = page;
    }).catch( e => {
      console.log(e);
      this.snackBar.open('Something is wrong', null, {duration: 2000});
    });
  }

  updatePrivileges(): any {
    this.privilege.add = LoggedUser.can(UsecaseList.ADD_BRANCHSECTION);
    this.privilege.showAll = LoggedUser.can(UsecaseList.SHOW_ALL_BRANCHSECTIONS);
    this.privilege.showOne = LoggedUser.can(UsecaseList.SHOW_BRANCHSECTION_DETAILS);
    this.privilege.delete = LoggedUser.can(UsecaseList.DELETE_BRANCHSECTION);
    this.privilege.update = LoggedUser.can(UsecaseList.UPDATE_BRANCHSECTION);
  }

  setDisplayedColumns(): void{
    this.displayedColumns = ['photo', 'code', 'name', 'branchsectionstatus', 'branchsectiontype', 'branch'];

    if (this.privilege.delete) { this.displayedColumns.push('delete-col'); }
    if (this.privilege.update) { this.displayedColumns.push('update-col'); }
    if (this.privilege.showOne) { this.displayedColumns.push('more-col'); }
  }

  paginate(e): void{
    this.pageSize = e.pageSize;
    this.pageIndex = e.pageIndex;
    this.loadData();
  }

  async delete(branchsection: Branchsection): Promise<void>{
    const dialogRef = this.dialog.open(DeleteConfirmDialogComponent, {
      width: '300px',
      data: {message: branchsection.code + ' - ' + branchsection.name}
    });

    dialogRef.afterClosed().subscribe( async result => {
      if (!result) { return; }
      try {
        await this.branchsectionService.delete(branchsection.id);
      }catch (e) {
        this.snackBar.open(e.error.message, null, {duration: 4000});
      }
      this.loadData();
    });
  }
}
