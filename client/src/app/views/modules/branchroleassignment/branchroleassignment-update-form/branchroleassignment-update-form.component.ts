import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {MatSnackBar} from '@angular/material/snack-bar';
import {LoggedUser} from '../../../../shared/logged-user';
import {UsecaseList} from '../../../../usecase-list';
import {ResourceLink} from '../../../../shared/resource-link';
import {AbstractComponent} from '../../../../shared/abstract-component';
import {PageRequest} from '../../../../shared/page-request';
import {Branchroleassignment} from '../../../../entities/branchroleassignment';
import {BranchroleassignmentService} from '../../../../services/branchroleassignment.service';
import {Branch} from '../../../../entities/branch';
import {Employee} from '../../../../entities/employee';
import {DateHelper} from '../../../../shared/date-helper';
import {Branchrole} from '../../../../entities/branchrole';
import {BranchService} from '../../../../services/branch.service';
import {EmployeeService} from '../../../../services/employee.service';
import {BranchroleService} from '../../../../services/branchrole.service';
import {Branchroleassignmentstatus} from '../../../../entities/branchroleassignmentstatus';
import {BranchroleassignmentstatusService} from '../../../../services/branchroleassignmentstatus.service';

@Component({
  selector: 'app-branchroleassignment-update-form',
  templateUrl: './branchroleassignment-update-form.component.html',
  styleUrls: ['./branchroleassignment-update-form.component.scss']
})
export class BranchroleassignmentUpdateFormComponent extends AbstractComponent implements OnInit {

  selectedId: number;
  branchroleassignment: Branchroleassignment;

  branches: Branch[] = [];
  branchroles: Branchrole[] = [];
  employees: Employee[] = [];
  branchroleassignmentstatuses: Branchroleassignmentstatus[] = [];

  form = new FormGroup({
    branch: new FormControl(null, [
      Validators.required,
    ]),
    branchrole: new FormControl(null, [
      Validators.required,
    ]),
    employee: new FormControl(null, [
      Validators.required,
    ]),
    dogrant: new FormControl(null, [
      Validators.required,
    ]),
    dorevoke: new FormControl(null, [
    ]),
    branchroleassignmentstatus: new FormControl('1', [
      Validators.required,
    ]),
    allowance: new FormControl(null, [
      Validators.min(0),
      Validators.max(10000000),
      Validators.pattern('^([0-9]{1,8}([.][0-9]{1,2})?)$'),
    ]),
  });

  get branchField(): FormControl{
    return this.form.controls.branch as FormControl;
  }

  get branchroleField(): FormControl{
    return this.form.controls.branchrole as FormControl;
  }

  get employeeField(): FormControl{
    return this.form.controls.employee as FormControl;
  }

  get dograntField(): FormControl{
    return this.form.controls.dogrant as FormControl;
  }

  get dorevokeField(): FormControl{
    return this.form.controls.dorevoke as FormControl;
  }

  get branchroleassignmentstatusField(): FormControl{
    return this.form.controls.branchroleassignmentstatus as FormControl;
  }

  get allowanceField(): FormControl{
    return this.form.controls.allowance as FormControl;
  }

  constructor(
    private branchService: BranchService,
    private branchroleService: BranchroleService,
    private employeeService: EmployeeService,
    private branchroleassignmentstatusService: BranchroleassignmentstatusService,
    private branchroleassignmentService: BranchroleassignmentService,
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
    if (this.branchField.value){
      this.branchroleService.getAllByBranch(this.branchField.value).then((branchroleDataPage) => {
        this.branchroles = branchroleDataPage;
      }).catch((e) => {
        console.log(e);
        this.snackBar.open('Something is wrong', null, {duration: 2000});
      });
    }
    if (this.branchField.value && this.branchroleField.value){
      const branchrole: Branchrole = await this.branchroleService.get(this.branchroleField.value);
      this.employeeService.getAllByBranchAndDepartment(this.branchField.value, branchrole.department.id).then((employeeDataPage) => {
        this.employees = employeeDataPage;
      }).catch((e) => {
        console.log(e);
        this.snackBar.open('Something is wrong', null, {duration: 2000});
      });
    }
    this.branchroleassignmentstatusService.getAll().then((branchroleassignmentstatuses) => {
      this.branchroleassignmentstatuses = branchroleassignmentstatuses;
    }).catch((e) => {
      console.log(e);
      this.snackBar.open('Something is wrong', null, {duration: 2000});
    });
    this.branchroleassignment = await this.branchroleassignmentService.get(this.selectedId);
    this.setValues();
  }

  updatePrivileges(): any {
    this.privilege.add = LoggedUser.can(UsecaseList.ADD_BRANCHROLEASSIGNMENT);
    this.privilege.showAll = LoggedUser.can(UsecaseList.SHOW_ALL_BRANCHROLEASSIGNMENTS);
    this.privilege.showOne = LoggedUser.can(UsecaseList.SHOW_BRANCHROLEASSIGNMENT_DETAILS);
    this.privilege.delete = LoggedUser.can(UsecaseList.DELETE_BRANCHROLEASSIGNMENT);
    this.privilege.update = LoggedUser.can(UsecaseList.UPDATE_BRANCHROLEASSIGNMENT);
  }

  discardChanges(): void{
    this.form.markAsPristine();
    this.form.markAsUntouched();
    this.setValues();
  }

  setValues(): void{
    if (this.branchField.pristine) {
      this.branchField.setValue(this.branchroleassignment.branch.id);
    }
    if (this.branchroleField.pristine) {
      this.branchroleField.setValue(this.branchroleassignment.branchrole.id);
    }
    if (this.employeeField.pristine) {
      this.employeeField.setValue(this.branchroleassignment.employee.id);
    }
    if (this.dograntField.pristine) {
      this.dograntField.setValue(this.branchroleassignment.dogrant);
    }
    if (this.dorevokeField.pristine) {
      this.dorevokeField.setValue(this.branchroleassignment.dorevoke);
    }
    if (this.branchroleassignmentstatusField.pristine) {
      this.branchroleassignmentstatusField.setValue(this.branchroleassignment.branchroleassignmentstatus.id);
    }
    if (this.allowanceField.pristine) {
      this.allowanceField.setValue(this.branchroleassignment.allowance);
    }
}

  async submit(): Promise<void> {
    if (this.form.invalid) { return; }

    const newbranchroleassignment: Branchroleassignment = new Branchroleassignment();
    newbranchroleassignment.branch = this.branchField.value;
    newbranchroleassignment.branchrole = this.branchroleField.value;
    newbranchroleassignment.employee = this.employeeField.value;
    newbranchroleassignment.dogrant = DateHelper.getDateAsString(this.dograntField.value);
    newbranchroleassignment.dorevoke = this.dorevokeField.value ? DateHelper.getDateAsString(this.dorevokeField.value) : null;
    newbranchroleassignment.branchroleassignmentstatus = this.branchroleassignmentstatusField.value;
    newbranchroleassignment.allowance = this.allowanceField.value;
    try{
      const resourceLink: ResourceLink = await this.branchroleassignmentService.update(this.selectedId, newbranchroleassignment);
      if (this.privilege.showOne) {
        await this.router.navigateByUrl('/branchroleassignments/' + resourceLink.id);
      } else {
        await this.router.navigateByUrl('/branchroleassignments');
      }
    }catch (e) {
      switch (e.status) {
        case 401: break;
        case 403: this.snackBar.open(e.error.message, null, {duration: 2000}); break;
        case 400:
          const msg = JSON.parse(e.error.message);
          let knownError = false;
          if (msg.branch) { this.branchField.setErrors({server: msg.branch}); knownError = true; }
          if (msg.branchrole) { this.branchroleField.setErrors({server: msg.branchrole}); knownError = true; }
          if (msg.employee) { this.employeeField.setErrors({server: msg.employee}); knownError = true; }
          if (msg.dogrant) { this.dograntField.setErrors({server: msg.dogrant}); knownError = true; }
          if (msg.dorevoke) { this.dorevokeField.setErrors({server: msg.dorevoke}); knownError = true; }
          if (msg.branchroleassignmentstatus) { this.branchroleassignmentstatusField.setErrors({server: msg.branchroleassignmentstatus}); knownError = true; }
          if (msg.allowance) { this.allowanceField.setErrors({server: msg.allowance}); knownError = true; }
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
