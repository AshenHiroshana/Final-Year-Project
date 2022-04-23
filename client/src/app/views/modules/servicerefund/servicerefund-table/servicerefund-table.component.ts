import {Component, OnInit} from '@angular/core';
import {FormControl} from '@angular/forms';
import {MatDialog} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import {PageRequest} from '../../../../shared/page-request';
import {LoggedUser} from '../../../../shared/logged-user';
import {UsecaseList} from '../../../../usecase-list';
import {DeleteConfirmDialogComponent} from '../../../../shared/views/delete-confirm-dialog/delete-confirm-dialog.component';
import {AbstractComponent} from '../../../../shared/abstract-component';
import {Servicerefund, ServicerefundDataPage} from '../../../../entities/servicerefund';
import {ServicerefundService} from '../../../../services/servicerefund.service';
import {Service} from '../../../../entities/service';
import {Paymenttype} from '../../../../entities/paymenttype';
import {Paymentstatus} from '../../../../entities/paymentstatus';
import {ServiceService} from '../../../../services/service.service';
import {PaymenttypeService} from '../../../../services/paymenttype.service';
import {PaymentstatusService} from '../../../../services/paymentstatus.service';

@Component({
  selector: 'app-servicerefund-table',
  templateUrl: './servicerefund-table.component.html',
  styleUrls: ['./servicerefund-table.component.scss']
})
export class ServicerefundTableComponent extends AbstractComponent implements OnInit {

  servicerefundDataPage: ServicerefundDataPage;
  displayedColumns: string[] = [];
  pageSize = 5;
  pageIndex = 0;

  services: Service[] = [];
  paymentstatuses: Paymentstatus[] = [];
  paymenttypes: Paymenttype[] = [];

  codeField = new FormControl();
  serviceField = new FormControl();
  paymentstatusField = new FormControl();
  paymenttypeField = new FormControl();

  constructor(
    private serviceService: ServiceService,
    private paymentstatusService: PaymentstatusService,
    private paymenttypeService: PaymenttypeService,
    private servicerefundService: ServicerefundService,
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
    pageRequest.addSearchCriteria('service', this.serviceField.value);
    pageRequest.addSearchCriteria('paymentstatus', this.paymentstatusField.value);
    pageRequest.addSearchCriteria('paymenttype', this.paymenttypeField.value);

    this.serviceService.getAllBasic(new PageRequest()).then((serviceDataPage) => {
      this.services = serviceDataPage.content;
    }).catch((e) => {
      console.log(e);
      this.snackBar.open('Something is wrong', null, {duration: 2000});
    });
    this.paymentstatusService.getAll().then((paymentstatuses) => {
      this.paymentstatuses = paymentstatuses;
    }).catch((e) => {
      console.log(e);
      this.snackBar.open('Something is wrong', null, {duration: 2000});
    });
    this.paymenttypeService.getAll().then((paymenttypes) => {
      this.paymenttypes = paymenttypes;
    }).catch((e) => {
      console.log(e);
      this.snackBar.open('Something is wrong', null, {duration: 2000});
    });

    this.servicerefundService.getAll(pageRequest).then((page: ServicerefundDataPage) => {
      this.servicerefundDataPage = page;
    }).catch( e => {
      console.log(e);
      this.snackBar.open('Something is wrong', null, {duration: 2000});
    });
  }

  updatePrivileges(): any {
    this.privilege.add = LoggedUser.can(UsecaseList.ADD_SERVICEREFUND);
    this.privilege.showAll = LoggedUser.can(UsecaseList.SHOW_ALL_SERVICEREFUNDS);
    this.privilege.showOne = LoggedUser.can(UsecaseList.SHOW_SERVICEREFUND_DETAILS);
    this.privilege.delete = LoggedUser.can(UsecaseList.DELETE_SERVICEREFUND);
    this.privilege.update = LoggedUser.can(UsecaseList.UPDATE_SERVICEREFUND);
  }

  setDisplayedColumns(): void{
    this.displayedColumns = ['code', 'service', 'date', 'amount', 'paymentstatus', 'paymenttype'];

    if (this.privilege.delete) { this.displayedColumns.push('delete-col'); }
    if (this.privilege.update) { this.displayedColumns.push('update-col'); }
    if (this.privilege.showOne) { this.displayedColumns.push('more-col'); }
  }

  paginate(e): void{
    this.pageSize = e.pageSize;
    this.pageIndex = e.pageIndex;
    this.loadData();
  }

  async delete(servicerefund: Servicerefund): Promise<void>{
    const dialogRef = this.dialog.open(DeleteConfirmDialogComponent, {
      width: '300px',
      data: {message: servicerefund.code}
    });

    dialogRef.afterClosed().subscribe( async result => {
      if (!result) { return; }
      try {
        await this.servicerefundService.delete(servicerefund.id);
      }catch (e) {
        this.snackBar.open(e.error.message, null, {duration: 4000});
      }
      this.loadData();
    });
  }
}
