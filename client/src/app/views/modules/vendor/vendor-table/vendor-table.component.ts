import {Component, OnInit} from '@angular/core';
import {FormControl} from '@angular/forms';
import {MatDialog} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import {PageRequest} from '../../../../shared/page-request';
import {LoggedUser} from '../../../../shared/logged-user';
import {UsecaseList} from '../../../../usecase-list';
import {DeleteConfirmDialogComponent} from '../../../../shared/views/delete-confirm-dialog/delete-confirm-dialog.component';
import {AbstractComponent} from '../../../../shared/abstract-component';
import {Vendor, VendorDataPage} from '../../../../entities/vendor';
import {VendorService} from '../../../../services/vendor.service';
import {Vendortype} from '../../../../entities/vendortype';
import {Vendorstatus} from '../../../../entities/vendorstatus';
import {VendortypeService} from '../../../../services/vendortype.service';
import {VendorstatusService} from '../../../../services/vendorstatus.service';

@Component({
  selector: 'app-vendor-table',
  templateUrl: './vendor-table.component.html',
  styleUrls: ['./vendor-table.component.scss']
})
export class VendorTableComponent extends AbstractComponent implements OnInit {

  vendorDataPage: VendorDataPage;
  displayedColumns: string[] = [];
  pageSize = 5;
  pageIndex = 0;

  vendortypes: Vendortype[] = [];
  vendorstatuses: Vendorstatus[] = [];

  codeField = new FormControl();
  nameField = new FormControl();
  vendortypeField = new FormControl();
  vendorstatusField = new FormControl();

  constructor(
    private vendortypeService: VendortypeService,
    private vendorstatusService: VendorstatusService,
    private vendorService: VendorService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {
    super();
  }

  async ngOnInit(): Promise<void> {
    this.vendortypeService.getAll().then((vendortypes) => {
      this.vendortypes = vendortypes;
    }).catch((e) => {
      console.log(e);
      this.snackBar.open('Something is wrong', null, {duration: 2000});
    });
    this.vendorstatusService.getAll().then((vendorstatuses) => {
      this.vendorstatuses = vendorstatuses;
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
    pageRequest.addSearchCriteria('name', this.nameField.value);
    pageRequest.addSearchCriteria('vendortype', this.vendortypeField.value);
    pageRequest.addSearchCriteria('vendorstatus', this.vendorstatusField.value);


    this.vendorService.getAll(pageRequest).then((page: VendorDataPage) => {
      this.vendorDataPage = page;
    }).catch( e => {
      console.log(e);
      this.snackBar.open('Something is wrong', null, {duration: 2000});
    });
  }

  updatePrivileges(): any {
    this.privilege.add = LoggedUser.can(UsecaseList.ADD_VENDOR);
    this.privilege.showAll = LoggedUser.can(UsecaseList.SHOW_ALL_VENDORS);
    this.privilege.showOne = LoggedUser.can(UsecaseList.SHOW_VENDOR_DETAILS);
    this.privilege.delete = LoggedUser.can(UsecaseList.DELETE_VENDOR);
    this.privilege.update = LoggedUser.can(UsecaseList.UPDATE_VENDOR);
  }

  setDisplayedColumns(): void{
    this.displayedColumns = ['code', 'name', 'primarycontact', 'vendortype', 'vendorstatus'];

    if (this.privilege.delete) { this.displayedColumns.push('delete-col'); }
    if (this.privilege.update) { this.displayedColumns.push('update-col'); }
    if (this.privilege.showOne) { this.displayedColumns.push('more-col'); }
  }

  paginate(e): void{
    this.pageSize = e.pageSize;
    this.pageIndex = e.pageIndex;
    this.loadData();
  }

  async delete(vendor: Vendor): Promise<void>{
    const dialogRef = this.dialog.open(DeleteConfirmDialogComponent, {
      width: '300px',
      data: {message: vendor.code + ' - ' + vendor.name}
    });

    dialogRef.afterClosed().subscribe( async result => {
      if (!result) { return; }
      try {
        await this.vendorService.delete(vendor.id);
      }catch (e) {
        this.snackBar.open(e.error.message, null, {duration: 4000});
      }
      this.loadData();
    });
  }
}
