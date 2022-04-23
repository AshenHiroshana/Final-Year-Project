import {Component, OnInit} from '@angular/core';
import {FormControl} from '@angular/forms';
import {MatDialog} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import {PageRequest} from '../../../../shared/page-request';
import {LoggedUser} from '../../../../shared/logged-user';
import {UsecaseList} from '../../../../usecase-list';
import {DeleteConfirmDialogComponent} from '../../../../shared/views/delete-confirm-dialog/delete-confirm-dialog.component';
import {AbstractComponent} from '../../../../shared/abstract-component';
import {Procurementrefund, ProcurementrefundDataPage} from '../../../../entities/procurementrefund';
import {ProcurementrefundService} from '../../../../services/procurementrefund.service';
import {Paymenttype} from '../../../../entities/paymenttype';
import {Paymentstatus} from '../../../../entities/paymentstatus';
import {PaymenttypeService} from '../../../../services/paymenttype.service';
import {PaymentstatusService} from '../../../../services/paymentstatus.service';
import {Procurementitempurchase} from '../../../../entities/procurementitempurchase';
import {ProcurementitempurchaseService} from '../../../../services/procurementitempurchase.service';

@Component({
  selector: 'app-procurementrefund-table',
  templateUrl: './procurementrefund-table.component.html',
  styleUrls: ['./procurementrefund-table.component.scss']
})
export class ProcurementrefundTableComponent extends AbstractComponent implements OnInit {

  procurementrefundDataPage: ProcurementrefundDataPage;
  displayedColumns: string[] = [];
  pageSize = 5;
  pageIndex = 0;

  procurementitempurchases: Procurementitempurchase[] = [];
  paymentstatuses: Paymentstatus[] = [];
  paymenttypes: Paymenttype[] = [];

  codeField = new FormControl();
  procurementitempurchaseField = new FormControl();
  paymentstatusField = new FormControl();
  paymenttypeField = new FormControl();

  constructor(
    private procurementitempurchaseService: ProcurementitempurchaseService,
    private paymentstatusService: PaymentstatusService,
    private paymenttypeService: PaymenttypeService,
    private procurementrefundService: ProcurementrefundService,
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
    pageRequest.addSearchCriteria('procurementitempurchase', this.procurementitempurchaseField.value);
    pageRequest.addSearchCriteria('paymentstatus', this.paymentstatusField.value);
    pageRequest.addSearchCriteria('paymenttype', this.paymenttypeField.value);

    this.procurementitempurchaseService.getAllBasic(new PageRequest()).then((procurementitempurchaseDataPage) => {
      this.procurementitempurchases = procurementitempurchaseDataPage.content;
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

    this.procurementrefundService.getAll(pageRequest).then((page: ProcurementrefundDataPage) => {
      this.procurementrefundDataPage = page;
    }).catch( e => {
      console.log(e);
      this.snackBar.open('Something is wrong', null, {duration: 2000});
    });
  }

  updatePrivileges(): any {
    this.privilege.add = LoggedUser.can(UsecaseList.ADD_PROCUREMENTREFUND);
    this.privilege.showAll = LoggedUser.can(UsecaseList.SHOW_ALL_PROCUREMENTREFUNDS);
    this.privilege.showOne = LoggedUser.can(UsecaseList.SHOW_PROCUREMENTREFUND_DETAILS);
    this.privilege.delete = LoggedUser.can(UsecaseList.DELETE_PROCUREMENTREFUND);
    this.privilege.update = LoggedUser.can(UsecaseList.UPDATE_PROCUREMENTREFUND);
  }

  setDisplayedColumns(): void{
    this.displayedColumns = ['code', 'procurementitempurchase', 'date', 'amount', 'paymentstatus', 'paymenttype', 'done', 'reject'];

    if (this.privilege.delete) { this.displayedColumns.push('delete-col'); }
    if (this.privilege.showOne) { this.displayedColumns.push('more-col'); }
  }

  paginate(e): void{
    this.pageSize = e.pageSize;
    this.pageIndex = e.pageIndex;
    this.loadData();
  }

  async delete(procurementrefund: Procurementrefund): Promise<void>{
    const dialogRef = this.dialog.open(DeleteConfirmDialogComponent, {
      width: '300px',
      data: {message: procurementrefund.code}
    });

    dialogRef.afterClosed().subscribe( async result => {
      if (!result) { return; }
      try {
        await this.procurementrefundService.delete(procurementrefund.id);
      }catch (e) {
        this.snackBar.open(e.error.message, null, {duration: 4000});
      }
      this.loadData();
    });
  }

  async paumentDone(ele: any): Promise<void> {
    ele.paymentstatus = 1;
    await this.procurementrefundService.update(ele.id, ele);
  }

  async paumentReject(ele: any): Promise<void> {
    ele.paymentstatus = 3;
    await this.procurementrefundService.update(ele.id, ele);
  }
}
