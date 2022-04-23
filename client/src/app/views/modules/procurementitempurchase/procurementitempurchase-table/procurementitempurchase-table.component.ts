import {Component, OnInit} from '@angular/core';
import {FormControl} from '@angular/forms';
import {MatDialog} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import {PageRequest} from '../../../../shared/page-request';
import {LoggedUser} from '../../../../shared/logged-user';
import {UsecaseList} from '../../../../usecase-list';
import {DeleteConfirmDialogComponent} from '../../../../shared/views/delete-confirm-dialog/delete-confirm-dialog.component';
import {AbstractComponent} from '../../../../shared/abstract-component';
import {Procurementitempurchase, ProcurementitempurchaseDataPage} from '../../../../entities/procurementitempurchase';
import {ProcurementitempurchaseService} from '../../../../services/procurementitempurchase.service';
import {Vendor} from '../../../../entities/vendor';
import {VendorService} from '../../../../services/vendor.service';

@Component({
  selector: 'app-procurementitempurchase-table',
  templateUrl: './procurementitempurchase-table.component.html',
  styleUrls: ['./procurementitempurchase-table.component.scss']
})
export class ProcurementitempurchaseTableComponent extends AbstractComponent implements OnInit {

  procurementitempurchaseDataPage: ProcurementitempurchaseDataPage;
  displayedColumns: string[] = [];
  pageSize = 5;
  pageIndex = 0;

  vendors: Vendor[] = [];

  codeField = new FormControl();
  vendorField = new FormControl();

  constructor(
    private vendorService: VendorService,
    private procurementitempurchaseService: ProcurementitempurchaseService,
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
    pageRequest.addSearchCriteria('vendor', this.vendorField.value);

    this.vendorService.getAllBasic(new PageRequest()).then((vendorDataPage) => {
      this.vendors = vendorDataPage.content;
    }).catch((e) => {
      console.log(e);
      this.snackBar.open('Something is wrong', null, {duration: 2000});
    });

    this.procurementitempurchaseService.getAll(pageRequest).then((page: ProcurementitempurchaseDataPage) => {
      this.procurementitempurchaseDataPage = page;
    }).catch( e => {
      console.log(e);
      this.snackBar.open('Something is wrong', null, {duration: 2000});
    });
  }

  updatePrivileges(): any {
    this.privilege.add = LoggedUser.can(UsecaseList.ADD_PROCUREMENTITEMPURCHASE);
    this.privilege.showAll = LoggedUser.can(UsecaseList.SHOW_ALL_PROCUREMENTITEMPURCHASES);
    this.privilege.showOne = LoggedUser.can(UsecaseList.SHOW_PROCUREMENTITEMPURCHASE_DETAILS);
    this.privilege.delete = LoggedUser.can(UsecaseList.DELETE_PROCUREMENTITEMPURCHASE);
    this.privilege.update = LoggedUser.can(UsecaseList.UPDATE_PROCUREMENTITEMPURCHASE);
  }

  setDisplayedColumns(): void{
    this.displayedColumns = ['code', 'vendor', 'date', 'total', 'balance'];

    if (this.privilege.delete) { this.displayedColumns.push('delete-col'); }
    if (this.privilege.update) { this.displayedColumns.push('update-col'); }
    if (this.privilege.showOne) { this.displayedColumns.push('more-col'); }
  }

  paginate(e): void{
    this.pageSize = e.pageSize;
    this.pageIndex = e.pageIndex;
    this.loadData();
  }

  async delete(procurementitempurchase: Procurementitempurchase): Promise<void>{
    const dialogRef = this.dialog.open(DeleteConfirmDialogComponent, {
      width: '300px',
      data: {message: procurementitempurchase.code}
    });

    dialogRef.afterClosed().subscribe( async result => {
      if (!result) { return; }
      try {
        await this.procurementitempurchaseService.delete(procurementitempurchase.id);
      }catch (e) {
        this.snackBar.open(e.error.message, null, {duration: 4000});
      }
      this.loadData();
    });
  }
}
