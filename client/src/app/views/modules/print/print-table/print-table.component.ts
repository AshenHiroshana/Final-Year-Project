import {Component, OnInit} from '@angular/core';
import {FormControl} from '@angular/forms';
import {MatDialog} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import {PageRequest} from '../../../../shared/page-request';
import {LoggedUser} from '../../../../shared/logged-user';
import {UsecaseList} from '../../../../usecase-list';
import {DeleteConfirmDialogComponent} from '../../../../shared/views/delete-confirm-dialog/delete-confirm-dialog.component';
import {AbstractComponent} from '../../../../shared/abstract-component';
import {Print, PrintDataPage} from '../../../../entities/print';
import {PrintService} from '../../../../services/print.service';
import {Printorder} from '../../../../entities/printorder';
import {Printstatus} from '../../../../entities/printstatus';
import {PrintorderService} from '../../../../services/printorder.service';
import {PrintstatusService} from '../../../../services/printstatus.service';

@Component({
  selector: 'app-print-table',
  templateUrl: './print-table.component.html',
  styleUrls: ['./print-table.component.scss']
})
export class PrintTableComponent extends AbstractComponent implements OnInit {

  printDataPage: PrintDataPage;
  displayedColumns: string[] = [];
  pageSize = 5;
  pageIndex = 0;

  printorders: Printorder[] = [];
  printstatuses: Printstatus[] = [];

  codeField = new FormControl();
  printorderField = new FormControl();
  printstatusField = new FormControl();

  constructor(
    private printorderService: PrintorderService,
    private printstatusService: PrintstatusService,
    private printService: PrintService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {
    super();
  }

  async ngOnInit(): Promise<void> {
    this.printstatusService.getAll().then((printstatuses) => {
      this.printstatuses = printstatuses;
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
    pageRequest.addSearchCriteria('printorder', this.printorderField.value);
    pageRequest.addSearchCriteria('printstatus', this.printstatusField.value);

    this.printorderService.getAllBasic(new PageRequest()).then((printorderDataPage) => {
      this.printorders = printorderDataPage.content;
    }).catch((e) => {
      console.log(e);
      this.snackBar.open('Something is wrong', null, {duration: 2000});
    });

    this.printService.getAll(pageRequest).then((page: PrintDataPage) => {
      this.printDataPage = page;
    }).catch( e => {
      console.log(e);
      this.snackBar.open('Something is wrong', null, {duration: 2000});
    });
  }

  updatePrivileges(): any {
    this.privilege.add = LoggedUser.can(UsecaseList.ADD_PRINT);
    this.privilege.showAll = LoggedUser.can(UsecaseList.SHOW_ALL_PRINTS);
    this.privilege.showOne = LoggedUser.can(UsecaseList.SHOW_PRINT_DETAILS);
    this.privilege.delete = LoggedUser.can(UsecaseList.DELETE_PRINT);
    this.privilege.update = LoggedUser.can(UsecaseList.UPDATE_PRINT);
  }

  setDisplayedColumns(): void{
    this.displayedColumns = ['code', 'printorder', 'sdate', 'edate', 'printstatus'];

    if (this.privilege.delete) { this.displayedColumns.push('delete-col'); }
    if (this.privilege.update) { this.displayedColumns.push('update-col'); }
    if (this.privilege.showOne) { this.displayedColumns.push('more-col'); }
  }

  paginate(e): void{
    this.pageSize = e.pageSize;
    this.pageIndex = e.pageIndex;
    this.loadData();
  }

  async delete(print: Print): Promise<void>{
    const dialogRef = this.dialog.open(DeleteConfirmDialogComponent, {
      width: '300px',
      data: {message: print.code}
    });

    dialogRef.afterClosed().subscribe( async result => {
      if (!result) { return; }
      try {
        await this.printService.delete(print.id);
      }catch (e) {
        this.snackBar.open(e.error.message, null, {duration: 4000});
      }
      this.loadData();
    });
  }
}
