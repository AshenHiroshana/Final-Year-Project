import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {MatDialog} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import {DeleteConfirmDialogComponent} from '../../../../shared/views/delete-confirm-dialog/delete-confirm-dialog.component';
import {LoggedUser} from '../../../../shared/logged-user';
import {UsecaseList} from '../../../../usecase-list';
import {AbstractComponent} from '../../../../shared/abstract-component';
import {Consumedistribution} from '../../../../entities/consumedistribution';
import {ConsumedistributionService} from '../../../../services/consumedistribution.service';

@Component({
  selector: 'app-consumedistribution-detail',
  templateUrl: './consumedistribution-detail.component.html',
  styleUrls: ['./consumedistribution-detail.component.scss']
})
export class ConsumedistributionDetailComponent extends AbstractComponent implements OnInit {

  consumedistribution: Consumedistribution;
  selectedId: number;

  constructor(
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private router: Router,
    private consumedistributionService: ConsumedistributionService,
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
      data: {message: this.consumedistribution.code}
    });

    dialogRef.afterClosed().subscribe( async result => {
      if (!result) { return; }

      try {
        await this.consumedistributionService.delete(this.selectedId);
        await this.router.navigateByUrl('/consumedistributions');
      }catch (e) {
        this.snackBar.open(e.error.message, null, {duration: 4000});
      }
    });
  }

  async loadData(): Promise<any> {
    this.updatePrivileges();
    this.consumedistribution = await this.consumedistributionService.get(this.selectedId);
  }

  updatePrivileges(): any {
    this.privilege.add = LoggedUser.can(UsecaseList.ADD_CONSUMEDISTRIBUTION);
    this.privilege.showAll = LoggedUser.can(UsecaseList.SHOW_ALL_CONSUMEDISTRIBUTIONS);
    this.privilege.showOne = LoggedUser.can(UsecaseList.SHOW_CONSUMEDISTRIBUTION_DETAILS);
    this.privilege.delete = LoggedUser.can(UsecaseList.DELETE_CONSUMEDISTRIBUTION);
    this.privilege.update = LoggedUser.can(UsecaseList.UPDATE_CONSUMEDISTRIBUTION);
  }
}
