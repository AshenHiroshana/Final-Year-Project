import { Component, OnInit } from '@angular/core';
import {ResourceLink} from '../../../../shared/resource-link';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Router} from '@angular/router';
import {AbstractComponent} from '../../../../shared/abstract-component';
import {LoggedUser} from '../../../../shared/logged-user';
import {UsecaseList} from '../../../../usecase-list';
import {PageRequest} from '../../../../shared/page-request';
import {Rental} from '../../../../entities/rental';
import {RentalService} from '../../../../services/rental.service';
import {Branch} from '../../../../entities/branch';
import {DateHelper} from '../../../../shared/date-helper';
import {BranchService} from '../../../../services/branch.service';

@Component({
  selector: 'app-rental-form',
  templateUrl: './rental-form.component.html',
  styleUrls: ['./rental-form.component.scss']
})
export class RentalFormComponent extends AbstractComponent implements OnInit {

  branches: Branch[] = [];

  form = new FormGroup({
    branch: new FormControl(null, [
      Validators.required,
    ]),
    name: new FormControl(null, [
      Validators.required,
      Validators.minLength(2),
      Validators.maxLength(255),
      Validators.pattern('^[a-zA-Z ]{3,}$'),
    ]),
    date: new FormControl(null, [
      Validators.required,
    ]),
    amount: new FormControl(null, [
      Validators.required,
      Validators.min(0),
      Validators.max(10000000),
      Validators.pattern('^([0-9]{1,8}([.][0-9]{1,2})?)$'),
    ]),
    description: new FormControl(null, [
      Validators.minLength(null),
      Validators.maxLength(65535),
    ]),
  });

  get branchField(): FormControl{
    return this.form.controls.branch as FormControl;
  }

  get nameField(): FormControl{
    return this.form.controls.name as FormControl;
  }

  get dateField(): FormControl{
    return this.form.controls.date as FormControl;
  }

  get amountField(): FormControl{
    return this.form.controls.amount as FormControl;
  }

  get descriptionField(): FormControl{
    return this.form.controls.description as FormControl;
  }

  constructor(
    private branchService: BranchService,
    private rentalService: RentalService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {
    super();
  }

  ngOnInit(): void {
    this.loadData();
    this.refreshData();
  }

async loadData(): Promise<any>{

    this.updatePrivileges();
    if (!this.privilege.add) { return; }

    this.branchService.getAllBasic(new PageRequest()).then((branchDataPage) => {
      this.branches = branchDataPage.content;
    }).catch((e) => {
      console.log(e);
      this.snackBar.open('Something is wrong', null, {duration: 2000});
    });
  }

  updatePrivileges(): any {
    this.privilege.add = LoggedUser.can(UsecaseList.ADD_RENTAL);
    this.privilege.showAll = LoggedUser.can(UsecaseList.SHOW_ALL_RENTALS);
    this.privilege.showOne = LoggedUser.can(UsecaseList.SHOW_RENTAL_DETAILS);
    this.privilege.delete = LoggedUser.can(UsecaseList.DELETE_RENTAL);
    this.privilege.update = LoggedUser.can(UsecaseList.UPDATE_RENTAL);
  }

  async submit(): Promise<void> {
    if (this.form.invalid) { return; }

    const rental: Rental = new Rental();
    rental.branch = this.branchField.value;
    rental.name = this.nameField.value;
    rental.date = DateHelper.getDateAsString(this.dateField.value);
    rental.amount = this.amountField.value;
    rental.description = this.descriptionField.value;
    try{
      const resourceLink: ResourceLink = await this.rentalService.add(rental);
      if (this.privilege.showOne) {
        await this.router.navigateByUrl('/rentals/' + resourceLink.id);
      } else {
        this.form.reset();
        this.snackBar.open('Successfully saved', null, {duration: 2000});
      }
    }catch (e) {
      switch (e.status) {
        case 401: break;
        case 403: this.snackBar.open(e.error.message, null, {duration: 2000}); break;
        case 400:
          const msg = JSON.parse(e.error.message);
          let knownError = false;
          if (msg.branch) { this.branchField.setErrors({server: msg.branch}); knownError = true; }
          if (msg.name) { this.nameField.setErrors({server: msg.name}); knownError = true; }
          if (msg.date) { this.dateField.setErrors({server: msg.date}); knownError = true; }
          if (msg.amount) { this.amountField.setErrors({server: msg.amount}); knownError = true; }
          if (msg.description) { this.descriptionField.setErrors({server: msg.description}); knownError = true; }
          if (!knownError) {
            this.snackBar.open('Validation Error', null, {duration: 2000});
          }
          break;
        default:
          this.snackBar.open('Something is wrong', null, {duration: 2000});
      }
    }

  }
}
