import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {MatDialog} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import {DeleteConfirmDialogComponent} from '../../../../shared/views/delete-confirm-dialog/delete-confirm-dialog.component';
import {LoggedUser} from '../../../../shared/logged-user';
import {UsecaseList} from '../../../../usecase-list';
import {AbstractComponent} from '../../../../shared/abstract-component';
import {Billpayment} from '../../../../entities/billpayment';
import {BillpaymentService} from '../../../../services/billpayment.service';

@Component({
  selector: 'app-billpayment-detail',
  templateUrl: './billpayment-detail.component.html',
  styleUrls: ['./billpayment-detail.component.scss']
})
export class BillpaymentDetailComponent extends AbstractComponent implements OnInit {

  billpayment: Billpayment;
  selectedId: number;

  constructor(
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private router: Router,
    private billpaymentService: BillpaymentService,
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
      data: {message: this.billpayment.code}
    });

    dialogRef.afterClosed().subscribe( async result => {
      if (!result) { return; }

      try {
        await this.billpaymentService.delete(this.selectedId);
        await this.router.navigateByUrl('/billpayments');
      }catch (e) {
        this.snackBar.open(e.error.message, null, {duration: 4000});
      }
    });
  }

  async loadData(): Promise<any> {
    this.updatePrivileges();
    this.billpayment = await this.billpaymentService.get(this.selectedId);
  }

  updatePrivileges(): any {
    this.privilege.add = LoggedUser.can(UsecaseList.ADD_BILLPAYMENT);
    this.privilege.showAll = LoggedUser.can(UsecaseList.SHOW_ALL_BILLPAYMENTS);
    this.privilege.showOne = LoggedUser.can(UsecaseList.SHOW_BILLPAYMENT_DETAILS);
    this.privilege.delete = LoggedUser.can(UsecaseList.DELETE_BILLPAYMENT);
    this.privilege.update = LoggedUser.can(UsecaseList.UPDATE_BILLPAYMENT);
  }
}
