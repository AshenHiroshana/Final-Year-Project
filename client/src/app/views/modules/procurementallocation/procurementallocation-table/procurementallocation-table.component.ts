import {Component, OnInit} from '@angular/core';
import {FormControl} from '@angular/forms';
import {MatDialog} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import {PageRequest} from '../../../../shared/page-request';
import {LoggedUser} from '../../../../shared/logged-user';
import {UsecaseList} from '../../../../usecase-list';
import {DeleteConfirmDialogComponent} from '../../../../shared/views/delete-confirm-dialog/delete-confirm-dialog.component';
import {AbstractComponent} from '../../../../shared/abstract-component';
import {Procurementallocation, ProcurementallocationDataPage} from '../../../../entities/procurementallocation';
import {ProcurementallocationService} from '../../../../services/procurementallocation.service';
import {Branchsection} from '../../../../entities/branchsection';
import {BranchsectionService} from '../../../../services/branchsection.service';

@Component({
  selector: 'app-procurementallocation-table',
  templateUrl: './procurementallocation-table.component.html',
  styleUrls: ['./procurementallocation-table.component.scss']
})
export class ProcurementallocationTableComponent extends AbstractComponent implements OnInit {

  procurementallocationDataPage: ProcurementallocationDataPage;
  displayedColumns: string[] = [];
  pageSize = 5;
  pageIndex = 0;

  branchsections: Branchsection[] = [];

  codeField = new FormControl();
  branchsectionField = new FormControl();

  constructor(
    private branchsectionService: BranchsectionService,
    private procurementallocationService: ProcurementallocationService,
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
    pageRequest.addSearchCriteria('branchsection', this.branchsectionField.value);

    this.branchsectionService.getAllBasic(new PageRequest()).then((branchsectionDataPage) => {
      this.branchsections = branchsectionDataPage.content;
    }).catch((e) => {
      console.log(e);
      this.snackBar.open('Something is wrong', null, {duration: 2000});
    });

    this.procurementallocationService.getAll(pageRequest).then((page: ProcurementallocationDataPage) => {
      this.procurementallocationDataPage = page;
    }).catch( e => {
      console.log(e);
      this.snackBar.open('Something is wrong', null, {duration: 2000});
    });
  }

  updatePrivileges(): any {
    this.privilege.add = LoggedUser.can(UsecaseList.ADD_PROCUREMENTALLOCATION);
    this.privilege.showAll = LoggedUser.can(UsecaseList.SHOW_ALL_PROCUREMENTALLOCATIONS);
    this.privilege.showOne = LoggedUser.can(UsecaseList.SHOW_PROCUREMENTALLOCATION_DETAILS);
    this.privilege.delete = LoggedUser.can(UsecaseList.DELETE_PROCUREMENTALLOCATION);
    this.privilege.update = LoggedUser.can(UsecaseList.UPDATE_PROCUREMENTALLOCATION);
  }

  setDisplayedColumns(): void{
    this.displayedColumns = ['code', 'branchsection', 'doallocated'];

    if (this.privilege.delete) { this.displayedColumns.push('delete-col'); }
    if (this.privilege.update) { this.displayedColumns.push('update-col'); }
    if (this.privilege.showOne) { this.displayedColumns.push('more-col'); }
  }

  paginate(e): void{
    this.pageSize = e.pageSize;
    this.pageIndex = e.pageIndex;
    this.loadData();
  }

  async delete(procurementallocation: Procurementallocation): Promise<void>{
    const dialogRef = this.dialog.open(DeleteConfirmDialogComponent, {
      width: '300px',
      data: {message: procurementallocation.code}
    });

    dialogRef.afterClosed().subscribe( async result => {
      if (!result) { return; }
      try {
        await this.procurementallocationService.delete(procurementallocation.id);
      }catch (e) {
        this.snackBar.open(e.error.message, null, {duration: 4000});
      }
      this.loadData();
    });
  }
}
