import {Component, OnInit} from '@angular/core';
import {FormControl} from '@angular/forms';
import {MatDialog} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import {PageRequest} from '../../../../shared/page-request';
import {LoggedUser} from '../../../../shared/logged-user';
import {UsecaseList} from '../../../../usecase-list';
import {DeleteConfirmDialogComponent} from '../../../../shared/views/delete-confirm-dialog/delete-confirm-dialog.component';
import {AbstractComponent} from '../../../../shared/abstract-component';
import {Consumeitempurchase, ConsumeitempurchaseDataPage} from '../../../../entities/consumeitempurchase';
import {ConsumeitempurchaseService} from '../../../../services/consumeitempurchase.service';
import {Vendor} from '../../../../entities/vendor';
import {VendorService} from '../../../../services/vendor.service';

@Component({
  selector: 'app-consumeitempurchase-table',
  templateUrl: './consumeitempurchase-table.component.html',
  styleUrls: ['./consumeitempurchase-table.component.scss']
})
export class ConsumeitempurchaseTableComponent extends AbstractComponent implements OnInit {

  consumeitempurchaseDataPage: ConsumeitempurchaseDataPage;
  displayedColumns: string[] = [];
  pageSize = 5;
  pageIndex = 0;

  vendors: Vendor[] = [];

  codeField = new FormControl();
  vendorField = new FormControl();

  constructor(
    private vendorService: VendorService,
    private consumeitempurchaseService: ConsumeitempurchaseService,
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

    this.consumeitempurchaseService.getAll(pageRequest).then((page: ConsumeitempurchaseDataPage) => {
      this.consumeitempurchaseDataPage = page;
    }).catch( e => {
      console.log(e);
      this.snackBar.open('Something is wrong', null, {duration: 2000});
    });
  }

  updatePrivileges(): any {
    this.privilege.add = LoggedUser.can(UsecaseList.ADD_CONSUMEITEMPURCHASE);
    this.privilege.showAll = LoggedUser.can(UsecaseList.SHOW_ALL_CONSUMEITEMPURCHASES);
    this.privilege.showOne = LoggedUser.can(UsecaseList.SHOW_CONSUMEITEMPURCHASE_DETAILS);
    this.privilege.delete = LoggedUser.can(UsecaseList.DELETE_CONSUMEITEMPURCHASE);
    this.privilege.update = LoggedUser.can(UsecaseList.UPDATE_CONSUMEITEMPURCHASE);
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

  async delete(consumeitempurchase: Consumeitempurchase): Promise<void>{
    const dialogRef = this.dialog.open(DeleteConfirmDialogComponent, {
      width: '300px',
      data: {message: consumeitempurchase.code}
    });

    dialogRef.afterClosed().subscribe( async result => {
      if (!result) { return; }
      try {
        await this.consumeitempurchaseService.delete(consumeitempurchase.id);
      }catch (e) {
        this.snackBar.open(e.error.message, null, {duration: 4000});
      }
      this.loadData();
    });
  }
}
