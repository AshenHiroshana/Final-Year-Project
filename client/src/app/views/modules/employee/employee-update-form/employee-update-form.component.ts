import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {MatSnackBar} from '@angular/material/snack-bar';
import {LoggedUser} from '../../../../shared/logged-user';
import {UsecaseList} from '../../../../usecase-list';
import {ResourceLink} from '../../../../shared/resource-link';
import {AbstractComponent} from '../../../../shared/abstract-component';
import {PageRequest} from '../../../../shared/page-request';
import {Employee} from '../../../../entities/employee';
import {EmployeeService} from '../../../../services/employee.service';
import {ViewChild} from '@angular/core';
import {Gender} from '../../../../entities/gender';
import {Branch} from '../../../../entities/branch';
import {Nametitle} from '../../../../entities/nametitle';
import {DateHelper} from '../../../../shared/date-helper';
import {Civilstatus} from '../../../../entities/civilstatus';
import {GenderService} from '../../../../services/gender.service';
import {BranchService} from '../../../../services/branch.service';
import {Employeestatus} from '../../../../entities/employeestatus';
import {NametitleService} from '../../../../services/nametitle.service';
import {CivilstatusService} from '../../../../services/civilstatus.service';
import {EmployeestatusService} from '../../../../services/employeestatus.service';
import {WorkexperienceUpdateSubFormComponent} from './workexperience-update-sub-form/workexperience-update-sub-form.component';
import {EducationqualificationUpdateSubFormComponent} from './educationqualification-update-sub-form/educationqualification-update-sub-form.component';

@Component({
  selector: 'app-employee-update-form',
  templateUrl: './employee-update-form.component.html',
  styleUrls: ['./employee-update-form.component.scss']
})
export class EmployeeUpdateFormComponent extends AbstractComponent implements OnInit {

  selectedId: number;
  employee: Employee;

  nametitles: Nametitle[] = [];
  genders: Gender[] = [];
  civilstatuses: Civilstatus[] = [];
  employeestatuses: Employeestatus[] = [];
  branches: Branch[] = [];
  @ViewChild(EducationqualificationUpdateSubFormComponent) educationqualificationUpdateSubForm: EducationqualificationUpdateSubFormComponent;
  @ViewChild(WorkexperienceUpdateSubFormComponent) workexperienceUpdateSubForm: WorkexperienceUpdateSubFormComponent;

  form = new FormGroup({
    nametitle: new FormControl(null, [
      Validators.required,
    ]),
    callingname: new FormControl(null, [
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(255),
      Validators.pattern('^[a-zA-Z ]{3,}$'),
    ]),
    fullname: new FormControl(null, [
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(255),
      Validators.pattern('^[a-zA-Z ]{3,}$'),
    ]),
    photo: new FormControl(),
    gender: new FormControl(null, [
      Validators.required,
    ]),
    civilstatus: new FormControl(null, [
      Validators.required,
    ]),
    employeestatus: new FormControl('1', [
      Validators.required,
    ]),
    dobirth: new FormControl(null, [
      Validators.required,
    ]),
    nic: new FormControl(null, [
      Validators.required,
      Validators.minLength(10),
      Validators.maxLength(12),
      Validators.pattern('^(([0-9]{12})|([0-9]{9}[vVxX]))$'),
    ]),
    address: new FormControl(null, [
      Validators.required,
      Validators.minLength(4),
      Validators.maxLength(65535),
    ]),
    mobile: new FormControl(null, [
      Validators.required,
      Validators.minLength(9),
      Validators.maxLength(10),
      Validators.pattern('^[0][7][0-9]{8}$'),
    ]),
    land: new FormControl(null, [
      Validators.minLength(9),
      Validators.maxLength(10),
      Validators.pattern('^[0][0-9]{9}$'),
    ]),
    email: new FormControl(null, [
      Validators.minLength(5),
      Validators.maxLength(255),
      Validators.pattern('^[a-zA-Z0-9]{1,}[@][a-zA-Z0-9]{1,}[.][a-zA-Z0-9]{1,}$'),
    ]),
    dorecruit: new FormControl(null, [
      Validators.required,
    ]),
    branches: new FormControl(),
    educationqualifications: new FormControl(),
    workexperiences: new FormControl(),
    epfno: new FormControl(null, [
      Validators.minLength(null),
      Validators.maxLength(255),
    ]),
    doresigned: new FormControl(null, [
    ]),
    bankaccountno: new FormControl(null, [
      Validators.minLength(null),
      Validators.maxLength(255),
    ]),
    bankname: new FormControl(null, [
      Validators.minLength(null),
      Validators.maxLength(255),
    ]),
    bankbranch: new FormControl(null, [
      Validators.minLength(null),
      Validators.maxLength(255),
    ]),
    description: new FormControl(null, [
      Validators.minLength(null),
      Validators.maxLength(65535),
    ]),
  });

  get nametitleField(): FormControl{
    return this.form.controls.nametitle as FormControl;
  }

  get callingnameField(): FormControl{
    return this.form.controls.callingname as FormControl;
  }

  get fullnameField(): FormControl{
    return this.form.controls.fullname as FormControl;
  }

  get photoField(): FormControl{
    return this.form.controls.photo as FormControl;
  }

  get genderField(): FormControl{
    return this.form.controls.gender as FormControl;
  }

  get civilstatusField(): FormControl{
    return this.form.controls.civilstatus as FormControl;
  }

  get employeestatusField(): FormControl{
    return this.form.controls.employeestatus as FormControl;
  }

  get dobirthField(): FormControl{
    return this.form.controls.dobirth as FormControl;
  }

  get nicField(): FormControl{
    return this.form.controls.nic as FormControl;
  }

  get addressField(): FormControl{
    return this.form.controls.address as FormControl;
  }

  get mobileField(): FormControl{
    return this.form.controls.mobile as FormControl;
  }

  get landField(): FormControl{
    return this.form.controls.land as FormControl;
  }

  get emailField(): FormControl{
    return this.form.controls.email as FormControl;
  }

  get dorecruitField(): FormControl{
    return this.form.controls.dorecruit as FormControl;
  }

  get branchesField(): FormControl{
    return this.form.controls.branches as FormControl;
  }

  get educationqualificationsField(): FormControl{
    return this.form.controls.educationqualifications as FormControl;
  }

  get workexperiencesField(): FormControl{
    return this.form.controls.workexperiences as FormControl;
  }

  get epfnoField(): FormControl{
    return this.form.controls.epfno as FormControl;
  }

  get doresignedField(): FormControl{
    return this.form.controls.doresigned as FormControl;
  }

  get bankaccountnoField(): FormControl{
    return this.form.controls.bankaccountno as FormControl;
  }

  get banknameField(): FormControl{
    return this.form.controls.bankname as FormControl;
  }

  get bankbranchField(): FormControl{
    return this.form.controls.bankbranch as FormControl;
  }

  get descriptionField(): FormControl{
    return this.form.controls.description as FormControl;
  }

  constructor(
    private nametitleService: NametitleService,
    private genderService: GenderService,
    private civilstatusService: CivilstatusService,
    private employeestatusService: EmployeestatusService,
    private branchService: BranchService,
    private employeeService: EmployeeService,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar,
    private router: Router
  ) {
    super();
  }

  getBranchToString = (obj: Branch) => `${obj.city}`;
  ngOnInit(): void {
    this.genderService.getAll().then((genders) => {
      this.genders = genders;
    }).catch((e) => {
      console.log(e);
      this.snackBar.open('Something is wrong', null, {duration: 2000});
    });
    this.civilstatusService.getAll().then((civilstatuses) => {
      this.civilstatuses = civilstatuses;
    }).catch((e) => {
      console.log(e);
      this.snackBar.open('Something is wrong', null, {duration: 2000});
    });
    this.employeestatusService.getAll().then((employeestatuses) => {
      this.employeestatuses = employeestatuses;
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
    this.route.paramMap.subscribe( async (params) => {
      this.selectedId =  + params.get('id');
      await this.loadData();
      this.refreshData();
    });
  }

  async loadData(): Promise<any>{

    this.updatePrivileges();
    if (!this.privilege.update) { return; }

    this.nametitleService.getAll().then((nametitles) => {
      this.nametitles = nametitles;
    }).catch((e) => {
      console.log(e);
      this.snackBar.open('Something is wrong', null, {duration: 2000});
    });
    this.employee = await this.employeeService.get(this.selectedId);
    this.setValues();
  }

  updatePrivileges(): any {
    this.privilege.add = LoggedUser.can(UsecaseList.ADD_EMPLOYEE);
    this.privilege.showAll = LoggedUser.can(UsecaseList.SHOW_ALL_EMPLOYEES);
    this.privilege.showOne = LoggedUser.can(UsecaseList.SHOW_EMPLOYEE_DETAILS);
    this.privilege.delete = LoggedUser.can(UsecaseList.DELETE_EMPLOYEE);
    this.privilege.update = LoggedUser.can(UsecaseList.UPDATE_EMPLOYEE);
  }

  discardChanges(): void{
    this.form.markAsPristine();
    this.form.markAsUntouched();
    this.setValues();
  }

  setValues(): void{
    if (this.nametitleField.pristine) {
      this.nametitleField.setValue(this.employee.nametitle.id);
    }
    if (this.callingnameField.pristine) {
      this.callingnameField.setValue(this.employee.callingname);
    }
    if (this.fullnameField.pristine) {
      this.fullnameField.setValue(this.employee.fullname);
    }
    if (this.photoField.pristine) {
      if (this.employee.photo) { this.photoField.setValue([this.employee.photo]); }
      else { this.photoField.setValue([]); }
    }
    if (this.genderField.pristine) {
      this.genderField.setValue(this.employee.gender.id);
    }
    if (this.civilstatusField.pristine) {
      this.civilstatusField.setValue(this.employee.civilstatus.id);
    }
    if (this.employeestatusField.pristine) {
      this.employeestatusField.setValue(this.employee.employeestatus.id);
    }
    if (this.dobirthField.pristine) {
      this.dobirthField.setValue(this.employee.dobirth);
    }
    if (this.nicField.pristine) {
      this.nicField.setValue(this.employee.nic);
    }
    if (this.addressField.pristine) {
      this.addressField.setValue(this.employee.address);
    }
    if (this.mobileField.pristine) {
      this.mobileField.setValue(this.employee.mobile);
    }
    if (this.landField.pristine) {
      this.landField.setValue(this.employee.land);
    }
    if (this.emailField.pristine) {
      this.emailField.setValue(this.employee.email);
    }
    if (this.dorecruitField.pristine) {
      this.dorecruitField.setValue(this.employee.dorecruit);
    }
    if (this.branchesField.pristine) {
      this.branchesField.setValue(this.employee.branchList);
    }
    if (this.educationqualificationsField.pristine) {
      this.educationqualificationsField.setValue(this.employee.educationqualificationList);
    }
    if (this.workexperiencesField.pristine) {
      this.workexperiencesField.setValue(this.employee.workexperienceList);
    }
    if (this.epfnoField.pristine) {
      this.epfnoField.setValue(this.employee.epfno);
    }
    if (this.doresignedField.pristine) {
      this.doresignedField.setValue(this.employee.doresigned);
    }
    if (this.bankaccountnoField.pristine) {
      this.bankaccountnoField.setValue(this.employee.bankaccountno);
    }
    if (this.banknameField.pristine) {
      this.banknameField.setValue(this.employee.bankname);
    }
    if (this.bankbranchField.pristine) {
      this.bankbranchField.setValue(this.employee.bankbranch);
    }
    if (this.descriptionField.pristine) {
      this.descriptionField.setValue(this.employee.description);
    }
}

  async submit(): Promise<void> {
    this.photoField.updateValueAndValidity();
    this.photoField.markAsTouched();
    this.branchesField.updateValueAndValidity();
    this.branchesField.markAsTouched();
    this.educationqualificationUpdateSubForm.resetForm();
    this.educationqualificationsField.markAsDirty();
    this.workexperienceUpdateSubForm.resetForm();
    this.workexperiencesField.markAsDirty();
    if (this.form.invalid) { return; }

    const newemployee: Employee = new Employee();
    newemployee.nametitle = this.nametitleField.value;
    newemployee.callingname = this.callingnameField.value;
    newemployee.fullname = this.fullnameField.value;
    const photoIds = this.photoField.value;
    if (photoIds !== null && photoIds !== []){
      newemployee.photo = photoIds[0];
    }else{
      newemployee.photo = null;
    }
    newemployee.gender = this.genderField.value;
    newemployee.civilstatus = this.civilstatusField.value;
    newemployee.employeestatus = this.employeestatusField.value;
    newemployee.dobirth = DateHelper.getDateAsString(this.dobirthField.value);
    newemployee.nic = this.nicField.value;
    newemployee.address = this.addressField.value;
    newemployee.mobile = this.mobileField.value;
    newemployee.land = this.landField.value;
    newemployee.email = this.emailField.value;
    newemployee.dorecruit = DateHelper.getDateAsString(this.dorecruitField.value);
    newemployee.branchList = this.branchesField.value;
    newemployee.educationqualificationList = this.educationqualificationsField.value;
    newemployee.workexperienceList = this.workexperiencesField.value;
    newemployee.epfno = this.epfnoField.value;
    newemployee.doresigned = this.doresignedField.value ? DateHelper.getDateAsString(this.doresignedField.value) : null;
    newemployee.bankaccountno = this.bankaccountnoField.value;
    newemployee.bankname = this.banknameField.value;
    newemployee.bankbranch = this.bankbranchField.value;
    newemployee.description = this.descriptionField.value;
    try{
      const resourceLink: ResourceLink = await this.employeeService.update(this.selectedId, newemployee);
      if (this.privilege.showOne) {
        await this.router.navigateByUrl('/employees/' + resourceLink.id);
      } else {
        await this.router.navigateByUrl('/employees');
      }
    }catch (e) {
      switch (e.status) {
        case 401: break;
        case 403: this.snackBar.open(e.error.message, null, {duration: 2000}); break;
        case 400:
          const msg = JSON.parse(e.error.message);
          let knownError = false;
          if (msg.nametitle) { this.nametitleField.setErrors({server: msg.nametitle}); knownError = true; }
          if (msg.callingname) { this.callingnameField.setErrors({server: msg.callingname}); knownError = true; }
          if (msg.fullname) { this.fullnameField.setErrors({server: msg.fullname}); knownError = true; }
          if (msg.photo) { this.photoField.setErrors({server: msg.photo}); knownError = true; }
          if (msg.gender) { this.genderField.setErrors({server: msg.gender}); knownError = true; }
          if (msg.civilstatus) { this.civilstatusField.setErrors({server: msg.civilstatus}); knownError = true; }
          if (msg.employeestatus) { this.employeestatusField.setErrors({server: msg.employeestatus}); knownError = true; }
          if (msg.dobirth) { this.dobirthField.setErrors({server: msg.dobirth}); knownError = true; }
          if (msg.nic) { this.nicField.setErrors({server: msg.nic}); knownError = true; }
          if (msg.address) { this.addressField.setErrors({server: msg.address}); knownError = true; }
          if (msg.mobile) { this.mobileField.setErrors({server: msg.mobile}); knownError = true; }
          if (msg.land) { this.landField.setErrors({server: msg.land}); knownError = true; }
          if (msg.email) { this.emailField.setErrors({server: msg.email}); knownError = true; }
          if (msg.dorecruit) { this.dorecruitField.setErrors({server: msg.dorecruit}); knownError = true; }
          if (msg.branchList) { this.branchesField.setErrors({server: msg.branchList}); knownError = true; }
          if (msg.educationqualificationList) { this.educationqualificationsField.setErrors({server: msg.educationqualificationList}); knownError = true; }
          if (msg.workexperienceList) { this.workexperiencesField.setErrors({server: msg.workexperienceList}); knownError = true; }
          if (msg.epfno) { this.epfnoField.setErrors({server: msg.epfno}); knownError = true; }
          if (msg.doresigned) { this.doresignedField.setErrors({server: msg.doresigned}); knownError = true; }
          if (msg.bankaccountno) { this.bankaccountnoField.setErrors({server: msg.bankaccountno}); knownError = true; }
          if (msg.bankname) { this.banknameField.setErrors({server: msg.bankname}); knownError = true; }
          if (msg.bankbranch) { this.bankbranchField.setErrors({server: msg.bankbranch}); knownError = true; }
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
