import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {MatDialog} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import {DeleteConfirmDialogComponent} from '../../../../shared/views/delete-confirm-dialog/delete-confirm-dialog.component';
import {LoggedUser} from '../../../../shared/logged-user';
import {UsecaseList} from '../../../../usecase-list';
import {AbstractComponent} from '../../../../shared/abstract-component';
import {Servicepayment} from '../../../../entities/servicepayment';
import {ServicepaymentService} from '../../../../services/servicepayment.service';

@Component({
  selector: 'app-servicepayment-detail',
  templateUrl: './servicepayment-detail.component.html',
  styleUrls: ['./servicepayment-detail.component.scss']
})
export class ServicepaymentDetailComponent extends AbstractComponent implements OnInit {

  servicepayment: Servicepayment;
  selectedId: number;

  constructor(
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private router: Router,
    private servicepaymentService: ServicepaymentService,
    private snackBar: MatSnackBar
  ) {
    super();
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe( async (params) => {
      this.selectedId = + params.get('id');
      try{
        await this.loadData();
      } finally {
        this.initialLoaded();
        this.refreshData();
      }
    });
  }

  async delete(): Promise<void>{
    const dialogRef = this.dialog.open(DeleteConfirmDialogComponent, {
      width: '300px',
      data: {message: this.servicepayment.code}
    });

    dialogRef.afterClosed().subscribe( async result => {
      if (!result) { return; }

      try {
        await this.servicepaymentService.delete(this.selectedId);
        await this.router.navigateByUrl('/servicepayments');
      }catch (e) {
        this.snackBar.open(e.error.message, null, {duration: 4000});
      }
    });
  }

  async loadData(): Promise<any> {
    this.updatePrivileges();
    this.servicepayment = await this.servicepaymentService.get(this.selectedId);
  }

  updatePrivileges(): any {
    this.privilege.add = LoggedUser.can(UsecaseList.ADD_SERVICEPAYMENT);
    this.privilege.showAll = LoggedUser.can(UsecaseList.SHOW_ALL_SERVICEPAYMENTS);
    this.privilege.showOne = LoggedUser.can(UsecaseList.SHOW_SERVICEPAYMENT_DETAILS);
    this.privilege.delete = LoggedUser.can(UsecaseList.DELETE_SERVICEPAYMENT);
    this.privilege.update = LoggedUser.can(UsecaseList.UPDATE_SERVICEPAYMENT);
  }
}
