import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {MatDialog} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import {DeleteConfirmDialogComponent} from '../../../../shared/views/delete-confirm-dialog/delete-confirm-dialog.component';
import {LoggedUser} from '../../../../shared/logged-user';
import {UsecaseList} from '../../../../usecase-list';
import {AbstractComponent} from '../../../../shared/abstract-component';
import {Procurementitem} from '../../../../entities/procurementitem';
import {ProcurementitemService} from '../../../../services/procurementitem.service';

@Component({
  selector: 'app-procurementitem-detail',
  templateUrl: './procurementitem-detail.component.html',
  styleUrls: ['./procurementitem-detail.component.scss']
})
export class ProcurementitemDetailComponent extends AbstractComponent implements OnInit {

  procurementitem: Procurementitem;
  selectedId: number;
  photo: string = null;
  warranty: string = null;
  invoice: string = null;

  constructor(
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private router: Router,
    private procurementitemService: ProcurementitemService,
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
      data: {message: this.procurementitem.code}
    });

    dialogRef.afterClosed().subscribe( async result => {
      if (!result) { return; }

      try {
        await this.procurementitemService.delete(this.selectedId);
        await this.router.navigateByUrl('/procurementitems');
      }catch (e) {
        this.snackBar.open(e.error.message, null, {duration: 4000});
      }
    });
  }

  async loadData(): Promise<any> {
    this.updatePrivileges();
    this.procurementitem = await this.procurementitemService.get(this.selectedId);
    if (this.procurementitem.itemphoto == null){
      this.photo = null;
    }else {
      const photoObject = await this.procurementitemService.getPhoto(this.selectedId);
      this.photo = photoObject.file;
    }
    if (this.procurementitem.warrantyphoto == null){
      this.warranty = null;
    }else {
      const photoObject = await this.procurementitemService.getWarrantyphoto(this.selectedId);
      this.warranty = photoObject.file;
    }
    if (this.procurementitem.invoice == null){
      this.invoice = null;
    }else {
      const photoObject = await this.procurementitemService.getInvoice(this.selectedId);
      this.invoice = photoObject.file;
    }
  }

  updatePrivileges(): any {
    this.privilege.add = LoggedUser.can(UsecaseList.ADD_PROCUREMENTITEM);
    this.privilege.showAll = LoggedUser.can(UsecaseList.SHOW_ALL_PROCUREMENTITEMS);
    this.privilege.showOne = LoggedUser.can(UsecaseList.SHOW_PROCUREMENTITEM_DETAILS);
    this.privilege.delete = LoggedUser.can(UsecaseList.DELETE_PROCUREMENTITEM);
    this.privilege.update = LoggedUser.can(UsecaseList.UPDATE_PROCUREMENTITEM);
  }
}
