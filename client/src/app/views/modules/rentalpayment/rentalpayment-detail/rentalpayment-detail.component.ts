import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {MatDialog} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import {DeleteConfirmDialogComponent} from '../../../../shared/views/delete-confirm-dialog/delete-confirm-dialog.component';
import {LoggedUser} from '../../../../shared/logged-user';
import {UsecaseList} from '../../../../usecase-list';
import {AbstractComponent} from '../../../../shared/abstract-component';
import {Rentalpayment} from '../../../../entities/rentalpayment';
import {RentalpaymentService} from '../../../../services/rentalpayment.service';

@Component({
  selector: 'app-rentalpayment-detail',
  templateUrl: './rentalpayment-detail.component.html',
  styleUrls: ['./rentalpayment-detail.component.scss']
})
export class RentalpaymentDetailComponent extends AbstractComponent implements OnInit {

  rentalpayment: Rentalpayment;
  selectedId: number;

  constructor(
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private router: Router,
    private rentalpaymentService: RentalpaymentService,
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
      data: {message: this.rentalpayment.code}
    });

    dialogRef.afterClosed().subscribe( async result => {
      if (!result) { return; }

      try {
        await this.rentalpaymentService.delete(this.selectedId);
        await this.router.navigateByUrl('/rentalpayments');
      }catch (e) {
        this.snackBar.open(e.error.message, null, {duration: 4000});
      }
    });
  }

  async loadData(): Promise<any> {
    this.updatePrivileges();
    this.rentalpayment = await this.rentalpaymentService.get(this.selectedId);
  }

  updatePrivileges(): any {
    this.privilege.add = LoggedUser.can(UsecaseList.ADD_RENTALPAYMENT);
    this.privilege.showAll = LoggedUser.can(UsecaseList.SHOW_ALL_RENTALPAYMENTS);
    this.privilege.showOne = LoggedUser.can(UsecaseList.SHOW_RENTALPAYMENT_DETAILS);
    this.privilege.delete = LoggedUser.can(UsecaseList.DELETE_RENTALPAYMENT);
    this.privilege.update = LoggedUser.can(UsecaseList.UPDATE_RENTALPAYMENT);
  }
}
