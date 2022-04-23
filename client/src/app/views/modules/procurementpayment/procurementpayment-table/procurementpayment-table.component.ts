import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';
import {MatDialog} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import {PageRequest} from '../../../../shared/page-request';
import {LoggedUser} from '../../../../shared/logged-user';
import {UsecaseList} from '../../../../usecase-list';
import {DeleteConfirmDialogComponent} from '../../../../shared/views/delete-confirm-dialog/delete-confirm-dialog.component';
import {AbstractComponent} from '../../../../shared/abstract-component';
import {Procurementpayment, ProcurementpaymentDataPage} from '../../../../entities/procurementpayment';
import {ProcurementpaymentService} from '../../../../services/procurementpayment.service';
import {Paymenttype} from '../../../../entities/paymenttype';
import {Paymentstatus} from '../../../../entities/paymentstatus';
import {PaymenttypeService} from '../../../../services/paymenttype.service';
import {PaymentstatusService} from '../../../../services/paymentstatus.service';
import {Procurementitempurchase} from '../../../../entities/procurementitempurchase';
import {ProcurementitempurchaseService} from '../../../../services/procurementitempurchase.service';
import {DateHelper} from "../../../../shared/date-helper";

@Component({
  selector: 'app-procurementpayment-table',
  templateUrl: './procurementpayment-table.component.html',
  styleUrls: ['./procurementpayment-table.component.scss']
})
export class ProcurementpaymentTableComponent extends AbstractComponent implements OnInit {

  procurementpaymentDataPage: ProcurementpaymentDataPage;
  displayedColumns: string[] = [];
  pageSize = 5;
  pageIndex = 0;

  range  = new FormGroup({
    start: new FormControl(),
    end: new FormControl()
  });


  get startField(): FormControl{
    return this.range.controls.start as FormControl;
  }

  get endField(): FormControl{
    return this.range.controls.end as FormControl;
  }


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
    private procurementpaymentService: ProcurementpaymentService,
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

    pageRequest.addSearchCriteria('startDate', DateHelper.getDateAsString(this.startField.value));
    pageRequest.addSearchCriteria('endtDate', DateHelper.getDateAsString(this.endField.value));


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

    this.procurementpaymentService.getAll(pageRequest).then((page: ProcurementpaymentDataPage) => {
      this.procurementpaymentDataPage = page;
    }).catch( e => {
      console.log(e);
      this.snackBar.open('Something is wrong', null, {duration: 2000});
    });
  }

  updatePrivileges(): any {
    this.privilege.add = LoggedUser.can(UsecaseList.ADD_PROCUREMENTPAYMENT);
    this.privilege.showAll = LoggedUser.can(UsecaseList.SHOW_ALL_PROCUREMENTPAYMENTS);
    this.privilege.showOne = LoggedUser.can(UsecaseList.SHOW_PROCUREMENTPAYMENT_DETAILS);
    this.privilege.delete = LoggedUser.can(UsecaseList.DELETE_PROCUREMENTPAYMENT);
    this.privilege.update = LoggedUser.can(UsecaseList.UPDATE_PROCUREMENTPAYMENT);
  }

  setDisplayedColumns(): void{
    this.displayedColumns = ['code', 'procurementitempurchase', 'date', 'amount', 'paymentstatus', 'paymenttype'];

    if (this.privilege.delete) { this.displayedColumns.push('delete-col'); }
    if (this.privilege.update) { this.displayedColumns.push('update-col'); }
    if (this.privilege.showOne) { this.displayedColumns.push('more-col'); }
  }

  paginate(e): void{
    this.pageSize = e.pageSize;
    this.pageIndex = e.pageIndex;
    this.loadData();
  }

  async delete(procurementpayment: Procurementpayment): Promise<void>{
    const dialogRef = this.dialog.open(DeleteConfirmDialogComponent, {
      width: '300px',
      data: {message: procurementpayment.code}
    });

    dialogRef.afterClosed().subscribe( async result => {
      if (!result) { return; }
      try {
        await this.procurementpaymentService.delete(procurementpayment.id);
      }catch (e) {
        this.snackBar.open(e.error.message, null, {duration: 4000});
      }
      this.loadData();
    });
  }
}
