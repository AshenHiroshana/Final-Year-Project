import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {MatDialog} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import {DeleteConfirmDialogComponent} from '../../../../shared/views/delete-confirm-dialog/delete-confirm-dialog.component';
import {LoggedUser} from '../../../../shared/logged-user';
import {UsecaseList} from '../../../../usecase-list';
import {AbstractComponent} from '../../../../shared/abstract-component';
import {Servicetype} from '../../../../entities/servicetype';
import {ServicetypeService} from '../../../../services/servicetype.service';

@Component({
  selector: 'app-servicetype-detail',
  templateUrl: './servicetype-detail.component.html',
  styleUrls: ['./servicetype-detail.component.scss']
})
export class ServicetypeDetailComponent extends AbstractComponent implements OnInit {

  servicetype: Servicetype;
  selectedId: number;

  constructor(
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private router: Router,
    private servicetypeService: ServicetypeService,
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
      data: {message: this.servicetype.code + ' - ' + this.servicetype.name}
    });

    dialogRef.afterClosed().subscribe( async result => {
      if (!result) { return; }

      try {
        await this.servicetypeService.delete(this.selectedId);
        await this.router.navigateByUrl('/servicetypes');
      }catch (e) {
        this.snackBar.open(e.error.message, null, {duration: 4000});
      }
    });
  }

  async loadData(): Promise<any> {
    this.updatePrivileges();
    this.servicetype = await this.servicetypeService.get(this.selectedId);
  }

  updatePrivileges(): any {
    this.privilege.add = LoggedUser.can(UsecaseList.ADD_SERVICETYPE);
    this.privilege.showAll = LoggedUser.can(UsecaseList.SHOW_ALL_SERVICETYPES);
    this.privilege.showOne = LoggedUser.can(UsecaseList.SHOW_SERVICETYPE_DETAILS);
    this.privilege.delete = LoggedUser.can(UsecaseList.DELETE_SERVICETYPE);
    this.privilege.update = LoggedUser.can(UsecaseList.UPDATE_SERVICETYPE);
  }
}
