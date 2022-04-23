import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {MatDialog} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import {DeleteConfirmDialogComponent} from '../../../../shared/views/delete-confirm-dialog/delete-confirm-dialog.component';
import {LoggedUser} from '../../../../shared/logged-user';
import {UsecaseList} from '../../../../usecase-list';
import {AbstractComponent} from '../../../../shared/abstract-component';
import {Branchroleassignment} from '../../../../entities/branchroleassignment';
import {BranchroleassignmentService} from '../../../../services/branchroleassignment.service';

@Component({
  selector: 'app-branchroleassignment-detail',
  templateUrl: './branchroleassignment-detail.component.html',
  styleUrls: ['./branchroleassignment-detail.component.scss']
})
export class BranchroleassignmentDetailComponent extends AbstractComponent implements OnInit {

  branchroleassignment: Branchroleassignment;
  selectedId: number;

  constructor(
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private router: Router,
    private branchroleassignmentService: BranchroleassignmentService,
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
      data: {message: this.branchroleassignment.code}
    });

    dialogRef.afterClosed().subscribe( async result => {
      if (!result) { return; }

      try {
        await this.branchroleassignmentService.delete(this.selectedId);
        await this.router.navigateByUrl('/branchroleassignments');
      }catch (e) {
        this.snackBar.open(e.error.message, null, {duration: 4000});
      }
    });
  }

  async loadData(): Promise<any> {
    this.updatePrivileges();
    this.branchroleassignment = await this.branchroleassignmentService.get(this.selectedId);
  }

  updatePrivileges(): any {
    this.privilege.add = LoggedUser.can(UsecaseList.ADD_BRANCHROLEASSIGNMENT);
    this.privilege.showAll = LoggedUser.can(UsecaseList.SHOW_ALL_BRANCHROLEASSIGNMENTS);
    this.privilege.showOne = LoggedUser.can(UsecaseList.SHOW_BRANCHROLEASSIGNMENT_DETAILS);
    this.privilege.delete = LoggedUser.can(UsecaseList.DELETE_BRANCHROLEASSIGNMENT);
    this.privilege.update = LoggedUser.can(UsecaseList.UPDATE_BRANCHROLEASSIGNMENT);
  }
}
