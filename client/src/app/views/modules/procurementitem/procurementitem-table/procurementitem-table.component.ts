import {Component, OnInit} from '@angular/core';
import {FormControl} from '@angular/forms';
import {MatDialog} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import {PageRequest} from '../../../../shared/page-request';
import {LoggedUser} from '../../../../shared/logged-user';
import {UsecaseList} from '../../../../usecase-list';
import {DeleteConfirmDialogComponent} from '../../../../shared/views/delete-confirm-dialog/delete-confirm-dialog.component';
import {AbstractComponent} from '../../../../shared/abstract-component';
import {Procurementitem, ProcurementitemDataPage} from '../../../../entities/procurementitem';
import {ProcurementitemService} from '../../../../services/procurementitem.service';
import {Vendor} from '../../../../entities/vendor';
import {VendorService} from '../../../../services/vendor.service';
import {Procurementitemtype} from '../../../../entities/procurementitemtype';
import {Procurementitemstatus} from '../../../../entities/procurementitemstatus';
import {ProcurementitemtypeService} from '../../../../services/procurementitemtype.service';
import {ProcurementitemstatusService} from '../../../../services/procurementitemstatus.service';

@Component({
  selector: 'app-procurementitem-table',
  templateUrl: './procurementitem-table.component.html',
  styleUrls: ['./procurementitem-table.component.scss']
})
export class ProcurementitemTableComponent extends AbstractComponent implements OnInit {

  procurementitemDataPage: ProcurementitemDataPage;
  displayedColumns: string[] = [];
  pageSize = 5;
  pageIndex = 0;

  vendors: Vendor[] = [];
  procurementitemtypes: Procurementitemtype[] = [];
  procurementitemstatuses: Procurementitemstatus[] = [];

  vendorField = new FormControl();
  procurementitemtypeField = new FormControl();
  procurementitemstatusField = new FormControl();

  constructor(
    private vendorService: VendorService,
    private procurementitemtypeService: ProcurementitemtypeService,
    private procurementitemstatusService: ProcurementitemstatusService,
    private procurementitemService: ProcurementitemService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {
    super();
  }

  async ngOnInit(): Promise<void> {
    this.procurementitemstatusService.getAll().then((procurementitemstatuses) => {
      this.procurementitemstatuses = procurementitemstatuses;
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

    pageRequest.addSearchCriteria('vendor', this.vendorField.value);
    pageRequest.addSearchCriteria('procurementitemtype', this.procurementitemtypeField.value);
    pageRequest.addSearchCriteria('procurementitemstatus', this.procurementitemstatusField.value);

    this.vendorService.getAllBasic(new PageRequest()).then((vendorDataPage) => {
      this.vendors = vendorDataPage.content;
    }).catch((e) => {
      console.log(e);
      this.snackBar.open('Something is wrong', null, {duration: 2000});
    });
    this.procurementitemtypeService.getAllBasic(new PageRequest()).then((procurementitemtypeDataPage) => {
      this.procurementitemtypes = procurementitemtypeDataPage.content;
    }).catch((e) => {
      console.log(e);
      this.snackBar.open('Something is wrong', null, {duration: 2000});
    });

    this.procurementitemService.getAll(pageRequest).then((page: ProcurementitemDataPage) => {
      this.procurementitemDataPage = page;
    }).catch( e => {
      console.log(e);
      this.snackBar.open('Something is wrong', null, {duration: 2000});
    });
  }

  updatePrivileges(): any {
    this.privilege.add = LoggedUser.can(UsecaseList.ADD_PROCUREMENTITEM);
    this.privilege.showAll = LoggedUser.can(UsecaseList.SHOW_ALL_PROCUREMENTITEMS);
    this.privilege.showOne = LoggedUser.can(UsecaseList.SHOW_PROCUREMENTITEM_DETAILS);
    this.privilege.delete = LoggedUser.can(UsecaseList.DELETE_PROCUREMENTITEM);
    this.privilege.update = LoggedUser.can(UsecaseList.UPDATE_PROCUREMENTITEM);
  }

  setDisplayedColumns(): void{
    this.displayedColumns = ['code', 'vendor', 'procurementitemtype', 'itemphoto', 'dopurchased', 'procurementitemstatus'];

    if (this.privilege.delete) { this.displayedColumns.push('delete-col'); }
    if (this.privilege.update) { this.displayedColumns.push('update-col'); }
    if (this.privilege.showOne) { this.displayedColumns.push('more-col'); }
  }

  paginate(e): void{
    this.pageSize = e.pageSize;
    this.pageIndex = e.pageIndex;
    this.loadData();
  }

  async delete(procurementitem: Procurementitem): Promise<void>{
    const dialogRef = this.dialog.open(DeleteConfirmDialogComponent, {
      width: '300px',
      data: {message: procurementitem.code}
    });

    dialogRef.afterClosed().subscribe( async result => {
      if (!result) { return; }
      try {
        await this.procurementitemService.delete(procurementitem.id);
      }catch (e) {
        this.snackBar.open(e.error.message, null, {duration: 4000});
      }
      this.loadData();
    });
  }
}
