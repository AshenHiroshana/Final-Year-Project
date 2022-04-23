import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {MatDialog} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import {DeleteConfirmDialogComponent} from '../../../../shared/views/delete-confirm-dialog/delete-confirm-dialog.component';
import {LoggedUser} from '../../../../shared/logged-user';
import {UsecaseList} from '../../../../usecase-list';
import {AbstractComponent} from '../../../../shared/abstract-component';
import {Consumeitempayment} from '../../../../entities/consumeitempayment';
import {ConsumeitempaymentService} from '../../../../services/consumeitempayment.service';

@Component({
  selector: 'app-consumeitempayment-detail',
  templateUrl: './consumeitempayment-detail.component.html',
  styleUrls: ['./consumeitempayment-detail.component.scss']
})
export class ConsumeitempaymentDetailComponent extends AbstractComponent implements OnInit {

  consumeitempayment: Consumeitempayment;
  selectedId: number;

  constructor(
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private router: Router,
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
      data: {message: this.consumeitempayment.code}
    });

    dialogRef.afterClosed().subscribe( async result => {
      if (!result) { return; }

      try {
        await this.consumeitempaymentService.delete(this.selectedId);
        await this.router.navigateByUrl('/consumeitempayments');
      }catch (e) {
        this.snackBar.open(e.error.message, null, {duration: 4000});
      }
    });
  }

  async loadData(): Promise<any> {
    this.updatePrivileges();
    this.consumeitempayment = await this.consumeitempaymentService.get(this.selectedId);
  }

  updatePrivileges(): any {
    this.privilege.add = LoggedUser.can(UsecaseList.ADD_CONSUMEITEMPAYMENT);
    this.privilege.showAll = LoggedUser.can(UsecaseList.SHOW_ALL_CONSUMEITEMPAYMENTS);
    this.privilege.showOne = LoggedUser.can(UsecaseList.SHOW_CONSUMEITEMPAYMENT_DETAILS);
    this.privilege.delete = LoggedUser.can(UsecaseList.DELETE_CONSUMEITEMPAYMENT);
    this.privilege.update = LoggedUser.can(UsecaseList.UPDATE_CONSUMEITEMPAYMENT);
  }
}
