import { Component, OnInit } from '@angular/core';
import {ResourceLink} from '../../../../shared/resource-link';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Router} from '@angular/router';
import {AbstractComponent} from '../../../../shared/abstract-component';
import {LoggedUser} from '../../../../shared/logged-user';
import {UsecaseList} from '../../../../usecase-list';
import {PageRequest} from '../../../../shared/page-request';
import {Printorder} from '../../../../entities/printorder';
import {PrintorderService} from '../../../../services/printorder.service';
import {Branch} from '../../../../entities/branch';
import {Material} from '../../../../entities/material';
import {DateHelper} from '../../../../shared/date-helper';
import {BranchService} from '../../../../services/branch.service';
import {MaterialService} from '../../../../services/material.service';

@Component({
  selector: 'app-printorder-form',
  templateUrl: './printorder-form.component.html',
  styleUrls: ['./printorder-form.component.scss']
})
export class PrintorderFormComponent extends AbstractComponent implements OnInit {

  branches: Branch[] = [];
  materials: Material[] = [];

  form = new FormGroup({
    branch: new FormControl(null, [
      Validators.required,
    ]),
    material: new FormControl(null, [
      Validators.required,
    ]),
    qty: new FormControl(null, [
      Validators.required,
      Validators.min(-2147483648),
      Validators.max(2147483647),
      Validators.pattern('^([0-9]*)$'),
    ]),
    ordereddate: new FormControl(null, [
      Validators.required,
    ]),
    requireddate: new FormControl(null, [
      Validators.required,
    ]),
  });

  get branchField(): FormControl{
    return this.form.controls.branch as FormControl;
  }

  get materialField(): FormControl{
    return this.form.controls.material as FormControl;
  }

  get qtyField(): FormControl{
    return this.form.controls.qty as FormControl;
  }

  get ordereddateField(): FormControl{
    return this.form.controls.ordereddate as FormControl;
  }

  get requireddateField(): FormControl{
    return this.form.controls.requireddate as FormControl;
  }

  constructor(
    private branchService: BranchService,
    private materialService: MaterialService,
    private printorderService: PrintorderService,
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
    this.materialService.getAllForPrintOrder().then((materialDataPage) => {
      this.materials = materialDataPage;
    }).catch((e) => {
      console.log(e);
      this.snackBar.open('Something is wrong', null, {duration: 2000});
    });
  }

  updatePrivileges(): any {
    this.privilege.add = LoggedUser.can(UsecaseList.ADD_PRINTORDER);
    this.privilege.showAll = LoggedUser.can(UsecaseList.SHOW_ALL_PRINTORDERS);
    this.privilege.showOne = LoggedUser.can(UsecaseList.SHOW_PRINTORDER_DETAILS);
    this.privilege.delete = LoggedUser.can(UsecaseList.DELETE_PRINTORDER);
    this.privilege.update = LoggedUser.can(UsecaseList.UPDATE_PRINTORDER);
  }

  async submit(): Promise<void> {
    if (this.form.invalid) { return; }

    const printorder: Printorder = new Printorder();
    printorder.branch = this.branchField.value;
    printorder.material = this.materialField.value;
    printorder.qty = this.qtyField.value;
    printorder.ordereddate = DateHelper.getDateAsString(this.ordereddateField.value);
    printorder.requireddate = DateHelper.getDateAsString(this.requireddateField.value);
    try{
      const resourceLink: ResourceLink = await this.printorderService.add(printorder);
      if (this.privilege.showOne) {
        await this.router.navigateByUrl('/printorders/' + resourceLink.id);
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
          if (msg.material) { this.materialField.setErrors({server: msg.material}); knownError = true; }
          if (msg.qty) { this.qtyField.setErrors({server: msg.qty}); knownError = true; }
          if (msg.ordereddate) { this.ordereddateField.setErrors({server: msg.ordereddate}); knownError = true; }
          if (msg.requireddate) { this.requireddateField.setErrors({server: msg.requireddate}); knownError = true; }
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
