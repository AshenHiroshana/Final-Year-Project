import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {MatDialog} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import {DeleteConfirmDialogComponent} from '../../../../shared/views/delete-confirm-dialog/delete-confirm-dialog.component';
import {LoggedUser} from '../../../../shared/logged-user';
import {UsecaseList} from '../../../../usecase-list';
import {AbstractComponent} from '../../../../shared/abstract-component';
import {Service} from '../../../../entities/service';
import {ServiceService} from '../../../../services/service.service';
import {Servicepayment} from "../../../../entities/servicepayment";
import {ServicepaymentService} from "../../../../services/servicepayment.service";

@Component({
  selector: 'app-service-detail',
  templateUrl: './service-detail.component.html',
  styleUrls: ['./service-detail.component.scss']
})
export class ServiceDetailComponent extends AbstractComponent implements OnInit {

  service: Service;
  selectedId: number;
  servicepayments: Servicepayment[] = [];

  constructor(
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private router: Router,
    private serviceService: ServiceService,
    private servicepaymentService: ServicepaymentService,
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
      data: {message: this.service.code}
    });

    dialogRef.afterClosed().subscribe( async result => {
      if (!result) { return; }

      try {
        await this.serviceService.delete(this.selectedId);
        await this.router.navigateByUrl('/services');
      }catch (e) {
        this.snackBar.open(e.error.message, null, {duration: 4000});
      }
    });
  }

  async loadData(): Promise<any> {
    this.updatePrivileges();
    this.service = await this.serviceService.get(this.selectedId);

    this.servicepaymentService.getAllPaymentByPurchase(this.selectedId).then((servicepayment) => {
      this.servicepayments = servicepayment;
    }).catch((e) => {
      console.log(e);
      this.snackBar.open('Something is wrong', null, {duration: 2000});
    });
  }

  updatePrivileges(): any {
    this.privilege.add = LoggedUser.can(UsecaseList.ADD_SERVICE);
    this.privilege.showAll = LoggedUser.can(UsecaseList.SHOW_ALL_SERVICES);
    this.privilege.showOne = LoggedUser.can(UsecaseList.SHOW_SERVICE_DETAILS);
    this.privilege.delete = LoggedUser.can(UsecaseList.DELETE_SERVICE);
    this.privilege.update = LoggedUser.can(UsecaseList.UPDATE_SERVICE);
  }
}
