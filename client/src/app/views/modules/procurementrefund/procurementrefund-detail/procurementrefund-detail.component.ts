import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {MatDialog} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import {DeleteConfirmDialogComponent} from '../../../../shared/views/delete-confirm-dialog/delete-confirm-dialog.component';
import {LoggedUser} from '../../../../shared/logged-user';
import {UsecaseList} from '../../../../usecase-list';
import {AbstractComponent} from '../../../../shared/abstract-component';
import {Procurementrefund} from '../../../../entities/procurementrefund';
import {ProcurementrefundService} from '../../../../services/procurementrefund.service';

@Component({
  selector: 'app-procurementrefund-detail',
  templateUrl: './procurementrefund-detail.component.html',
  styleUrls: ['./procurementrefund-detail.component.scss']
})
export class ProcurementrefundDetailComponent extends AbstractComponent implements OnInit {

  procurementrefund: Procurementrefund;
  selectedId: number;

  constructor(
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private router: Router,
    private procurementrefundService: ProcurementrefundService,
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
      data: {message: this.procurementrefund.code}
    });

    dialogRef.afterClosed().subscribe( async result => {
      if (!result) { return; }

      try {
        await this.procurementrefundService.delete(this.selectedId);
        await this.router.navigateByUrl('/procurementrefunds');
      }catch (e) {
        this.snackBar.open(e.error.message, null, {duration: 4000});
      }
    });
  }

  async loadData(): Promise<any> {
    this.updatePrivileges();
    this.procurementrefund = await this.procurementrefundService.get(this.selectedId);
  }

  updatePrivileges(): any {
    this.privilege.add = LoggedUser.can(UsecaseList.ADD_PROCUREMENTREFUND);
    this.privilege.showAll = LoggedUser.can(UsecaseList.SHOW_ALL_PROCUREMENTREFUNDS);
    this.privilege.showOne = LoggedUser.can(UsecaseList.SHOW_PROCUREMENTREFUND_DETAILS);
    this.privilege.delete = LoggedUser.can(UsecaseList.DELETE_PROCUREMENTREFUND);
    this.privilege.update = LoggedUser.can(UsecaseList.UPDATE_PROCUREMENTREFUND);
  }
}
