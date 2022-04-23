import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';
import {MatDialog} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import {PageRequest} from '../../../../shared/page-request';
import {LoggedUser} from '../../../../shared/logged-user';
import {UsecaseList} from '../../../../usecase-list';
import {DeleteConfirmDialogComponent} from '../../../../shared/views/delete-confirm-dialog/delete-confirm-dialog.component';
import {AbstractComponent} from '../../../../shared/abstract-component';
import {Printorder, PrintorderDataPage} from '../../../../entities/printorder';
import {PrintorderService} from '../../../../services/printorder.service';
import {Branch} from '../../../../entities/branch';
import {Material} from '../../../../entities/material';
import {BranchService} from '../../../../services/branch.service';
import {MaterialService} from '../../../../services/material.service';
import {Printorderstatus} from '../../../../entities/printorderstatus';
import {PrintorderstatusService} from '../../../../services/printorderstatus.service';
import {DateHelper} from "../../../../shared/date-helper";

@Component({
  selector: 'app-printorder-table',
  templateUrl: './printorder-table.component.html',
  styleUrls: ['./printorder-table.component.scss']
})
export class PrintorderTableComponent extends AbstractComponent implements OnInit {

  printorderDataPage: PrintorderDataPage;
  displayedColumns: string[] = [];
  pageSize = 5;
  pageIndex = 0;

  branches: Branch[] = [];
  materials: Material[] = [];
  printorderstatuses: Printorderstatus[] = [];

  codeField = new FormControl();
  branchField = new FormControl();
  materialField = new FormControl();
  printorderstatusField = new FormControl();

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
    private branchService: BranchService,
    private materialService: MaterialService,
    private printorderstatusService: PrintorderstatusService,
    private printorderService: PrintorderService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {
    super();
  }

  async ngOnInit(): Promise<void> {
    this.printorderstatusService.getAll().then((printorderstatuses) => {
      this.printorderstatuses = printorderstatuses;
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
    pageRequest.addSearchCriteria('branch', this.branchField.value);
    pageRequest.addSearchCriteria('material', this.materialField.value);
    pageRequest.addSearchCriteria('printorderstatus', this.printorderstatusField.value);

    pageRequest.addSearchCriteria('startDate', DateHelper.getDateAsString(this.startField.value));
    pageRequest.addSearchCriteria('endtDate', DateHelper.getDateAsString(this.endField.value));

    this.branchService.getAllBasic(new PageRequest()).then((branchDataPage) => {
      this.branches = branchDataPage.content;
    }).catch((e) => {
      console.log(e);
      this.snackBar.open('Something is wrong', null, {duration: 2000});
    });
    this.materialService.getAllBasic(new PageRequest()).then((materialDataPage) => {
      this.materials = materialDataPage.content;
    }).catch((e) => {
      console.log(e);
      this.snackBar.open('Something is wrong', null, {duration: 2000});
    });

    this.printorderService.getAll(pageRequest).then((page: PrintorderDataPage) => {
      this.printorderDataPage = page;
    }).catch( e => {
      console.log(e);
      this.snackBar.open('Something is wrong', null, {duration: 2000});
    });
  }

  updatePrivileges(): any {
    this.privilege.add = LoggedUser.can(UsecaseList.ADD_PRINTORDER);
    this.privilege.showAll = LoggedUser.can(UsecaseList.SHOW_ALL_PRINTORDERS);
    this.privilege.showOne = LoggedUser.can(UsecaseList.SHOW_PRINTORDER_DETAILS);
    this.privilege.delete = LoggedUser.can(UsecaseList.DELETE_PRINTORDER);
    this.privilege.update = LoggedUser.can(UsecaseList.UPDATE_PRINTORDER);
  }

  setDisplayedColumns(): void{
    this.displayedColumns = ['code', 'branch', 'material', 'requireddate', 'printorderstatus'];

    if (this.privilege.delete) { this.displayedColumns.push('delete-col'); }
    if (this.privilege.update) { this.displayedColumns.push('update-col'); }
    if (this.privilege.showOne) { this.displayedColumns.push('more-col'); }
  }

  paginate(e): void{
    this.pageSize = e.pageSize;
    this.pageIndex = e.pageIndex;
    this.loadData();
  }

  async delete(printorder: Printorder): Promise<void>{
    const dialogRef = this.dialog.open(DeleteConfirmDialogComponent, {
      width: '300px',
      data: {message: printorder.code}
    });

    dialogRef.afterClosed().subscribe( async result => {
      if (!result) { return; }
      try {
        await this.printorderService.delete(printorder.id);
      }catch (e) {
        this.snackBar.open(e.error.message, null, {duration: 4000});
      }
      this.loadData();
    });
  }
}
