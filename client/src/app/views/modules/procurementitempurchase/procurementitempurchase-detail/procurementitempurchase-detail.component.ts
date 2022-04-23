import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {MatDialog} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import {DeleteConfirmDialogComponent} from '../../../../shared/views/delete-confirm-dialog/delete-confirm-dialog.component';
import {LoggedUser} from '../../../../shared/logged-user';
import {UsecaseList} from '../../../../usecase-list';
import {AbstractComponent} from '../../../../shared/abstract-component';
import {Procurementitempurchase} from '../../../../entities/procurementitempurchase';
import {ProcurementitempurchaseService} from '../../../../services/procurementitempurchase.service';
import {Procurementpayment} from '../../../../entities/procurementpayment';
import {Procurementitem} from '../../../../entities/procurementitem';
import {PageRequest} from '../../../../shared/page-request';
import {ProcurementpaymentService} from '../../../../services/procurementpayment.service';
import {ProcurementitemService} from '../../../../services/procurementitem.service';

@Component({
  selector: 'app-procurementitempurchase-detail',
  templateUrl: './procurementitempurchase-detail.component.html',
  styleUrls: ['./procurementitempurchase-detail.component.scss']
})
export class ProcurementitempurchaseDetailComponent extends AbstractComponent implements OnInit {

  procurementitempurchase: Procurementitempurchase;
  procurementpayments: Procurementpayment[];
  procurementitems: Procurementitem[];
  selectedId: number;

  constructor(
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private router: Router,
    private procurementitempurchaseService: ProcurementitempurchaseService,
    private procurementpaymentService: ProcurementpaymentService,
    private procurementitemService: ProcurementitemService,
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
      data: {message: this.procurementitempurchase.code}
    });

    dialogRef.afterClosed().subscribe( async result => {
      if (!result) { return; }

      try {
        await this.procurementitempurchaseService.delete(this.selectedId);
        await this.router.navigateByUrl('/procurementitempurchases');
      }catch (e) {
        this.snackBar.open(e.error.message, null, {duration: 4000});
      }
    });
  }

  async loadData(): Promise<any> {
    this.updatePrivileges();
    this.procurementitempurchase = await this.procurementitempurchaseService.get(this.selectedId);

    this.procurementpaymentService.getAllPaymentByPurchase(this.selectedId).then((procurementpayments) => {
      this.procurementpayments = procurementpayments;
    }).catch((e) => {
      console.log(e);
      this.snackBar.open('Something is wrong', null, {duration: 2000});
    });

    this.procurementitemService.getAllItemByPurchase(this.selectedId).then((procurementitems) => {
      this.procurementitems = procurementitems;
    }).catch((e) => {
      console.log(e);
      this.snackBar.open('Something is wrong', null, {duration: 2000});
    });
  }

  updatePrivileges(): any {
    this.privilege.add = LoggedUser.can(UsecaseList.ADD_PROCUREMENTITEMPURCHASE);
    this.privilege.showAll = LoggedUser.can(UsecaseList.SHOW_ALL_PROCUREMENTITEMPURCHASES);
    this.privilege.showOne = LoggedUser.can(UsecaseList.SHOW_PROCUREMENTITEMPURCHASE_DETAILS);
    this.privilege.delete = LoggedUser.can(UsecaseList.DELETE_PROCUREMENTITEMPURCHASE);
    this.privilege.update = LoggedUser.can(UsecaseList.UPDATE_PROCUREMENTITEMPURCHASE);
  }
}
