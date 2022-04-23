import {Component, OnInit} from '@angular/core';
import {FormControl} from '@angular/forms';
import {MatDialog} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import {PageRequest} from '../../../../shared/page-request';
import {LoggedUser} from '../../../../shared/logged-user';
import {UsecaseList} from '../../../../usecase-list';
import {DeleteConfirmDialogComponent} from '../../../../shared/views/delete-confirm-dialog/delete-confirm-dialog.component';
import {AbstractComponent} from '../../../../shared/abstract-component';
import {Auction, AuctionDataPage} from '../../../../entities/auction';
import {AuctionService} from '../../../../services/auction.service';

@Component({
  selector: 'app-auction-table',
  templateUrl: './auction-table.component.html',
  styleUrls: ['./auction-table.component.scss']
})
export class AuctionTableComponent extends AbstractComponent implements OnInit {

  auctionDataPage: AuctionDataPage;
  displayedColumns: string[] = [];
  pageSize = 5;
  pageIndex = 0;


  codeField = new FormControl();
  buyerField = new FormControl();

  constructor(
    private auctionService: AuctionService,
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
    pageRequest.addSearchCriteria('buyer', this.buyerField.value);


    this.auctionService.getAll(pageRequest).then((page: AuctionDataPage) => {
      this.auctionDataPage = page;
    }).catch( e => {
      console.log(e);
      this.snackBar.open('Something is wrong', null, {duration: 2000});
    });
  }

  updatePrivileges(): any {
    this.privilege.add = LoggedUser.can(UsecaseList.ADD_AUCTION);
    this.privilege.showAll = LoggedUser.can(UsecaseList.SHOW_ALL_AUCTIONS);
    this.privilege.showOne = LoggedUser.can(UsecaseList.SHOW_AUCTION_DETAILS);
    this.privilege.delete = LoggedUser.can(UsecaseList.DELETE_AUCTION);
    this.privilege.update = LoggedUser.can(UsecaseList.UPDATE_AUCTION);
  }

  setDisplayedColumns(): void{
    this.displayedColumns = ['code', 'buyer', 'procurementitem', 'amount', 'date'];

    if (this.privilege.delete) { this.displayedColumns.push('delete-col'); }
    if (this.privilege.update) { this.displayedColumns.push('update-col'); }
    if (this.privilege.showOne) { this.displayedColumns.push('more-col'); }
  }

  paginate(e): void{
    this.pageSize = e.pageSize;
    this.pageIndex = e.pageIndex;
    this.loadData();
  }

  async delete(auction: Auction): Promise<void>{
    const dialogRef = this.dialog.open(DeleteConfirmDialogComponent, {
      width: '300px',
      data: {message: auction.code}
    });

    dialogRef.afterClosed().subscribe( async result => {
      if (!result) { return; }
      try {
        await this.auctionService.delete(auction.id);
      }catch (e) {
        this.snackBar.open(e.error.message, null, {duration: 4000});
      }
      this.loadData();
    });
  }
}
