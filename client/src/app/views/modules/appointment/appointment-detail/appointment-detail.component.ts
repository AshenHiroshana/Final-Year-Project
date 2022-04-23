import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {MatDialog} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import {DeleteConfirmDialogComponent} from '../../../../shared/views/delete-confirm-dialog/delete-confirm-dialog.component';
import {LoggedUser} from '../../../../shared/logged-user';
import {UsecaseList} from '../../../../usecase-list';
import {AbstractComponent} from '../../../../shared/abstract-component';
import {Appointment} from '../../../../entities/appointment';
import {AppointmentService} from '../../../../services/appointment.service';

@Component({
  selector: 'app-appointment-detail',
  templateUrl: './appointment-detail.component.html',
  styleUrls: ['./appointment-detail.component.scss']
})
export class AppointmentDetailComponent extends AbstractComponent implements OnInit {

  appointment: Appointment;
  selectedId: number;

  constructor(
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private router: Router,
    private appointmentService: AppointmentService,
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
      data: {message: this.appointment.code}
    });

    dialogRef.afterClosed().subscribe( async result => {
      if (!result) { return; }

      try {
        await this.appointmentService.delete(this.selectedId);
        await this.router.navigateByUrl('/appointments');
      }catch (e) {
        this.snackBar.open(e.error.message, null, {duration: 4000});
      }
    });
  }

  async loadData(): Promise<any> {
    this.updatePrivileges();
    this.appointment = await this.appointmentService.get(this.selectedId);
  }

  updatePrivileges(): any {
    this.privilege.add = LoggedUser.can(UsecaseList.ADD_APPOINTMENT);
    this.privilege.showAll = LoggedUser.can(UsecaseList.SHOW_ALL_APPOINTMENTS);
    this.privilege.showOne = LoggedUser.can(UsecaseList.SHOW_APPOINTMENT_DETAILS);
    this.privilege.delete = LoggedUser.can(UsecaseList.DELETE_APPOINTMENT);
    this.privilege.update = LoggedUser.can(UsecaseList.UPDATE_APPOINTMENT);
  }
}
