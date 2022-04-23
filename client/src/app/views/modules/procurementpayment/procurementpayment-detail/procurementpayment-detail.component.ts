import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {MatDialog} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import {DeleteConfirmDialogComponent} from '../../../../shared/views/delete-confirm-dialog/delete-confirm-dialog.component';
import {LoggedUser} from '../../../../shared/logged-user';
import {UsecaseList} from '../../../../usecase-list';
import {AbstractComponent} from '../../../../shared/abstract-component';
import {Procurementpayment} from '../../../../entities/procurementpayment';
import {ProcurementpaymentService} from '../../../../services/procurementpayment.service';

@Component({
  selector: 'app-procurementpayment-detail',
  templateUrl: './procurementpayment-detail.component.html',
  styleUrls: ['./procurementpayment-detail.component.scss']
})
export class ProcurementpaymentDetailComponent extends AbstractComponent implements OnInit {

  procurementpayment: Procurementpayment;
  selectedId: number;

  constructor(
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private router: Router,
    private procurementpaymentService: ProcurementpaymentService,
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
      data: {message: this.procurementpayment.code}
    });

    dialogRef.afterClosed().subscribe( async result => {
      if (!result) { return; }

      try {
        await this.procurementpaymentService.delete(this.selectedId);
        await this.router.navigateByUrl('/procurementpayments');
      }catch (e) {
        this.snackBar.open(e.error.message, null, {duration: 4000});
      }
    });
  }

  async loadData(): Promise<any> {
    this.updatePrivileges();
    this.procurementpayment = await this.procurementpaymentService.get(this.selectedId);
  }

  updatePrivileges(): any {
    this.privilege.add = LoggedUser.can(UsecaseList.ADD_PROCUREMENTPAYMENT);
    this.privilege.showAll = LoggedUser.can(UsecaseList.SHOW_ALL_PROCUREMENTPAYMENTS);
    this.privilege.showOne = LoggedUser.can(UsecaseList.SHOW_PROCUREMENTPAYMENT_DETAILS);
    this.privilege.delete = LoggedUser.can(UsecaseList.DELETE_PROCUREMENTPAYMENT);
    this.privilege.update = LoggedUser.can(UsecaseList.UPDATE_PROCUREMENTPAYMENT);
  }
}
