import { Component, OnInit } from '@angular/core';
import {ResourceLink} from '../../../../shared/resource-link';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Router} from '@angular/router';
import {AbstractComponent} from '../../../../shared/abstract-component';
import {LoggedUser} from '../../../../shared/logged-user';
import {UsecaseList} from '../../../../usecase-list';
import {PageRequest} from '../../../../shared/page-request';
import {Procurementrefund} from '../../../../entities/procurementrefund';
import {ProcurementrefundService} from '../../../../services/procurementrefund.service';
import {DateHelper} from '../../../../shared/date-helper';
import {Paymenttype} from '../../../../entities/paymenttype';
import {Procurementitem} from '../../../../entities/procurementitem';
import {PaymenttypeService} from '../../../../services/paymenttype.service';
import {ProcurementitemService} from '../../../../services/procurementitem.service';
import {Procurementitempurchase} from '../../../../entities/procurementitempurchase';
import {ProcurementitempurchaseService} from '../../../../services/procurementitempurchase.service';
import {Observable} from "rxjs";
import {map, startWith} from "rxjs/operators";
import {Branch} from "../../../../entities/branch";

@Component({
  selector: 'app-procurementrefund-form',
  templateUrl: './procurementrefund-form.component.html',
  styleUrls: ['./procurementrefund-form.component.scss']
})
export class ProcurementrefundFormComponent extends AbstractComponent implements OnInit {

  procurementitempurchases: Procurementitempurchase[] = [];
  paymenttypes: Paymenttype[] = [];
  procurementitems: Procurementitem[] = [];
  filteredOptions: Observable<Procurementitempurchase[]>;

  getItemToString = (obj: Procurementitem) => `${obj.code} - ${obj.procurementitemtype.name}`;

  form = new FormGroup({
    procurementitempurchase: new FormControl(null, [
      Validators.required,
    ]),
    date: new FormControl(null, ),
    amount: new FormControl(null, [
      Validators.required,
      Validators.min(0),
      Validators.max(10000000),
      Validators.pattern('^([0-9]{1,8}([.][0-9]{1,2})?)$'),
    ]),
    paymenttype: new FormControl(null, [
      Validators.required,
    ]),
    chequeno: new FormControl(null, [
      Validators.required,
      Validators.minLength(null),
      Validators.maxLength(45),
      Validators.pattern('^[0-9]{5,}$'),
    ]),
    chequedate: new FormControl(null, [
      Validators.required,
    ]),
    chequebank: new FormControl(null, [
      Validators.required,
      Validators.minLength(null),
      Validators.maxLength(45),
      Validators.pattern('^[a-zA-Z ]{3,}$'),
    ]),
    chequebranch: new FormControl(null, [
      Validators.required,
      Validators.minLength(null),
      Validators.maxLength(45),
      Validators.pattern('^[a-zA-Z ]{3,}$'),
    ]),
    procurementitems: new FormControl(),
    description: new FormControl(null, [
      Validators.minLength(null),
      Validators.maxLength(65535),
    ]),
    searchProcurementitempurchase: new FormControl(),
  });

  get procurementitempurchaseField(): FormControl{
    return this.form.controls.procurementitempurchase as FormControl;
  }

  get dateField(): FormControl{
    return this.form.controls.date as FormControl;
  }

  get amountField(): FormControl{
    return this.form.controls.amount as FormControl;
  }

  get paymenttypeField(): FormControl{
    return this.form.controls.paymenttype as FormControl;
  }

  get chequenoField(): FormControl{
    return this.form.controls.chequeno as FormControl;
  }

  get chequedateField(): FormControl{
    return this.form.controls.chequedate as FormControl;
  }

  get chequebankField(): FormControl{
    return this.form.controls.chequebank as FormControl;
  }

  get chequebranchField(): FormControl{
    return this.form.controls.chequebranch as FormControl;
  }

  get procurementitemsField(): FormControl{
    return this.form.controls.procurementitems as FormControl;
  }

  get descriptionField(): FormControl{
    return this.form.controls.description as FormControl;
  }

  get searchProcurementitempurchaseField(): FormControl{
    return this.form.controls.searchProcurementitempurchase as FormControl;
  }

  constructor(
    private procurementitempurchaseService: ProcurementitempurchaseService,
    private paymenttypeService: PaymenttypeService,
    private procurementitemService: ProcurementitemService,
    private procurementrefundService: ProcurementrefundService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {
    super();
    this.filteredOptions = this.searchProcurementitempurchaseField.valueChanges
      .pipe(
        startWith(''),
        map(procurementitempurchase => procurementitempurchase ? this._filterProcurementitempurchases(procurementitempurchase) : this.procurementitempurchases.slice())
      );
  }

  private _filterProcurementitempurchases(value: string): Procurementitempurchase[] {
    const filterValue = value.toLowerCase();

    return this.procurementitempurchases.filter(procurementitempurchase => procurementitempurchase.code.toLowerCase().indexOf(filterValue) === 0);
  }
  ngOnInit(): void {
    this.loadData();
    this.refreshData();
    this.paymentValidation();
  }

async loadData(): Promise<any>{

    this.updatePrivileges();
    if (!this.privilege.add) { return; }

    this.procurementitempurchaseService.getAllNoneRefunded().then((procurementitempurchases) => {
      this.procurementitempurchases = procurementitempurchases;
    }).catch((e) => {
      console.log(e);
      this.snackBar.open('Something is wrong', null, {duration: 2000});
    });
    this.paymenttypeService.getAll().then((paymenttypes) => {
      this.paymenttypes = paymenttypes;
    }).catch((e) => {
      console.log(e);
      this.snackBar.open('Something is wrong', null, {duration: 2000});
    });
  }

  updatePrivileges(): any {
    this.privilege.add = LoggedUser.can(UsecaseList.ADD_PROCUREMENTREFUND);
    this.privilege.showAll = LoggedUser.can(UsecaseList.SHOW_ALL_PROCUREMENTREFUNDS);
    this.privilege.showOne = LoggedUser.can(UsecaseList.SHOW_PROCUREMENTREFUND_DETAILS);
    this.privilege.delete = LoggedUser.can(UsecaseList.DELETE_PROCUREMENTREFUND);
    this.privilege.update = LoggedUser.can(UsecaseList.UPDATE_PROCUREMENTREFUND);
  }

  async submit(): Promise<void> {
    this.procurementitemsField.updateValueAndValidity();
    this.procurementitemsField.markAsTouched();
    if (this.form.invalid) { return; }

    const procurementrefund: Procurementrefund = new Procurementrefund();
    procurementrefund.procurementitempurchase = this.procurementitempurchaseField.value;
    procurementrefund.amount = this.amountField.value;
    procurementrefund.paymenttype = this.paymenttypeField.value;
    procurementrefund.chequeno = this.chequenoField.value;
    procurementrefund.chequedate = this.chequedateField.value ? DateHelper.getDateAsString(this.chequedateField.value) : null;
    procurementrefund.chequebank = this.chequebankField.value;
    procurementrefund.chequebranch = this.chequebranchField.value;
    procurementrefund.procurementitemList = this.procurementitemsField.value;
    procurementrefund.description = this.descriptionField.value;
    try{
      const resourceLink: ResourceLink = await this.procurementrefundService.add(procurementrefund);
      if (this.privilege.showOne) {
        await this.router.navigateByUrl('/procurementrefunds/' + resourceLink.id);
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
          if (msg.procurementitempurchase) { this.procurementitempurchaseField.setErrors({server: msg.procurementitempurchase}); knownError = true; }
          if (msg.date) { this.dateField.setErrors({server: msg.date}); knownError = true; }
          if (msg.amount) { this.amountField.setErrors({server: msg.amount}); knownError = true; }
          if (msg.paymenttype) { this.paymenttypeField.setErrors({server: msg.paymenttype}); knownError = true; }
          if (msg.chequeno) { this.chequenoField.setErrors({server: msg.chequeno}); knownError = true; }
          if (msg.chequedate) { this.chequedateField.setErrors({server: msg.chequedate}); knownError = true; }
          if (msg.chequebank) { this.chequebankField.setErrors({server: msg.chequebank}); knownError = true; }
          if (msg.chequebranch) { this.chequebranchField.setErrors({server: msg.chequebranch}); knownError = true; }
          if (msg.procurementitemList) { this.procurementitemsField.setErrors({server: msg.procurementitemList}); knownError = true; }
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

  paymentValidation(): void {
    if (this.paymenttypeField.value === 2){
      this.chequenoField.setValidators([
        Validators.required,
        Validators.minLength(null),
        Validators.maxLength(45),
        Validators.pattern('^[0-9]{5,}$'),
      ]);
      this.chequenoField.updateValueAndValidity();
      this.chequedateField.setValidators([
        Validators.required,
      ]);
      this.chequedateField.updateValueAndValidity();
      this.chequebankField.setValidators([
        Validators.required,
        Validators.minLength(null),
        Validators.maxLength(45),
        Validators.pattern('^[a-zA-Z ]{3,}$'),
      ]);
      this.chequebankField.updateValueAndValidity();
      this.chequebranchField.setValidators([
        Validators.required,
        Validators.minLength(null),
        Validators.maxLength(45),
        Validators.pattern('^[a-zA-Z ]{3,}$'),
      ]);
      this.chequebranchField.updateValueAndValidity();

    }else {
      this.chequenoField.setValidators(null);
      this.chequenoField.updateValueAndValidity();
      this.chequenoField.reset();

      this.chequedateField.setValidators(null);
      this.chequedateField.updateValueAndValidity();
      this.chequedateField.reset();

      this.chequebankField.setValidators(null);
      this.chequebankField.updateValueAndValidity();
      this.chequebankField.reset();

      this.chequebranchField.setValidators(null);
      this.chequebranchField.updateValueAndValidity();
      this.chequebranchField.reset();
    }
  }

  setSearchValue(option: any): void{
    console.log(option);
    this.procurementitempurchaseField.patchValue(option);
    this.searchProcurementitempurchaseField.disable();
  }

  loadItems(): void{
    this.procurementitemService.getAllItemByPurchaseForRefund(this.procurementitempurchaseField.value.id).then((procurementitemes) => {
      this.procurementitems = procurementitemes;
    }).catch((e) => {
      console.log(e);
      this.snackBar.open('Something is wrong', null, {duration: 2000});
    });
  }
}
