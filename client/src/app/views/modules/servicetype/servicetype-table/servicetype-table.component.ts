import {Component, OnInit} from '@angular/core';
import {FormControl} from '@angular/forms';
import {MatDialog} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import {PageRequest} from '../../../../shared/page-request';
import {LoggedUser} from '../../../../shared/logged-user';
import {UsecaseList} from '../../../../usecase-list';
import {DeleteConfirmDialogComponent} from '../../../../shared/views/delete-confirm-dialog/delete-confirm-dialog.component';
import {AbstractComponent} from '../../../../shared/abstract-component';
import {Servicetype, ServicetypeDataPage} from '../../../../entities/servicetype';
import {ServicetypeService} from '../../../../services/servicetype.service';

@Component({
  selector: 'app-servicetype-table',
  templateUrl: './servicetype-table.component.html',
  styleUrls: ['./servicetype-table.component.scss']
})
export class ServicetypeTableComponent extends AbstractComponent implements OnInit {

  servicetypeDataPage: ServicetypeDataPage;
  displayedColumns: string[] = [];
  pageSize = 5;
  pageIndex = 0;


  codeField = new FormControl();
  nameField = new FormControl();

  constructor(
    private servicetypeService: ServicetypeService,
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
    pageRequest.addSearchCriteria('name', this.nameField.value);


    this.servicetypeService.getAll(pageRequest).then((page: ServicetypeDataPage) => {
      this.servicetypeDataPage = page;
    }).catch( e => {
      console.log(e);
      this.snackBar.open('Something is wrong', null, {duration: 2000});
    });
  }

  updatePrivileges(): any {
    this.privilege.add = LoggedUser.can(UsecaseList.ADD_SERVICETYPE);
    this.privilege.showAll = LoggedUser.can(UsecaseList.SHOW_ALL_SERVICETYPES);
    this.privilege.showOne = LoggedUser.can(UsecaseList.SHOW_SERVICETYPE_DETAILS);
    this.privilege.delete = LoggedUser.can(UsecaseList.DELETE_SERVICETYPE);
    this.privilege.update = LoggedUser.can(UsecaseList.UPDATE_SERVICETYPE);
  }

  setDisplayedColumns(): void{
    this.displayedColumns = ['code', 'name'];

    if (this.privilege.delete) { this.displayedColumns.push('delete-col'); }
    if (this.privilege.update) { this.displayedColumns.push('update-col'); }
    if (this.privilege.showOne) { this.displayedColumns.push('more-col'); }
  }

  paginate(e): void{
    this.pageSize = e.pageSize;
    this.pageIndex = e.pageIndex;
    this.loadData();
  }

  async delete(servicetype: Servicetype): Promise<void>{
    const dialogRef = this.dialog.open(DeleteConfirmDialogComponent, {
      width: '300px',
      data: {message: servicetype.code + ' - ' + servicetype.name}
    });

    dialogRef.afterClosed().subscribe( async result => {
      if (!result) { return; }
      try {
        await this.servicetypeService.delete(servicetype.id);
      }catch (e) {
        this.snackBar.open(e.error.message, null, {duration: 4000});
      }
      this.loadData();
    });
  }
}
