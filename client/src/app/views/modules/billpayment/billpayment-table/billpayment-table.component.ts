import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';
import {MatDialog} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import {PageRequest} from '../../../../shared/page-request';
import {LoggedUser} from '../../../../shared/logged-user';
import {UsecaseList} from '../../../../usecase-list';
import {DeleteConfirmDialogComponent} from '../../../../shared/views/delete-confirm-dialog/delete-confirm-dialog.component';
import {AbstractComponent} from '../../../../shared/abstract-component';
import {Billpayment, BillpaymentDataPage} from '../../../../entities/billpayment';
import {BillpaymentService} from '../../../../services/billpayment.service';
import {Branch} from '../../../../entities/branch';
import {BranchService} from '../../../../services/branch.service';
import {Billpaymenttype} from '../../../../entities/billpaymenttype';
import {BillpaymenttypeService} from '../../../../services/billpaymenttype.service';
import {DateHelper} from "../../../../shared/date-helper";

@Component({
  selector: 'app-billpayment-table',
  templateUrl: './billpayment-table.component.html',
  styleUrls: ['./billpayment-table.component.scss']
})
export class BillpaymentTableComponent extends AbstractComponent implements OnInit {

  billpaymentDataPage: BillpaymentDataPage;
  displayedColumns: string[] = [];
  pageSize = 5;
  pageIndex = 0;

  billpaymenttypes: Billpaymenttype[] = [];
  branches: Branch[] = [];

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
  billpaymenttypeField = new FormControl();
  branchField = new FormControl();

  constructor(
    private billpaymenttypeService: BillpaymenttypeService,
    private branchService: BranchService,
    private billpaymentService: BillpaymentService,
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
    pageRequest.addSearchCriteria('billpaymenttype', this.billpaymenttypeField.value);
    pageRequest.addSearchCriteria('branch', this.branchField.value);


    pageRequest.addSearchCriteria('startDate', DateHelper.getDateAsString(this.startField.value));
    pageRequest.addSearchCriteria('endtDate', DateHelper.getDateAsString(this.endField.value));



    this.billpaymenttypeService.getAll().then((billpaymenttypes) => {
      this.billpaymenttypes = billpaymenttypes;
    }).catch((e) => {
      console.log(e);
      this.snackBar.open('Something is wrong', null, {duration: 2000});
    });
    this.branchService.getAllBasic(new PageRequest()).then((branchDataPage) => {
      this.branches = branchDataPage.content;
    }).catch((e) => {
      console.log(e);
      this.snackBar.open('Something is wrong', null, {duration: 2000});
    });

    this.billpaymentService.getAll(pageRequest).then((page: BillpaymentDataPage) => {
      this.billpaymentDataPage = page;
    }).catch( e => {
      console.log(e);
      this.snackBar.open('Something is wrong', null, {duration: 2000});
    });
  }

  updatePrivileges(): any {
    this.privilege.add = LoggedUser.can(UsecaseList.ADD_BILLPAYMENT);
    this.privilege.showAll = LoggedUser.can(UsecaseList.SHOW_ALL_BILLPAYMENTS);
    this.privilege.showOne = LoggedUser.can(UsecaseList.SHOW_BILLPAYMENT_DETAILS);
    this.privilege.delete = LoggedUser.can(UsecaseList.DELETE_BILLPAYMENT);
    this.privilege.update = LoggedUser.can(UsecaseList.UPDATE_BILLPAYMENT);
  }

  setDisplayedColumns(): void{
    this.displayedColumns = ['photo' , 'code', 'billpaymenttype', 'branch', 'amount', 'date'];

    if (this.privilege.delete) { this.displayedColumns.push('delete-col'); }
    if (this.privilege.update) { this.displayedColumns.push('update-col'); }
    if (this.privilege.showOne) { this.displayedColumns.push('more-col'); }
  }

  paginate(e): void{
    this.pageSize = e.pageSize;
    this.pageIndex = e.pageIndex;
    this.loadData();
  }

  async delete(billpayment: Billpayment): Promise<void>{
    const dialogRef = this.dialog.open(DeleteConfirmDialogComponent, {
      width: '300px',
      data: {message: billpayment.code}
    });

    dialogRef.afterClosed().subscribe( async result => {
      if (!result) { return; }
      try {
        await this.billpaymentService.delete(billpayment.id);
      }catch (e) {
        this.snackBar.open(e.error.message, null, {duration: 4000});
      }
      this.loadData();
    });
  }
}
