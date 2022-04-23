import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {MatDialog} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import {DeleteConfirmDialogComponent} from '../../../../shared/views/delete-confirm-dialog/delete-confirm-dialog.component';
import {LoggedUser} from '../../../../shared/logged-user';
import {UsecaseList} from '../../../../usecase-list';
import {AbstractComponent} from '../../../../shared/abstract-component';
import {Designation} from '../../../../entities/designation';
import {DesignationService} from '../../../../services/designation.service';

@Component({
  selector: 'app-designation-detail',
  templateUrl: './designation-detail.component.html',
  styleUrls: ['./designation-detail.component.scss']
})
export class DesignationDetailComponent extends AbstractComponent implements OnInit {

  designation: Designation;
  selectedId: number;

  constructor(
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private router: Router,
    private designationService: DesignationService,
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
      data: {message: this.designation.code + ' - ' + this.designation.department.name + ' ' + this.designation.name}
    });

    dialogRef.afterClosed().subscribe( async result => {
      if (!result) { return; }

      try {
        await this.designationService.delete(this.selectedId);
        await this.router.navigateByUrl('/designations');
      }catch (e) {
        this.snackBar.open(e.error.message, null, {duration: 4000});
      }
    });
  }

  async loadData(): Promise<any> {
    this.updatePrivileges();
    this.designation = await this.designationService.get(this.selectedId);
  }

  updatePrivileges(): any {
    this.privilege.add = LoggedUser.can(UsecaseList.ADD_DESIGNATION);
    this.privilege.showAll = LoggedUser.can(UsecaseList.SHOW_ALL_DESIGNATIONS);
    this.privilege.showOne = LoggedUser.can(UsecaseList.SHOW_DESIGNATION_DETAILS);
    this.privilege.delete = LoggedUser.can(UsecaseList.DELETE_DESIGNATION);
    this.privilege.update = LoggedUser.can(UsecaseList.UPDATE_DESIGNATION);
  }
}
