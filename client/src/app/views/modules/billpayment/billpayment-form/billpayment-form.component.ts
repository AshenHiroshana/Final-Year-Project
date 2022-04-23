import { Component, OnInit } from '@angular/core';
import {ResourceLink} from '../../../../shared/resource-link';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Router} from '@angular/router';
import {AbstractComponent} from '../../../../shared/abstract-component';
import {LoggedUser} from '../../../../shared/logged-user';
import {UsecaseList} from '../../../../usecase-list';
import {PageRequest} from '../../../../shared/page-request';
import {Billpayment} from '../../../../entities/billpayment';
import {BillpaymentService} from '../../../../services/billpayment.service';
import {Branch} from '../../../../entities/branch';
import {DateHelper} from '../../../../shared/date-helper';
import {BranchService} from '../../../../services/branch.service';
import {Billpaymenttype} from '../../../../entities/billpaymenttype';
import {BillpaymenttypeService} from '../../../../services/billpaymenttype.service';

@Component({
  selector: 'app-billpayment-form',
  templateUrl: './billpayment-form.component.html',
  styleUrls: ['./billpayment-form.component.scss']
})
export class BillpaymentFormComponent extends AbstractComponent implements OnInit {

  billpaymenttypes: Billpaymenttype[] = [];
  branches: Branch[] = [];

  form = new FormGroup({
    billpaymenttype: new FormControl(null, [
      Validators.required,
    ]),
    title: new FormControl(null, [
      Validators.required,
      Validators.minLength(2),
      Validators.maxLength(255),
    ]),
    branch: new FormControl(null, [
      Validators.required,
    ]),
    amount: new FormControl(null, [
      Validators.required,
      Validators.min(0),
      Validators.max(10000000),
      Validators.pattern('^([0-9]{1,8}([.][0-9]{1,2})?)$'),
    ]),
    date: new FormControl(null, [
      Validators.required,
    ]),
    photo: new FormControl(),
    description: new FormControl(null, [
      Validators.minLength(null),
      Validators.maxLength(65535),
    ]),
  });

  get billpaymenttypeField(): FormControl{
    return this.form.controls.billpaymenttype as FormControl;
  }

  get titleField(): FormControl{
    return this.form.controls.title as FormControl;
  }

  get branchField(): FormControl{
    return this.form.controls.branch as FormControl;
  }

  get amountField(): FormControl{
    return this.form.controls.amount as FormControl;
  }

  get dateField(): FormControl{
    return this.form.controls.date as FormControl;
  }

  get photoField(): FormControl{
    return this.form.controls.photo as FormControl;
  }

  get descriptionField(): FormControl{
    return this.form.controls.description as FormControl;
  }

  constructor(
    private billpaymenttypeService: BillpaymenttypeService,
    private branchService: BranchService,
    private billpaymentService: BillpaymentService,
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

    this.billpaymenttypeService.getAll().then((billpaymenttypes) => {
      this.billpaymenttypes = billpaymenttypes;
    }).catch((e) => {
      console.log(e);
      this.snackBar.open('Something is wrong', null, {duration: 2000});
    });
    this.branchService.getAllBasic(new PageRequest()).then((branchDataPage) => {
      this.branches = branchDataPage.content;
    }).catch((e) => {
      console.log(e);
      this.snackBar.open('Something is wrong', null, {duration: 2000});
    });
  }

  updatePrivileges(): any {
    this.privilege.add = LoggedUser.can(UsecaseList.ADD_BILLPAYMENT);
    this.privilege.showAll = LoggedUser.can(UsecaseList.SHOW_ALL_BILLPAYMENTS);
    this.privilege.showOne = LoggedUser.can(UsecaseList.SHOW_BILLPAYMENT_DETAILS);
    this.privilege.delete = LoggedUser.can(UsecaseList.DELETE_BILLPAYMENT);
    this.privilege.update = LoggedUser.can(UsecaseList.UPDATE_BILLPAYMENT);
  }

  async submit(): Promise<void> {
    this.photoField.updateValueAndValidity();
    this.photoField.markAsTouched();
    if (this.form.invalid) { return; }

    const billpayment: Billpayment = new Billpayment();
    billpayment.billpaymenttype = this.billpaymenttypeField.value;
    billpayment.title = this.titleField.value;
    billpayment.branch = this.branchField.value;
    billpayment.amount = this.amountField.value;
    billpayment.date = DateHelper.getDateAsString(this.dateField.value);
    const photoIds = this.photoField.value;
    if (photoIds !== null && photoIds !== []){
      billpayment.photo = photoIds[0];
    }else{
      billpayment.photo = null;
    }
    billpayment.description = this.descriptionField.value;
    try{
      const resourceLink: ResourceLink = await this.billpaymentService.add(billpayment);
      if (this.privilege.showOne) {
        await this.router.navigateByUrl('/billpayments/' + resourceLink.id);
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
          if (msg.billpaymenttype) { this.billpaymenttypeField.setErrors({server: msg.billpaymenttype}); knownError = true; }
          if (msg.title) { this.titleField.setErrors({server: msg.title}); knownError = true; }
          if (msg.branch) { this.branchField.setErrors({server: msg.branch}); knownError = true; }
          if (msg.amount) { this.amountField.setErrors({server: msg.amount}); knownError = true; }
          if (msg.date) { this.dateField.setErrors({server: msg.date}); knownError = true; }
          if (msg.photo) { this.photoField.setErrors({server: msg.photo}); knownError = true; }
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
  dateVaidation(): any {
    const date = new Date();
    return date;
  }
}
