import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {MatDialog} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import {DeleteConfirmDialogComponent} from '../../../../shared/views/delete-confirm-dialog/delete-confirm-dialog.component';
import {LoggedUser} from '../../../../shared/logged-user';
import {UsecaseList} from '../../../../usecase-list';
import {AbstractComponent} from '../../../../shared/abstract-component';
import {Rental} from '../../../../entities/rental';
import {RentalService} from '../../../../services/rental.service';

@Component({
  selector: 'app-rental-detail',
  templateUrl: './rental-detail.component.html',
  styleUrls: ['./rental-detail.component.scss']
})
export class RentalDetailComponent extends AbstractComponent implements OnInit {

  rental: Rental;
  selectedId: number;

  constructor(
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private router: Router,
    private rentalService: RentalService,
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
      data: {message: this.rental.code + ' - ' + this.rental.name}
    });

    dialogRef.afterClosed().subscribe( async result => {
      if (!result) { return; }

      try {
        await this.rentalService.delete(this.selectedId);
        await this.router.navigateByUrl('/rentals');
      }catch (e) {
        this.snackBar.open(e.error.message, null, {duration: 4000});
      }
    });
  }

  async loadData(): Promise<any> {
    this.updatePrivileges();
    this.rental = await this.rentalService.get(this.selectedId);
  }

  updatePrivileges(): any {
    this.privilege.add = LoggedUser.can(UsecaseList.ADD_RENTAL);
    this.privilege.showAll = LoggedUser.can(UsecaseList.SHOW_ALL_RENTALS);
    this.privilege.showOne = LoggedUser.can(UsecaseList.SHOW_RENTAL_DETAILS);
    this.privilege.delete = LoggedUser.can(UsecaseList.DELETE_RENTAL);
    this.privilege.update = LoggedUser.can(UsecaseList.UPDATE_RENTAL);
  }
}
