import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';
import {MatDialog} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import {PageRequest} from '../../../../shared/page-request';
import {LoggedUser} from '../../../../shared/logged-user';
import {UsecaseList} from '../../../../usecase-list';
import {DeleteConfirmDialogComponent} from '../../../../shared/views/delete-confirm-dialog/delete-confirm-dialog.component';
import {AbstractComponent} from '../../../../shared/abstract-component';
import {Service, ServiceDataPage} from '../../../../entities/service';
import {ServiceService} from '../../../../services/service.service';
import {Branch} from '../../../../entities/branch';
import {Vendor} from '../../../../entities/vendor';
import {Servicetype} from '../../../../entities/servicetype';
import {Servicestatus} from '../../../../entities/servicestatus';
import {BranchService} from '../../../../services/branch.service';
import {VendorService} from '../../../../services/vendor.service';
import {ServicetypeService} from '../../../../services/servicetype.service';
import {ServicestatusService} from '../../../../services/servicestatus.service';
import {DateHelper} from "../../../../shared/date-helper";

@Component({
  selector: 'app-service-table',
  templateUrl: './service-table.component.html',
  styleUrls: ['./service-table.component.scss']
})
export class ServiceTableComponent extends AbstractComponent implements OnInit {

  serviceDataPage: ServiceDataPage;
  displayedColumns: string[] = [];
  pageSize = 5;
  pageIndex = 0;

  branches: Branch[] = [];
  vendors: Vendor[] = [];
  servicetypes: Servicetype[] = [];
  servicestatuses: Servicestatus[] = [];

  branchField = new FormControl();
  vendorField = new FormControl();
  servicetypeField = new FormControl();
  servicestatusField = new FormControl();

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
    private vendorService: VendorService,
    private servicetypeService: ServicetypeService,
    private servicestatusService: ServicestatusService,
    private serviceService: ServiceService,
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

    pageRequest.addSearchCriteria('branch', this.branchField.value);
    pageRequest.addSearchCriteria('vendor', this.vendorField.value);
    pageRequest.addSearchCriteria('servicetype', this.servicetypeField.value);
    pageRequest.addSearchCriteria('servicestatus', this.servicestatusField.value);

    pageRequest.addSearchCriteria('startDate', DateHelper.getDateAsString(this.startField.value));
    pageRequest.addSearchCriteria('endtDate', DateHelper.getDateAsString(this.endField.value));

    this.branchService.getAllBasic(new PageRequest()).then((branchDataPage) => {
      this.branches = branchDataPage.content;
    }).catch((e) => {
      console.log(e);
      this.snackBar.open('Something is wrong', null, {duration: 2000});
    });
    this.vendorService.getAllBasic(new PageRequest()).then((vendorDataPage) => {
      this.vendors = vendorDataPage.content;
    }).catch((e) => {
      console.log(e);
      this.snackBar.open('Something is wrong', null, {duration: 2000});
    });
    this.servicetypeService.getAllBasic(new PageRequest()).then((servicetypeDataPage) => {
      this.servicetypes = servicetypeDataPage.content;
    }).catch((e) => {
      console.log(e);
      this.snackBar.open('Something is wrong', null, {duration: 2000});
    });
    this.servicestatusService.getAll().then((servicestatuses) => {
      this.servicestatuses = servicestatuses;
    }).catch((e) => {
      console.log(e);
      this.snackBar.open('Something is wrong', null, {duration: 2000});
    });

    this.serviceService.getAll(pageRequest).then((page: ServiceDataPage) => {
      this.serviceDataPage = page;
    }).catch( e => {
      console.log(e);
      this.snackBar.open('Something is wrong', null, {duration: 2000});
    });
  }

  updatePrivileges(): any {
    this.privilege.add = LoggedUser.can(UsecaseList.ADD_SERVICE);
    this.privilege.showAll = LoggedUser.can(UsecaseList.SHOW_ALL_SERVICES);
    this.privilege.showOne = LoggedUser.can(UsecaseList.SHOW_SERVICE_DETAILS);
    this.privilege.delete = LoggedUser.can(UsecaseList.DELETE_SERVICE);
    this.privilege.update = LoggedUser.can(UsecaseList.UPDATE_SERVICE);
  }

  setDisplayedColumns(): void{
    this.displayedColumns = ['code', 'branch', 'vendor', 'servicetype', 'title', 'servicestatus'];

    if (this.privilege.delete) { this.displayedColumns.push('delete-col'); }
    if (this.privilege.update) { this.displayedColumns.push('update-col'); }
    if (this.privilege.showOne) { this.displayedColumns.push('more-col'); }
  }

  paginate(e): void{
    this.pageSize = e.pageSize;
    this.pageIndex = e.pageIndex;
    this.loadData();
  }

  async delete(service: Service): Promise<void>{
    const dialogRef = this.dialog.open(DeleteConfirmDialogComponent, {
      width: '300px',
      data: {message: service.code}
    });

    dialogRef.afterClosed().subscribe( async result => {
      if (!result) { return; }
      try {
        await this.serviceService.delete(service.id);
      }catch (e) {
        this.snackBar.open(e.error.message, null, {duration: 4000});
      }
      this.loadData();
    });
  }
}
