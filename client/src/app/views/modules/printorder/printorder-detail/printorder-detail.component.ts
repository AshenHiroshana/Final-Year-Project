import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {MatDialog} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import {DeleteConfirmDialogComponent} from '../../../../shared/views/delete-confirm-dialog/delete-confirm-dialog.component';
import {LoggedUser} from '../../../../shared/logged-user';
import {UsecaseList} from '../../../../usecase-list';
import {AbstractComponent} from '../../../../shared/abstract-component';
import {Printorder} from '../../../../entities/printorder';
import {PrintorderService} from '../../../../services/printorder.service';

@Component({
  selector: 'app-printorder-detail',
  templateUrl: './printorder-detail.component.html',
  styleUrls: ['./printorder-detail.component.scss']
})
export class PrintorderDetailComponent extends AbstractComponent implements OnInit {

  printorder: Printorder;
  selectedId: number;

  constructor(
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private router: Router,
    private printorderService: PrintorderService,
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
      data: {message: this.printorder.code}
    });

    dialogRef.afterClosed().subscribe( async result => {
      if (!result) { return; }

      try {
        await this.printorderService.delete(this.selectedId);
        await this.router.navigateByUrl('/printorders');
      }catch (e) {
        this.snackBar.open(e.error.message, null, {duration: 4000});
      }
    });
  }

  async loadData(): Promise<any> {
    this.updatePrivileges();
    this.printorder = await this.printorderService.get(this.selectedId);
  }

  updatePrivileges(): any {
    this.privilege.add = LoggedUser.can(UsecaseList.ADD_PRINTORDER);
    this.privilege.showAll = LoggedUser.can(UsecaseList.SHOW_ALL_PRINTORDERS);
    this.privilege.showOne = LoggedUser.can(UsecaseList.SHOW_PRINTORDER_DETAILS);
    this.privilege.delete = LoggedUser.can(UsecaseList.DELETE_PRINTORDER);
    this.privilege.update = LoggedUser.can(UsecaseList.UPDATE_PRINTORDER);
  }
}
