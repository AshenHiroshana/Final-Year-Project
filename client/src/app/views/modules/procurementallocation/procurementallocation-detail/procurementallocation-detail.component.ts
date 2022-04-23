import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {MatDialog} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import {DeleteConfirmDialogComponent} from '../../../../shared/views/delete-confirm-dialog/delete-confirm-dialog.component';
import {LoggedUser} from '../../../../shared/logged-user';
import {UsecaseList} from '../../../../usecase-list';
import {AbstractComponent} from '../../../../shared/abstract-component';
import {Procurementallocation} from '../../../../entities/procurementallocation';
import {ProcurementallocationService} from '../../../../services/procurementallocation.service';

@Component({
  selector: 'app-procurementallocation-detail',
  templateUrl: './procurementallocation-detail.component.html',
  styleUrls: ['./procurementallocation-detail.component.scss']
})
export class ProcurementallocationDetailComponent extends AbstractComponent implements OnInit {

  procurementallocation: Procurementallocation;
  selectedId: number;

  constructor(
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private router: Router,
    private procurementallocationService: ProcurementallocationService,
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
      data: {message: this.procurementallocation.code}
    });

    dialogRef.afterClosed().subscribe( async result => {
      if (!result) { return; }

      try {
        await this.procurementallocationService.delete(this.selectedId);
        await this.router.navigateByUrl('/procurementallocations');
      }catch (e) {
        this.snackBar.open(e.error.message, null, {duration: 4000});
      }
    });
  }

  async loadData(): Promise<any> {
    this.updatePrivileges();
    this.procurementallocation = await this.procurementallocationService.get(this.selectedId);
  }

  updatePrivileges(): any {
    this.privilege.add = LoggedUser.can(UsecaseList.ADD_PROCUREMENTALLOCATION);
    this.privilege.showAll = LoggedUser.can(UsecaseList.SHOW_ALL_PROCUREMENTALLOCATIONS);
    this.privilege.showOne = LoggedUser.can(UsecaseList.SHOW_PROCUREMENTALLOCATION_DETAILS);
    this.privilege.delete = LoggedUser.can(UsecaseList.DELETE_PROCUREMENTALLOCATION);
    this.privilege.update = LoggedUser.can(UsecaseList.UPDATE_PROCUREMENTALLOCATION);
  }
}
