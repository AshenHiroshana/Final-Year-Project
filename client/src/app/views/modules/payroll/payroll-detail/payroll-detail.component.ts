import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {MatDialog} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import {DeleteConfirmDialogComponent} from '../../../../shared/views/delete-confirm-dialog/delete-confirm-dialog.component';
import {LoggedUser} from '../../../../shared/logged-user';
import {UsecaseList} from '../../../../usecase-list';
import {AbstractComponent} from '../../../../shared/abstract-component';
import {Payroll} from '../../../../entities/payroll';
import {PayrollService} from '../../../../services/payroll.service';

@Component({
  selector: 'app-payroll-detail',
  templateUrl: './payroll-detail.component.html',
  styleUrls: ['./payroll-detail.component.scss']
})
export class PayrollDetailComponent extends AbstractComponent implements OnInit {

  payroll: Payroll;
  selectedId: number;

  constructor(
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private router: Router,
    private payrollService: PayrollService,
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
      data: {message: this.payroll.code + ' - ' + this.payroll.employee.nametitle.name + ' ' + this.payroll.employee.callingname}
    });

    dialogRef.afterClosed().subscribe( async result => {
      if (!result) { return; }

      try {
        await this.payrollService.delete(this.selectedId);
        await this.router.navigateByUrl('/payrolls');
      }catch (e) {
        this.snackBar.open(e.error.message, null, {duration: 4000});
      }
    });
  }

  async loadData(): Promise<any> {
    this.updatePrivileges();
    this.payroll = await this.payrollService.get(this.selectedId);
  }

  updatePrivileges(): any {
    this.privilege.add = LoggedUser.can(UsecaseList.ADD_PAYROLL);
    this.privilege.showAll = LoggedUser.can(UsecaseList.SHOW_ALL_PAYROLLS);
    this.privilege.showOne = LoggedUser.can(UsecaseList.SHOW_PAYROLL_DETAILS);
    this.privilege.delete = LoggedUser.can(UsecaseList.DELETE_PAYROLL);
    this.privilege.update = LoggedUser.can(UsecaseList.UPDATE_PAYROLL);
  }
}
