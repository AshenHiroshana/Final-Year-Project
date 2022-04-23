import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {MatSnackBar} from '@angular/material/snack-bar';
import {LoggedUser} from '../../../../shared/logged-user';
import {UsecaseList} from '../../../../usecase-list';
import {ResourceLink} from '../../../../shared/resource-link';
import {AbstractComponent} from '../../../../shared/abstract-component';
import {PageRequest} from '../../../../shared/page-request';
import {Branchrole} from '../../../../entities/branchrole';
import {BranchroleService} from '../../../../services/branchrole.service';
import {Branch} from '../../../../entities/branch';
import {Department} from '../../../../entities/department';
import {BranchService} from '../../../../services/branch.service';
import {Branchrolestatus} from '../../../../entities/branchrolestatus';
import {DepartmentService} from '../../../../services/department.service';
import {BranchrolestatusService} from '../../../../services/branchrolestatus.service';

@Component({
  selector: 'app-branchrole-update-form',
  templateUrl: './branchrole-update-form.component.html',
  styleUrls: ['./branchrole-update-form.component.scss']
})
export class BranchroleUpdateFormComponent extends AbstractComponent implements OnInit {

  selectedId: number;
  branchrole: Branchrole;

  branches: Branch[] = [];
  branchrolestatuses: Branchrolestatus[] = [];
  departments: Department[] = [];

  form = new FormGroup({
    branch: new FormControl(null, [
      Validators.required,
    ]),
    name: new FormControl(null, [
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(255),
      Validators.pattern('^[a-zA-Z ]{3,}$'),
    ]),
    min: new FormControl(null, [
      Validators.required,
      Validators.min(-2147483648),
      Validators.max(2147483647),
      Validators.pattern('^([0-9]*)$'),
    ]),
    max: new FormControl(null, [
      Validators.required,
      Validators.min(-2147483648),
      Validators.max(2147483647),
      Validators.pattern('^([0-9]*)$'),
    ]),
    branchrolestatus: new FormControl('1', [
      Validators.required,
    ]),
    allowance: new FormControl(null, [
      Validators.min(0),
      Validators.max(10000000),
      Validators.pattern('^([0-9]{1,8}([.][0-9]{1,2})?)$'),
    ]),
    department: new FormControl(null, [
      Validators.required,
    ]),
  });

  get branchField(): FormControl{
    return this.form.controls.branch as FormControl;
  }

  get nameField(): FormControl{
    return this.form.controls.name as FormControl;
  }

  get minField(): FormControl{
    return this.form.controls.min as FormControl;
  }

  get maxField(): FormControl{
    return this.form.controls.max as FormControl;
  }

  get branchrolestatusField(): FormControl{
    return this.form.controls.branchrolestatus as FormControl;
  }

  get allowanceField(): FormControl{
    return this.form.controls.allowance as FormControl;
  }

  get departmentField(): FormControl{
    return this.form.controls.department as FormControl;
  }

  constructor(
    private branchService: BranchService,
    private branchrolestatusService: BranchrolestatusService,
    private departmentService: DepartmentService,
    private branchroleService: BranchroleService,
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
    this.branchrolestatusService.getAll().then((branchrolestatuses) => {
      this.branchrolestatuses = branchrolestatuses;
    }).catch((e) => {
      console.log(e);
      this.snackBar.open('Something is wrong', null, {duration: 2000});
    });
    this.departmentService.getAll().then((departments) => {
      this.departments = departments;
    }).catch((e) => {
      console.log(e);
      this.snackBar.open('Something is wrong', null, {duration: 2000});
    });
    this.branchrole = await this.branchroleService.get(this.selectedId);
    this.setValues();
  }

  updatePrivileges(): any {
    this.privilege.add = LoggedUser.can(UsecaseList.ADD_BRANCHROLE);
    this.privilege.showAll = LoggedUser.can(UsecaseList.SHOW_ALL_BRANCHROLES);
    this.privilege.showOne = LoggedUser.can(UsecaseList.SHOW_BRANCHROLE_DETAILS);
    this.privilege.delete = LoggedUser.can(UsecaseList.DELETE_BRANCHROLE);
    this.privilege.update = LoggedUser.can(UsecaseList.UPDATE_BRANCHROLE);
  }

  discardChanges(): void{
    this.form.markAsPristine();
    this.form.markAsUntouched();
    this.setValues();
  }

  setValues(): void{
    if (this.branchField.pristine) {
      this.branchField.setValue(this.branchrole.branch.id);
    }
    if (this.nameField.pristine) {
      this.nameField.setValue(this.branchrole.name);
    }
    if (this.minField.pristine) {
      this.minField.setValue(this.branchrole.min);
    }
    if (this.maxField.pristine) {
      this.maxField.setValue(this.branchrole.max);
    }
    if (this.branchrolestatusField.pristine) {
      this.branchrolestatusField.setValue(this.branchrole.branchrolestatus.id);
    }
    if (this.allowanceField.pristine) {
      this.allowanceField.setValue(this.branchrole.allowance);
    }
    if (this.departmentField.pristine) {
      this.departmentField.setValue(this.branchrole.department.id);
    }
}

  async submit(): Promise<void> {
    if (this.form.invalid) { return; }

    const newbranchrole: Branchrole = new Branchrole();
    newbranchrole.branch = this.branchField.value;
    newbranchrole.name = this.nameField.value;
    newbranchrole.min = this.minField.value;
    newbranchrole.max = this.maxField.value;
    newbranchrole.branchrolestatus = this.branchrolestatusField.value;
    newbranchrole.allowance = this.allowanceField.value;
    newbranchrole.department = this.departmentField.value;
    try{
      const resourceLink: ResourceLink = await this.branchroleService.update(this.selectedId, newbranchrole);
      if (this.privilege.showOne) {
        await this.router.navigateByUrl('/branchroles/' + resourceLink.id);
      } else {
        await this.router.navigateByUrl('/branchroles');
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
          if (msg.min) { this.minField.setErrors({server: msg.min}); knownError = true; }
          if (msg.max) { this.maxField.setErrors({server: msg.max}); knownError = true; }
          if (msg.branchrolestatus) { this.branchrolestatusField.setErrors({server: msg.branchrolestatus}); knownError = true; }
          if (msg.allowance) { this.allowanceField.setErrors({server: msg.allowance}); knownError = true; }
          if (msg.department) { this.departmentField.setErrors({server: msg.department}); knownError = true; }
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
