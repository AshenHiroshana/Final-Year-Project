import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {MatDialog} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import {DeleteConfirmDialogComponent} from '../../../../shared/views/delete-confirm-dialog/delete-confirm-dialog.component';
import {LoggedUser} from '../../../../shared/logged-user';
import {UsecaseList} from '../../../../usecase-list';
import {AbstractComponent} from '../../../../shared/abstract-component';
import {Servicerefund} from '../../../../entities/servicerefund';
import {ServicerefundService} from '../../../../services/servicerefund.service';

@Component({
  selector: 'app-servicerefund-detail',
  templateUrl: './servicerefund-detail.component.html',
  styleUrls: ['./servicerefund-detail.component.scss']
})
export class ServicerefundDetailComponent extends AbstractComponent implements OnInit {

  servicerefund: Servicerefund;
  selectedId: number;

  constructor(
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private router: Router,
    private servicerefundService: ServicerefundService,
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
      data: {message: this.servicerefund.code}
    });

    dialogRef.afterClosed().subscribe( async result => {
      if (!result) { return; }

      try {
        await this.servicerefundService.delete(this.selectedId);
        await this.router.navigateByUrl('/servicerefunds');
      }catch (e) {
        this.snackBar.open(e.error.message, null, {duration: 4000});
      }
    });
  }

  async loadData(): Promise<any> {
    this.updatePrivileges();
    this.servicerefund = await this.servicerefundService.get(this.selectedId);
  }

  updatePrivileges(): any {
    this.privilege.add = LoggedUser.can(UsecaseList.ADD_SERVICEREFUND);
    this.privilege.showAll = LoggedUser.can(UsecaseList.SHOW_ALL_SERVICEREFUNDS);
    this.privilege.showOne = LoggedUser.can(UsecaseList.SHOW_SERVICEREFUND_DETAILS);
    this.privilege.delete = LoggedUser.can(UsecaseList.DELETE_SERVICEREFUND);
    this.privilege.update = LoggedUser.can(UsecaseList.UPDATE_SERVICEREFUND);
  }
}
