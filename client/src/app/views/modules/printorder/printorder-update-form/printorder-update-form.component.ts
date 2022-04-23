import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {MatSnackBar} from '@angular/material/snack-bar';
import {LoggedUser} from '../../../../shared/logged-user';
import {UsecaseList} from '../../../../usecase-list';
import {ResourceLink} from '../../../../shared/resource-link';
import {AbstractComponent} from '../../../../shared/abstract-component';
import {PageRequest} from '../../../../shared/page-request';
import {Printorder} from '../../../../entities/printorder';
import {PrintorderService} from '../../../../services/printorder.service';
import {Branch} from '../../../../entities/branch';
import {Material} from '../../../../entities/material';
import {DateHelper} from '../../../../shared/date-helper';
import {BranchService} from '../../../../services/branch.service';
import {MaterialService} from '../../../../services/material.service';
import {Printorderstatus} from '../../../../entities/printorderstatus';
import {PrintorderstatusService} from '../../../../services/printorderstatus.service';

@Component({
  selector: 'app-printorder-update-form',
  templateUrl: './printorder-update-form.component.html',
  styleUrls: ['./printorder-update-form.component.scss']
})
export class PrintorderUpdateFormComponent extends AbstractComponent implements OnInit {

  selectedId: number;
  printorder: Printorder;

  branches: Branch[] = [];
  materials: Material[] = [];
  printorderstatuses: Printorderstatus[] = [];

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
    receiveddate: new FormControl(null, [
    ]),
    printorderstatus: new FormControl('1', [
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

  get receiveddateField(): FormControl{
    return this.form.controls.receiveddate as FormControl;
  }

  get printorderstatusField(): FormControl{
    return this.form.controls.printorderstatus as FormControl;
  }

  constructor(
    private branchService: BranchService,
    private materialService: MaterialService,
    private printorderstatusService: PrintorderstatusService,
    private printorderService: PrintorderService,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar,
    private router: Router
  ) {
    super();
  }

  ngOnInit(): void {
    this.printorderstatusService.getAll().then((printorderstatuses) => {
      this.printorderstatuses = printorderstatuses;
    }).catch((e) => {
      console.log(e);
      this.snackBar.open('Something is wrong', null, {duration: 2000});
    });
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
    this.materialService.getAllBasic(new PageRequest()).then((materialDataPage) => {
      this.materials = materialDataPage.content;
    }).catch((e) => {
      console.log(e);
      this.snackBar.open('Something is wrong', null, {duration: 2000});
    });
    this.printorder = await this.printorderService.get(this.selectedId);
    this.setValues();
  }

  updatePrivileges(): any {
    this.privilege.add = LoggedUser.can(UsecaseList.ADD_PRINTORDER);
    this.privilege.showAll = LoggedUser.can(UsecaseList.SHOW_ALL_PRINTORDERS);
    this.privilege.showOne = LoggedUser.can(UsecaseList.SHOW_PRINTORDER_DETAILS);
    this.privilege.delete = LoggedUser.can(UsecaseList.DELETE_PRINTORDER);
    this.privilege.update = LoggedUser.can(UsecaseList.UPDATE_PRINTORDER);
  }

  discardChanges(): void{
    this.form.markAsPristine();
    this.form.markAsUntouched();
    this.setValues();
  }

  setValues(): void{
    if (this.branchField.pristine) {
      this.branchField.setValue(this.printorder.branch.id);
    }
    if (this.materialField.pristine) {
      this.materialField.setValue(this.printorder.material.id);
    }
    if (this.qtyField.pristine) {
      this.qtyField.setValue(this.printorder.qty);
    }
    if (this.ordereddateField.pristine) {
      this.ordereddateField.setValue(this.printorder.ordereddate);
    }
    if (this.requireddateField.pristine) {
      this.requireddateField.setValue(this.printorder.requireddate);
    }
    if (this.receiveddateField.pristine) {
      this.receiveddateField.setValue(this.printorder.receiveddate);
    }
    if (this.printorderstatusField.pristine) {
      this.printorderstatusField.setValue(this.printorder.printorderstatus.id);
    }
}

  async submit(): Promise<void> {
    if (this.form.invalid) { return; }

    const newprintorder: Printorder = new Printorder();
    newprintorder.branch = this.branchField.value;
    newprintorder.material = this.materialField.value;
    newprintorder.qty = this.qtyField.value;
    newprintorder.ordereddate = DateHelper.getDateAsString(this.ordereddateField.value);
    newprintorder.requireddate = DateHelper.getDateAsString(this.requireddateField.value);
    newprintorder.receiveddate = this.receiveddateField.value ? DateHelper.getDateAsString(this.receiveddateField.value) : null;
    newprintorder.printorderstatus = this.printorderstatusField.value;
    try{
      const resourceLink: ResourceLink = await this.printorderService.update(this.selectedId, newprintorder);
      if (this.privilege.showOne) {
        await this.router.navigateByUrl('/printorders/' + resourceLink.id);
      } else {
        await this.router.navigateByUrl('/printorders');
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
          if (msg.receiveddate) { this.receiveddateField.setErrors({server: msg.receiveddate}); knownError = true; }
          if (msg.printorderstatus) { this.printorderstatusField.setErrors({server: msg.printorderstatus}); knownError = true; }
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
