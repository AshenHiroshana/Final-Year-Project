import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {MatDialog} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import {DeleteConfirmDialogComponent} from '../../../../shared/views/delete-confirm-dialog/delete-confirm-dialog.component';
import {LoggedUser} from '../../../../shared/logged-user';
import {UsecaseList} from '../../../../usecase-list';
import {AbstractComponent} from '../../../../shared/abstract-component';
import {Consumeitem} from '../../../../entities/consumeitem';
import {ConsumeitemService} from '../../../../services/consumeitem.service';

@Component({
  selector: 'app-consumeitem-detail',
  templateUrl: './consumeitem-detail.component.html',
  styleUrls: ['./consumeitem-detail.component.scss']
})
export class ConsumeitemDetailComponent extends AbstractComponent implements OnInit {

  consumeitem: Consumeitem;
  selectedId: number;
  photo: string = null;
  constructor(
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private router: Router,
    private consumeitemService: ConsumeitemService,
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
      data: {message: this.consumeitem.code + ' - ' + this.consumeitem.name}
    });

    dialogRef.afterClosed().subscribe( async result => {
      if (!result) { return; }

      try {
        await this.consumeitemService.delete(this.selectedId);
        await this.router.navigateByUrl('/consumeitems');
      }catch (e) {
        this.snackBar.open(e.error.message, null, {duration: 4000});
      }
    });
  }

  async loadData(): Promise<any> {
    this.updatePrivileges();
    this.consumeitem = await this.consumeitemService.get(this.selectedId);
    if (this.consumeitem.photo == null){
      this.photo = null;
    }else {
      const photoObject = await this.consumeitemService.getPhoto(this.selectedId);
      this.photo = photoObject.file;
    }
  }

  updatePrivileges(): any {
    this.privilege.add = LoggedUser.can(UsecaseList.ADD_CONSUMEITEM);
    this.privilege.showAll = LoggedUser.can(UsecaseList.SHOW_ALL_CONSUMEITEMS);
    this.privilege.showOne = LoggedUser.can(UsecaseList.SHOW_CONSUMEITEM_DETAILS);
    this.privilege.delete = LoggedUser.can(UsecaseList.DELETE_CONSUMEITEM);
    this.privilege.update = LoggedUser.can(UsecaseList.UPDATE_CONSUMEITEM);
  }
}
