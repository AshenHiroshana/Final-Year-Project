import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';
import {MatDialog} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import {PageRequest} from '../../../../shared/page-request';
import {LoggedUser} from '../../../../shared/logged-user';
import {UsecaseList} from '../../../../usecase-list';
import {DeleteConfirmDialogComponent} from '../../../../shared/views/delete-confirm-dialog/delete-confirm-dialog.component';
import {AbstractComponent} from '../../../../shared/abstract-component';
import {Servicepayment, ServicepaymentDataPage} from '../../../../entities/servicepayment';
import {ServicepaymentService} from '../../../../services/servicepayment.service';
import {Service} from '../../../../entities/service';
import {Paymenttype} from '../../../../entities/paymenttype';
import {Paymentstatus} from '../../../../entities/paymentstatus';
import {ServiceService} from '../../../../services/service.service';
import {PaymenttypeService} from '../../../../services/paymenttype.service';
import {PaymentstatusService} from '../../../../services/paymentstatus.service';
import {DateHelper} from "../../../../shared/date-helper";

@Component({
  selector: 'app-servicepayment-table',
  templateUrl: './servicepayment-table.component.html',
  styleUrls: ['./servicepayment-table.component.scss']
})
export class ServicepaymentTableComponent extends AbstractComponent implements OnInit {

  servicepaymentDataPage: ServicepaymentDataPage;
  displayedColumns: string[] = [];
  pageSize = 5;
  pageIndex = 0;

  services: Service[] = [];
  paymentstatuses: Paymentstatus[] = [];
  paymenttypes: Paymenttype[] = [];

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

  codeField = new FormControl();
  serviceField = new FormControl();
  paymentstatusField = new FormControl();
  paymenttypeField = new FormControl();

  constructor(
    private serviceService: ServiceService,
    private paymentstatusService: PaymentstatusService,
    private paymenttypeService: PaymenttypeService,
    private servicepaymentService: ServicepaymentService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {
    super();
  }

  async ngOnInit(): Promise<void> {
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

    pageRequest.addSearchCriteria('startDate', DateHelper.getDateAsString(this.startField.value));
    pageRequest.addSearchCriteria('endtDate', DateHelper.getDateAsString(this.endField.value));

    this.serviceService.getAllBasic(new PageRequest()).then((serviceDataPage) => {
      this.services = serviceDataPage.content;
    }).catch((e) => {
      console.log(e);
      this.snackBar.open('Something is wrong', null, {duration: 2000});
    });

    this.servicepaymentService.getAll(pageRequest).then((page: ServicepaymentDataPage) => {
      this.servicepaymentDataPage = page;
    }).catch( e => {
      console.log(e);
      this.snackBar.open('Something is wrong', null, {duration: 2000});
    });
  }

  updatePrivileges(): any {
    this.privilege.add = LoggedUser.can(UsecaseList.ADD_SERVICEPAYMENT);
    this.privilege.showAll = LoggedUser.can(UsecaseList.SHOW_ALL_SERVICEPAYMENTS);
    this.privilege.showOne = LoggedUser.can(UsecaseList.SHOW_SERVICEPAYMENT_DETAILS);
    this.privilege.delete = LoggedUser.can(UsecaseList.DELETE_SERVICEPAYMENT);
    this.privilege.update = LoggedUser.can(UsecaseList.UPDATE_SERVICEPAYMENT);
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

  async delete(servicepayment: Servicepayment): Promise<void>{
    const dialogRef = this.dialog.open(DeleteConfirmDialogComponent, {
      width: '300px',
      data: {message: servicepayment.code}
    });

    dialogRef.afterClosed().subscribe( async result => {
      if (!result) { return; }
      try {
        await this.servicepaymentService.delete(servicepayment.id);
      }catch (e) {
        this.snackBar.open(e.error.message, null, {duration: 4000});
      }
      this.loadData();
    });
  }
}
