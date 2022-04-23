import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {MatDialog} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import {DeleteConfirmDialogComponent} from '../../../../shared/views/delete-confirm-dialog/delete-confirm-dialog.component';
import {LoggedUser} from '../../../../shared/logged-user';
import {UsecaseList} from '../../../../usecase-list';
import {AbstractComponent} from '../../../../shared/abstract-component';
import {Print} from '../../../../entities/print';
import {PrintService} from '../../../../services/print.service';

@Component({
  selector: 'app-print-detail',
  templateUrl: './print-detail.component.html',
  styleUrls: ['./print-detail.component.scss']
})
export class PrintDetailComponent extends AbstractComponent implements OnInit {

  print: Print;
  selectedId: number;

  constructor(
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private router: Router,
    private printService: PrintService,
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
      data: {message: this.print.code}
    });

    dialogRef.afterClosed().subscribe( async result => {
      if (!result) { return; }

      try {
        await this.printService.delete(this.selectedId);
        await this.router.navigateByUrl('/prints');
      }catch (e) {
        this.snackBar.open(e.error.message, null, {duration: 4000});
      }
    });
  }

  async loadData(): Promise<any> {
    this.updatePrivileges();
    this.print = await this.printService.get(this.selectedId);
  }

  updatePrivileges(): any {
    this.privilege.add = LoggedUser.can(UsecaseList.ADD_PRINT);
    this.privilege.showAll = LoggedUser.can(UsecaseList.SHOW_ALL_PRINTS);
    this.privilege.showOne = LoggedUser.can(UsecaseList.SHOW_PRINT_DETAILS);
    this.privilege.delete = LoggedUser.can(UsecaseList.DELETE_PRINT);
    this.privilege.update = LoggedUser.can(UsecaseList.UPDATE_PRINT);
  }
}
