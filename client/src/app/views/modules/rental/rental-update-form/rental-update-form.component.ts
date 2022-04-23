import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {MatSnackBar} from '@angular/material/snack-bar';
import {LoggedUser} from '../../../../shared/logged-user';
import {UsecaseList} from '../../../../usecase-list';
import {ResourceLink} from '../../../../shared/resource-link';
import {AbstractComponent} from '../../../../shared/abstract-component';
import {PageRequest} from '../../../../shared/page-request';
import {Rental} from '../../../../entities/rental';
import {RentalService} from '../../../../services/rental.service';
import {Branch} from '../../../../entities/branch';
import {DateHelper} from '../../../../shared/date-helper';
import {Rentalstatus} from '../../../../entities/rentalstatus';
import {BranchService} from '../../../../services/branch.service';
import {RentalstatusService} from '../../../../services/rentalstatus.service';

@Component({
  selector: 'app-rental-update-form',
  templateUrl: './rental-update-form.component.html',
  styleUrls: ['./rental-update-form.component.scss']
})
export class RentalUpdateFormComponent extends AbstractComponent implements OnInit {

  selectedId: number;
  rental: Rental;

  branches: Branch[] = [];
  rentalstatuses: Rentalstatus[] = [];

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
    rentalstatus: new FormControl('1', [
      Validators.required,
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

  get rentalstatusField(): FormControl{
    return this.form.controls.rentalstatus as FormControl;
  }

  get descriptionField(): FormControl{
    return this.form.controls.description as FormControl;
  }

  constructor(
    private branchService: BranchService,
    private rentalstatusService: RentalstatusService,
    private rentalService: RentalService,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar,
    private router: Router
  ) {
    super();
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe( async (params) => {
      this.selectedId =  + params.get('id');
      await this.loadData();
      this.refreshData();
    });
  }

  async loadData(): Promise<any>{

    this.updatePrivileges();
    if (!this.privilege.update) { return; }

    this.branchService.getAllBasic(new PageRequest()).then((branchDataPage) => {
      this.branches = branchDataPage.content;
    }).catch((e) => {
      console.log(e);
      this.snackBar.open('Something is wrong', null, {duration: 2000});
    });
    this.rentalstatusService.getAll().then((rentalstatuses) => {
      this.rentalstatuses = rentalstatuses;
    }).catch((e) => {
      console.log(e);
      this.snackBar.open('Something is wrong', null, {duration: 2000});
    });
    this.rental = await this.rentalService.get(this.selectedId);
    this.setValues();
  }

  updatePrivileges(): any {
    this.privilege.add = LoggedUser.can(UsecaseList.ADD_RENTAL);
    this.privilege.showAll = LoggedUser.can(UsecaseList.SHOW_ALL_RENTALS);
    this.privilege.showOne = LoggedUser.can(UsecaseList.SHOW_RENTAL_DETAILS);
    this.privilege.delete = LoggedUser.can(UsecaseList.DELETE_RENTAL);
    this.privilege.update = LoggedUser.can(UsecaseList.UPDATE_RENTAL);
  }

  discardChanges(): void{
    this.form.markAsPristine();
    this.form.markAsUntouched();
    this.setValues();
  }

  setValues(): void{
    if (this.branchField.pristine) {
      this.branchField.setValue(this.rental.branch.id);
    }
    if (this.nameField.pristine) {
      this.nameField.setValue(this.rental.name);
    }
    if (this.dateField.pristine) {
      this.dateField.setValue(this.rental.date);
    }
    if (this.amountField.pristine) {
      this.amountField.setValue(this.rental.amount);
    }
    if (this.rentalstatusField.pristine) {
      this.rentalstatusField.setValue(this.rental.rentalstatus.id);
    }
    if (this.descriptionField.pristine) {
      this.descriptionField.setValue(this.rental.description);
    }
}

  async submit(): Promise<void> {
    if (this.form.invalid) { return; }

    const newrental: Rental = new Rental();
    newrental.branch = this.branchField.value;
    newrental.name = this.nameField.value;
    newrental.date = DateHelper.getDateAsString(this.dateField.value);
    newrental.amount = this.amountField.value;
    newrental.rentalstatus = this.rentalstatusField.value;
    newrental.description = this.descriptionField.value;
    try{
      const resourceLink: ResourceLink = await this.rentalService.update(this.selectedId, newrental);
      if (this.privilege.showOne) {
        await this.router.navigateByUrl('/rentals/' + resourceLink.id);
      } else {
        await this.router.navigateByUrl('/rentals');
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
          if (msg.rentalstatus) { this.rentalstatusField.setErrors({server: msg.rentalstatus}); knownError = true; }
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
