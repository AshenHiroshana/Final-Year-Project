import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {MatDialog} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import {DeleteConfirmDialogComponent} from '../../../../shared/views/delete-confirm-dialog/delete-confirm-dialog.component';
import {LoggedUser} from '../../../../shared/logged-user';
import {UsecaseList} from '../../../../usecase-list';
import {AbstractComponent} from '../../../../shared/abstract-component';
import {Branchrole} from '../../../../entities/branchrole';
import {BranchroleService} from '../../../../services/branchrole.service';

@Component({
  selector: 'app-branchrole-detail',
  templateUrl: './branchrole-detail.component.html',
  styleUrls: ['./branchrole-detail.component.scss']
})
export class BranchroleDetailComponent extends AbstractComponent implements OnInit {

  branchrole: Branchrole;
  selectedId: number;

  constructor(
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private router: Router,
    private branchroleService: BranchroleService,
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
      data: {message: this.branchrole.code + ' - ' + this.branchrole.name}
    });

    dialogRef.afterClosed().subscribe( async result => {
      if (!result) { return; }

      try {
        await this.branchroleService.delete(this.selectedId);
        await this.router.navigateByUrl('/branchroles');
      }catch (e) {
        this.snackBar.open(e.error.message, null, {duration: 4000});
      }
    });
  }

  async loadData(): Promise<any> {
    this.updatePrivileges();
    this.branchrole = await this.branchroleService.get(this.selectedId);
  }

  updatePrivileges(): any {
    this.privilege.add = LoggedUser.can(UsecaseList.ADD_BRANCHROLE);
    this.privilege.showAll = LoggedUser.can(UsecaseList.SHOW_ALL_BRANCHROLES);
    this.privilege.showOne = LoggedUser.can(UsecaseList.SHOW_BRANCHROLE_DETAILS);
    this.privilege.delete = LoggedUser.can(UsecaseList.DELETE_BRANCHROLE);
    this.privilege.update = LoggedUser.can(UsecaseList.UPDATE_BRANCHROLE);
  }
}
