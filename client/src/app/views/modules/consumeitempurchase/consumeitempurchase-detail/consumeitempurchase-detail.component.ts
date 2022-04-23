import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {MatDialog} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import {DeleteConfirmDialogComponent} from '../../../../shared/views/delete-confirm-dialog/delete-confirm-dialog.component';
import {LoggedUser} from '../../../../shared/logged-user';
import {UsecaseList} from '../../../../usecase-list';
import {AbstractComponent} from '../../../../shared/abstract-component';
import {Consumeitempurchase} from '../../../../entities/consumeitempurchase';
import {ConsumeitempurchaseService} from '../../../../services/consumeitempurchase.service';
import {ConsumeitempaymentService} from "../../../../services/consumeitempayment.service";
import {Consumeitempayment} from "../../../../entities/consumeitempayment";

@Component({
  selector: 'app-consumeitempurchase-detail',
  templateUrl: './consumeitempurchase-detail.component.html',
  styleUrls: ['./consumeitempurchase-detail.component.scss']
})
export class ConsumeitempurchaseDetailComponent extends AbstractComponent implements OnInit {

  consumeitempurchase: Consumeitempurchase;
  consumeitempayments: Consumeitempayment[] = []
  selectedId: number;

  constructor(
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private router: Router,
    private consumeitempurchaseService: ConsumeitempurchaseService,
    private consumeitempaymentService: ConsumeitempaymentService,
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
      data: {message: this.consumeitempurchase.code}
    });

    dialogRef.afterClosed().subscribe( async result => {
      if (!result) { return; }

      try {
        await this.consumeitempurchaseService.delete(this.selectedId);
        await this.router.navigateByUrl('/consumeitempurchases');
      }catch (e) {
        this.snackBar.open(e.error.message, null, {duration: 4000});
      }
    });
  }

  async loadData(): Promise<any> {
    this.updatePrivileges();
    this.consumeitempurchase = await this.consumeitempurchaseService.get(this.selectedId);
    this.consumeitempaymentService.getAllPaymentByPurchase(this.selectedId).then((consumeitempayments) => {
      this.consumeitempayments = consumeitempayments;
    }).catch((e) => {
      console.log(e);
      this.snackBar.open('Something is wrong', null, {duration: 2000});
    });
  }

  updatePrivileges(): any {
    this.privilege.add = LoggedUser.can(UsecaseList.ADD_CONSUMEITEMPURCHASE);
    this.privilege.showAll = LoggedUser.can(UsecaseList.SHOW_ALL_CONSUMEITEMPURCHASES);
    this.privilege.showOne = LoggedUser.can(UsecaseList.SHOW_CONSUMEITEMPURCHASE_DETAILS);
    this.privilege.delete = LoggedUser.can(UsecaseList.DELETE_CONSUMEITEMPURCHASE);
    this.privilege.update = LoggedUser.can(UsecaseList.UPDATE_CONSUMEITEMPURCHASE);
  }
}
