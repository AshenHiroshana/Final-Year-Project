import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';
import {MatDialog} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import {PageRequest} from '../../../../shared/page-request';
import {LoggedUser} from '../../../../shared/logged-user';
import {UsecaseList} from '../../../../usecase-list';
import {DeleteConfirmDialogComponent} from '../../../../shared/views/delete-confirm-dialog/delete-confirm-dialog.component';
import {AbstractComponent} from '../../../../shared/abstract-component';
import {Consumedistribution, ConsumedistributionDataPage} from '../../../../entities/consumedistribution';
import {ConsumedistributionService} from '../../../../services/consumedistribution.service';
import {Branch} from '../../../../entities/branch';
import {BranchService} from '../../../../services/branch.service';
import {Consumedistributionstatus} from '../../../../entities/consumedistributionstatus';
import {ConsumedistributionstatusService} from '../../../../services/consumedistributionstatus.service';
import {DateHelper} from "../../../../shared/date-helper";

@Component({
  selector: 'app-consumedistribution-table',
  templateUrl: './consumedistribution-table.component.html',
  styleUrls: ['./consumedistribution-table.component.scss']
})
export class ConsumedistributionTableComponent extends AbstractComponent implements OnInit {

  consumedistributionDataPage: ConsumedistributionDataPage;
  displayedColumns: string[] = [];
  pageSize = 5;
  pageIndex = 0;

  branches: Branch[] = [];
  consumedistributionstatuses: Consumedistributionstatus[] = [];

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
  branchField = new FormControl();
  consumedistributionstatusField = new FormControl();

  constructor(
    private branchService: BranchService,
    private consumedistributionstatusService: ConsumedistributionstatusService,
    private consumedistributionService: ConsumedistributionService,
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
    pageRequest.addSearchCriteria('branch', this.branchField.value);
    pageRequest.addSearchCriteria('consumedistributionstatus', this.consumedistributionstatusField.value);


    pageRequest.addSearchCriteria('startDate', DateHelper.getDateAsString(this.startField.value));
    pageRequest.addSearchCriteria('endtDate', DateHelper.getDateAsString(this.endField.value));



    this.branchService.getAllBasic(new PageRequest()).then((branchDataPage) => {
      this.branches = branchDataPage.content;
    }).catch((e) => {
      console.log(e);
      this.snackBar.open('Something is wrong', null, {duration: 2000});
    });
    this.consumedistributionstatusService.getAll().then((consumedistributionstatuses) => {
      this.consumedistributionstatuses = consumedistributionstatuses;
    }).catch((e) => {
      console.log(e);
      this.snackBar.open('Something is wrong', null, {duration: 2000});
    });

    this.consumedistributionService.getAll(pageRequest).then((page: ConsumedistributionDataPage) => {
      this.consumedistributionDataPage = page;
    }).catch( e => {
      console.log(e);
      this.snackBar.open('Something is wrong', null, {duration: 2000});
    });
  }

  updatePrivileges(): any {
    this.privilege.add = LoggedUser.can(UsecaseList.ADD_CONSUMEDISTRIBUTION);
    this.privilege.showAll = LoggedUser.can(UsecaseList.SHOW_ALL_CONSUMEDISTRIBUTIONS);
    this.privilege.showOne = LoggedUser.can(UsecaseList.SHOW_CONSUMEDISTRIBUTION_DETAILS);
    this.privilege.delete = LoggedUser.can(UsecaseList.DELETE_CONSUMEDISTRIBUTION);
    this.privilege.update = LoggedUser.can(UsecaseList.UPDATE_CONSUMEDISTRIBUTION);
  }

  setDisplayedColumns(): void{
    this.displayedColumns = ['code', 'branch', 'date', 'consumedistributionstatus'];

    if (this.privilege.delete) { this.displayedColumns.push('delete-col'); }
    if (this.privilege.update) { this.displayedColumns.push('update-col'); }
    if (this.privilege.showOne) { this.displayedColumns.push('more-col'); }
  }

  paginate(e): void{
    this.pageSize = e.pageSize;
    this.pageIndex = e.pageIndex;
    this.loadData();
  }

  async delete(consumedistribution: Consumedistribution): Promise<void>{
    const dialogRef = this.dialog.open(DeleteConfirmDialogComponent, {
      width: '300px',
      data: {message: consumedistribution.code}
    });

    dialogRef.afterClosed().subscribe( async result => {
      if (!result) { return; }
      try {
        await this.consumedistributionService.delete(consumedistribution.id);
      }catch (e) {
        this.snackBar.open(e.error.message, null, {duration: 4000});
      }
      this.loadData();
    });
  }
}
