import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {MatDialog} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import {DeleteConfirmDialogComponent} from '../../../../shared/views/delete-confirm-dialog/delete-confirm-dialog.component';
import {LoggedUser} from '../../../../shared/logged-user';
import {UsecaseList} from '../../../../usecase-list';
import {AbstractComponent} from '../../../../shared/abstract-component';
import {Attendance} from '../../../../entities/attendance';
import {AttendanceService} from '../../../../services/attendance.service';

@Component({
  selector: 'app-attendance-detail',
  templateUrl: './attendance-detail.component.html',
  styleUrls: ['./attendance-detail.component.scss']
})
export class AttendanceDetailComponent extends AbstractComponent implements OnInit {

  attendance: Attendance;
  selectedId: number;

  constructor(
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private router: Router,
    private attendanceService: AttendanceService,
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
      data: {message: this.attendance.code}
    });

    dialogRef.afterClosed().subscribe( async result => {
      if (!result) { return; }

      try {
        await this.attendanceService.delete(this.selectedId);
        await this.router.navigateByUrl('/attendances');
      }catch (e) {
        this.snackBar.open(e.error.message, null, {duration: 4000});
      }
    });
  }

  async loadData(): Promise<any> {
    this.updatePrivileges();
    this.attendance = await this.attendanceService.get(this.selectedId);
  }

  updatePrivileges(): any {
    this.privilege.add = LoggedUser.can(UsecaseList.ADD_ATTENDANCE);
    this.privilege.showAll = LoggedUser.can(UsecaseList.SHOW_ALL_ATTENDANCES);
    this.privilege.showOne = LoggedUser.can(UsecaseList.SHOW_ATTENDANCE_DETAILS);
    this.privilege.delete = LoggedUser.can(UsecaseList.DELETE_ATTENDANCE);
    this.privilege.update = LoggedUser.can(UsecaseList.UPDATE_ATTENDANCE);
  }
}
