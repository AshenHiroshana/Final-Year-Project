import {Component, OnInit} from '@angular/core';
import {FormControl} from '@angular/forms';
import {MatDialog} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import {PageRequest} from '../../../../shared/page-request';
import {LoggedUser} from '../../../../shared/logged-user';
import {UsecaseList} from '../../../../usecase-list';
import {DeleteConfirmDialogComponent} from '../../../../shared/views/delete-confirm-dialog/delete-confirm-dialog.component';
import {AbstractComponent} from '../../../../shared/abstract-component';
import {Consumeitem, ConsumeitemDataPage} from '../../../../entities/consumeitem';
import {ConsumeitemService} from '../../../../services/consumeitem.service';
import {Consumeitemcategory} from '../../../../entities/consumeitemcategory';
import {ConsumeitemcategoryService} from '../../../../services/consumeitemcategory.service';

@Component({
  selector: 'app-consumeitem-table',
  templateUrl: './consumeitem-table.component.html',
  styleUrls: ['./consumeitem-table.component.scss']
})
export class ConsumeitemTableComponent extends AbstractComponent implements OnInit {

  consumeitemDataPage: ConsumeitemDataPage;
  displayedColumns: string[] = [];
  pageSize = 5;
  pageIndex = 0;

  consumeitemcategories: Consumeitemcategory[] = [];

  codeField = new FormControl();
  consumeitemcategoryField = new FormControl();
  nameField = new FormControl();

  constructor(
    private consumeitemcategoryService: ConsumeitemcategoryService,
    private consumeitemService: ConsumeitemService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {
    super();
  }

  async ngOnInit(): Promise<void> {
    this.consumeitemcategoryService.getAll().then((consumeitemcategories) => {
      this.consumeitemcategories = consumeitemcategories;
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
    pageRequest.addSearchCriteria('consumeitemcategory', this.consumeitemcategoryField.value);
    pageRequest.addSearchCriteria('name', this.nameField.value);


    this.consumeitemService.getAll(pageRequest).then((page: ConsumeitemDataPage) => {
      this.consumeitemDataPage = page;
    }).catch( e => {
      console.log(e);
      this.snackBar.open('Something is wrong', null, {duration: 2000});
    });
  }

  updatePrivileges(): any {
    this.privilege.add = LoggedUser.can(UsecaseList.ADD_CONSUMEITEM);
    this.privilege.showAll = LoggedUser.can(UsecaseList.SHOW_ALL_CONSUMEITEMS);
    this.privilege.showOne = LoggedUser.can(UsecaseList.SHOW_CONSUMEITEM_DETAILS);
    this.privilege.delete = LoggedUser.can(UsecaseList.DELETE_CONSUMEITEM);
    this.privilege.update = LoggedUser.can(UsecaseList.UPDATE_CONSUMEITEM);
  }

  setDisplayedColumns(): void{
    this.displayedColumns = [ 'photo', 'code', 'consumeitemcategory', 'name'];

    if (this.privilege.delete) { this.displayedColumns.push('delete-col'); }
    if (this.privilege.update) { this.displayedColumns.push('update-col'); }
    if (this.privilege.showOne) { this.displayedColumns.push('more-col'); }
  }

  paginate(e): void{
    this.pageSize = e.pageSize;
    this.pageIndex = e.pageIndex;
    this.loadData();
  }

  async delete(consumeitem: Consumeitem): Promise<void>{
    const dialogRef = this.dialog.open(DeleteConfirmDialogComponent, {
      width: '300px',
      data: {message: consumeitem.code + ' - ' + consumeitem.name}
    });

    dialogRef.afterClosed().subscribe( async result => {
      if (!result) { return; }
      try {
        await this.consumeitemService.delete(consumeitem.id);
      }catch (e) {
        this.snackBar.open(e.error.message, null, {duration: 4000});
      }
      this.loadData();
    });
  }
}
