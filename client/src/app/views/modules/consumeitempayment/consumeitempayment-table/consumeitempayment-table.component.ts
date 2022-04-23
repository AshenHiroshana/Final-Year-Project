import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';
import {MatDialog} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import {PageRequest} from '../../../../shared/page-request';
import {LoggedUser} from '../../../../shared/logged-user';
import {UsecaseList} from '../../../../usecase-list';
import {DeleteConfirmDialogComponent} from '../../../../shared/views/delete-confirm-dialog/delete-confirm-dialog.component';
import {AbstractComponent} from '../../../../shared/abstract-component';
import {Consumeitempayment, ConsumeitempaymentDataPage} from '../../../../entities/consumeitempayment';
import {ConsumeitempaymentService} from '../../../../services/consumeitempayment.service';
import {Paymenttype} from '../../../../entities/paymenttype';
import {Paymentstatus} from '../../../../entities/paymentstatus';
import {PaymenttypeService} from '../../../../services/paymenttype.service';
import {Consumeitempurchase} from '../../../../entities/consumeitempurchase';
import {PaymentstatusService} from '../../../../services/paymentstatus.service';
import {ConsumeitempurchaseService} from '../../../../services/consumeitempurchase.service';
import {DateHelper} from "../../../../shared/date-helper";

@Component({
  selector: 'app-consumeitempayment-table',
  templateUrl: './consumeitempayment-table.component.html',
  styleUrls: ['./consumeitempayment-table.component.scss']
})
export class ConsumeitempaymentTableComponent extends AbstractComponent implements OnInit {

  consumeitempaymentDataPage: ConsumeitempaymentDataPage;
  displayedColumns: string[] = [];
  pageSize = 5;
  pageIndex = 0;

  consumeitempurchases: Consumeitempurchase[] = [];
  paymentstatuses: Paymentstatus[] = [];
  paymenttypes: Paymenttype[] = [];

  consumeitempurchaseField = new FormControl();
  paymentstatusField = new FormControl();
  paymenttypeField = new FormControl();

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


  constructor(
    private consumeitempurchaseService: ConsumeitempurchaseService,
    private paymentstatusService: PaymentstatusService,
    private paymenttypeService: PaymenttypeService,
    private consumeitempaymentService: ConsumeitempaymentService,
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

    pageRequest.addSearchCriteria('consumeitempurchase', this.consumeitempurchaseField.value);
    pageRequest.addSearchCriteria('paymentstatus', this.paymentstatusField.value);
    pageRequest.addSearchCriteria('paymenttype', this.paymenttypeField.value);

    pageRequest.addSearchCriteria('startDate', DateHelper.getDateAsString(this.startField.value));
    pageRequest.addSearchCriteria('endtDate', DateHelper.getDateAsString(this.endField.value));

    this.consumeitempurchaseService.getAllBasic(new PageRequest()).then((consumeitempurchaseDataPage) => {
      this.consumeitempurchases = consumeitempurchaseDataPage.content;
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

    this.consumeitempaymentService.getAll(pageRequest).then((page: ConsumeitempaymentDataPage) => {
      this.consumeitempaymentDataPage = page;
    }).catch( e => {
      console.log(e);
      this.snackBar.open('Something is wrong', null, {duration: 2000});
    });
  }

  updatePrivileges(): any {
    this.privilege.add = LoggedUser.can(UsecaseList.ADD_CONSUMEITEMPAYMENT);
    this.privilege.showAll = LoggedUser.can(UsecaseList.SHOW_ALL_CONSUMEITEMPAYMENTS);
    this.privilege.showOne = LoggedUser.can(UsecaseList.SHOW_CONSUMEITEMPAYMENT_DETAILS);
    this.privilege.delete = LoggedUser.can(UsecaseList.DELETE_CONSUMEITEMPAYMENT);
    this.privilege.update = LoggedUser.can(UsecaseList.UPDATE_CONSUMEITEMPAYMENT);
  }

  setDisplayedColumns(): void{
    this.displayedColumns = ['code', 'consumeitempurchase', 'date', 'amount', 'paymentstatus', 'paymenttype'];

    if (this.privilege.delete) { this.displayedColumns.push('delete-col'); }
    if (this.privilege.update) { this.displayedColumns.push('update-col'); }
    if (this.privilege.showOne) { this.displayedColumns.push('more-col'); }
  }

  paginate(e): void{
    this.pageSize = e.pageSize;
    this.pageIndex = e.pageIndex;
    this.loadData();
  }

  async delete(consumeitempayment: Consumeitempayment): Promise<void>{
    const dialogRef = this.dialog.open(DeleteConfirmDialogComponent, {
      width: '300px',
      data: {message: consumeitempayment.code}
    });

    dialogRef.afterClosed().subscribe( async result => {
      if (!result) { return; }
      try {
        await this.consumeitempaymentService.delete(consumeitempayment.id);
      }catch (e) {
        this.snackBar.open(e.error.message, null, {duration: 4000});
      }
      this.loadData();
    });
  }
}
