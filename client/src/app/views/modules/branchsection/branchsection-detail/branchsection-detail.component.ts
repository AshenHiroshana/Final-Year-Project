import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {MatDialog} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import {DeleteConfirmDialogComponent} from '../../../../shared/views/delete-confirm-dialog/delete-confirm-dialog.component';
import {LoggedUser} from '../../../../shared/logged-user';
import {UsecaseList} from '../../../../usecase-list';
import {AbstractComponent} from '../../../../shared/abstract-component';
import {Branchsection} from '../../../../entities/branchsection';
import {BranchsectionService} from '../../../../services/branchsection.service';

@Component({
  selector: 'app-branchsection-detail',
  templateUrl: './branchsection-detail.component.html',
  styleUrls: ['./branchsection-detail.component.scss']
})
export class BranchsectionDetailComponent extends AbstractComponent implements OnInit {

  branchsection: Branchsection;
  selectedId: number;
  photo = null;
  areaplan = null;
  constructor(
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private router: Router,
    private branchsectionService: BranchsectionService,
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
      data: {message: this.branchsection.code + ' - ' + this.branchsection.name}
    });

    dialogRef.afterClosed().subscribe( async result => {
      if (!result) { return; }

      try {
        await this.branchsectionService.delete(this.selectedId);
        await this.router.navigateByUrl('/branchsections');
      }catch (e) {
        this.snackBar.open(e.error.message, null, {duration: 4000});
      }
    });
  }

  async loadData(): Promise<any> {
    this.updatePrivileges();
    this.branchsection = await this.branchsectionService.get(this.selectedId);
    if (this.branchsection.photo == null){
      this.photo = null;
    }else {
      const photoObject = await this.branchsectionService.getPhoto(this.selectedId);
      this.photo = photoObject.file;
    }
  }

  updatePrivileges(): any {
    this.privilege.add = LoggedUser.can(UsecaseList.ADD_BRANCHSECTION);
    this.privilege.showAll = LoggedUser.can(UsecaseList.SHOW_ALL_BRANCHSECTIONS);
    this.privilege.showOne = LoggedUser.can(UsecaseList.SHOW_BRANCHSECTION_DETAILS);
    this.privilege.delete = LoggedUser.can(UsecaseList.DELETE_BRANCHSECTION);
    this.privilege.update = LoggedUser.can(UsecaseList.UPDATE_BRANCHSECTION);
  }
}
