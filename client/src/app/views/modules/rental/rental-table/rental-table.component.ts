import {Component, OnInit} from '@angular/core';
import {FormControl} from '@angular/forms';
import {MatDialog} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import {PageRequest} from '../../../../shared/page-request';
import {LoggedUser} from '../../../../shared/logged-user';
import {UsecaseList} from '../../../../usecase-list';
import {DeleteConfirmDialogComponent} from '../../../../shared/views/delete-confirm-dialog/delete-confirm-dialog.component';
import {AbstractComponent} from '../../../../shared/abstract-component';
import {Rental, RentalDataPage} from '../../../../entities/rental';
import {RentalService} from '../../../../services/rental.service';
import {Branch} from '../../../../entities/branch';
import {Rentalstatus} from '../../../../entities/rentalstatus';
import {BranchService} from '../../../../services/branch.service';
import {RentalstatusService} from '../../../../services/rentalstatus.service';

@Component({
  selector: 'app-rental-table',
  templateUrl: './rental-table.component.html',
  styleUrls: ['./rental-table.component.scss']
})
export class RentalTableComponent extends AbstractComponent implements OnInit {

  rentalDataPage: RentalDataPage;
  displayedColumns: string[] = [];
  pageSize = 5;
  pageIndex = 0;

  branches: Branch[] = [];
  rentalstatuses: Rentalstatus[] = [];

  codeField = new FormControl();
  branchField = new FormControl();
  rentalstatusField = new FormControl();

  constructor(
    private branchService: BranchService,
    private rentalstatusService: RentalstatusService,
    private rentalService: RentalService,
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
    pageRequest.addSearchCriteria('rentalstatus', this.rentalstatusField.value);

    this.branchService.getAllBasic(new PageRequest()).then((branchDataPage) => {
      this.branches = branchDataPage.content;
    }).catch((e) => {
      console.log(e);
      this.snackBar.open('Something is wrong', null, {duration: 2000});
    });
    this.rentalstatusService.getAll().then((rentalstatuses) => {
      this.rentalstatuses = rentalstatuses;
    }).catch((e) => {
      console.log(e);
      this.snackBar.open('Something is wrong', null, {duration: 2000});
    });

    this.rentalService.getAll(pageRequest).then((page: RentalDataPage) => {
      this.rentalDataPage = page;
    }).catch( e => {
      console.log(e);
      this.snackBar.open('Something is wrong', null, {duration: 2000});
    });
  }

  updatePrivileges(): any {
    this.privilege.add = LoggedUser.can(UsecaseList.ADD_RENTAL);
    this.privilege.showAll = LoggedUser.can(UsecaseList.SHOW_ALL_RENTALS);
    this.privilege.showOne = LoggedUser.can(UsecaseList.SHOW_RENTAL_DETAILS);
    this.privilege.delete = LoggedUser.can(UsecaseList.DELETE_RENTAL);
    this.privilege.update = LoggedUser.can(UsecaseList.UPDATE_RENTAL);
  }

  setDisplayedColumns(): void{
    this.displayedColumns = ['code', 'branch', 'name', 'date', 'rentalstatus'];

    if (this.privilege.delete) { this.displayedColumns.push('delete-col'); }
    if (this.privilege.update) { this.displayedColumns.push('update-col'); }
    if (this.privilege.showOne) { this.displayedColumns.push('more-col'); }
  }

  paginate(e): void{
    this.pageSize = e.pageSize;
    this.pageIndex = e.pageIndex;
    this.loadData();
  }

  async delete(rental: Rental): Promise<void>{
    const dialogRef = this.dialog.open(DeleteConfirmDialogComponent, {
      width: '300px',
      data: {message: rental.code + ' - ' + rental.name}
    });

    dialogRef.afterClosed().subscribe( async result => {
      if (!result) { return; }
      try {
        await this.rentalService.delete(rental.id);
      }catch (e) {
        this.snackBar.open(e.error.message, null, {duration: 4000});
      }
      this.loadData();
    });
  }
}
