import {Component, OnInit} from '@angular/core';
import {FormControl} from '@angular/forms';
import {MatDialog} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import {PageRequest} from '../../../../shared/page-request';
import {LoggedUser} from '../../../../shared/logged-user';
import {UsecaseList} from '../../../../usecase-list';
import {DeleteConfirmDialogComponent} from '../../../../shared/views/delete-confirm-dialog/delete-confirm-dialog.component';
import {AbstractComponent} from '../../../../shared/abstract-component';
import {Procurementitemtype, ProcurementitemtypeDataPage} from '../../../../entities/procurementitemtype';
import {ProcurementitemtypeService} from '../../../../services/procurementitemtype.service';

@Component({
  selector: 'app-procurementitemtype-table',
  templateUrl: './procurementitemtype-table.component.html',
  styleUrls: ['./procurementitemtype-table.component.scss']
})
export class ProcurementitemtypeTableComponent extends AbstractComponent implements OnInit {

  procurementitemtypeDataPage: ProcurementitemtypeDataPage;
  displayedColumns: string[] = [];
  pageSize = 5;
  pageIndex = 0;


  codeField = new FormControl();
  nameField = new FormControl();

  constructor(
    private procurementitemtypeService: ProcurementitemtypeService,
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
    pageRequest.addSearchCriteria('name', this.nameField.value);


    this.procurementitemtypeService.getAll(pageRequest).then((page: ProcurementitemtypeDataPage) => {
      this.procurementitemtypeDataPage = page;
    }).catch( e => {
      console.log(e);
      this.snackBar.open('Something is wrong', null, {duration: 2000});
    });
  }

  updatePrivileges(): any {
    this.privilege.add = LoggedUser.can(UsecaseList.ADD_PROCUREMENTITEMTYPE);
    this.privilege.showAll = LoggedUser.can(UsecaseList.SHOW_ALL_PROCUREMENTITEMTYPES);
    this.privilege.showOne = LoggedUser.can(UsecaseList.SHOW_PROCUREMENTITEMTYPE_DETAILS);
    this.privilege.delete = LoggedUser.can(UsecaseList.DELETE_PROCUREMENTITEMTYPE);
    this.privilege.update = LoggedUser.can(UsecaseList.UPDATE_PROCUREMENTITEMTYPE);
  }

  setDisplayedColumns(): void{
    this.displayedColumns = ['code', 'name'];

    if (this.privilege.delete) { this.displayedColumns.push('delete-col'); }
    if (this.privilege.update) { this.displayedColumns.push('update-col'); }
    if (this.privilege.showOne) { this.displayedColumns.push('more-col'); }
  }

  paginate(e): void{
    this.pageSize = e.pageSize;
    this.pageIndex = e.pageIndex;
    this.loadData();
  }

  async delete(procurementitemtype: Procurementitemtype): Promise<void>{
    const dialogRef = this.dialog.open(DeleteConfirmDialogComponent, {
      width: '300px',
      data: {message: procurementitemtype.code+ ' - ' + procurementitemtype.name}
    });

    dialogRef.afterClosed().subscribe( async result => {
      if (!result) { return; }
      try {
        await this.procurementitemtypeService.delete(procurementitemtype.id);
      }catch (e) {
        this.snackBar.open(e.error.message, null, {duration: 4000});
      }
      this.loadData();
    });
  }
}
