import { Component, OnInit } from '@angular/core';
import {ResourceLink} from '../../../../shared/resource-link';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Router} from '@angular/router';
import {AbstractComponent} from '../../../../shared/abstract-component';
import {LoggedUser} from '../../../../shared/logged-user';
import {UsecaseList} from '../../../../usecase-list';
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
import {NametitleService} from '../../../../services/nametitle.service';
import {CivilstatusService} from '../../../../services/civilstatus.service';
import {WorkexperienceSubFormComponent} from './workexperience-sub-form/workexperience-sub-form.component';
import {EducationqualificationSubFormComponent} from './educationqualification-sub-form/educationqualification-sub-form.component';
import {Designation} from '../../../../entities/designation';
import {AppointmentallowanceSubFormComponent} from '../../appointment/appointment-form/appointmentallowance-sub-form/appointmentallowance-sub-form.component';
import {DesignationService} from '../../../../services/designation.service';
import {AppointmentService} from '../../../../services/appointment.service';
import {Appointment} from '../../../../entities/appointment';
import {STEPPER_GLOBAL_OPTIONS} from '@angular/cdk/stepper';

@Component({
  selector: 'app-employee-form',
  templateUrl: './employee-form.component.html',
  styleUrls: ['./employee-form.component.scss'],
  providers: [{
    provide: STEPPER_GLOBAL_OPTIONS, useValue: {showError: true}
  }]
})
export class EmployeeFormComponent extends AbstractComponent implements OnInit {

  submitted = false;
  nametitles: Nametitle[] = [];
  genders: Gender[] = [];
  civilstatuses: Civilstatus[] = [];
  branches: Branch[] = [];
  designations: Designation[] = [];
  @ViewChild(EducationqualificationSubFormComponent) educationqualificationSubForm: EducationqualificationSubFormComponent;
  @ViewChild(WorkexperienceSubFormComponent) workexperienceSubForm: WorkexperienceSubFormComponent;

  basicDetailsFormGroup = new FormGroup({
    nametitle: new FormControl('', [
      Validators.required
    ]),
    callingname: new FormControl('', [
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
    gender: new FormControl(null, [
      Validators.required,
    ]),
    civilstatus: new FormControl(null, [
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
  });


  contactDetailsFormGroup = new FormGroup({
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
  });

  designationAndBankDetailsFormGroup = new FormGroup({
    designation: new FormControl(null, [
      Validators.required,
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
    epfno: new FormControl(null, [
      Validators.minLength(null),
      Validators.maxLength(255),
    ]),
    dorecruit: new FormControl(null, [
      Validators.required,
    ]),
  });

  descriptionAndPhotoFormGroup = new FormGroup({
    photo: new FormControl(),
    description: new FormControl(null, [
      Validators.minLength(null),
      Validators.maxLength(65535),
    ]),
  });

  branchFormGroup = new FormGroup({
    branches: new FormControl(),
  });

  educationqualificationDetailFormGroup = new FormGroup({
    educationqualifications: new FormControl(),
  });

  workexperienceFormGroup = new FormGroup({
    workexperiences: new FormControl(),
  });


  get nametitleField(): FormControl{
    return this.basicDetailsFormGroup.controls.nametitle as FormControl;
  }

  get callingnameField(): FormControl{
    return this.basicDetailsFormGroup.controls.callingname as FormControl;
  }

  get fullnameField(): FormControl{
    return this.basicDetailsFormGroup.controls.fullname as FormControl;
  }

  get genderField(): FormControl{
    return this.basicDetailsFormGroup.controls.gender as FormControl;
  }

  get civilstatusField(): FormControl{
    return this.basicDetailsFormGroup.controls.civilstatus as FormControl;
  }

  get dobirthField(): FormControl{
    return this.basicDetailsFormGroup.controls.dobirth as FormControl;
  }

  get nicField(): FormControl{
    return this.basicDetailsFormGroup.controls.nic as FormControl;
  }

  get photoField(): FormControl{
    return this.descriptionAndPhotoFormGroup.controls.photo as FormControl;
  }

  get addressField(): FormControl{
    return this.contactDetailsFormGroup.controls.address as FormControl;
  }

  get mobileField(): FormControl{
    return this.contactDetailsFormGroup.controls.mobile as FormControl;
  }

  get landField(): FormControl{
    return this.contactDetailsFormGroup.controls.land as FormControl;
  }

  get emailField(): FormControl{
    return this.contactDetailsFormGroup.controls.email as FormControl;
  }

  get dorecruitField(): FormControl{
    return this.designationAndBankDetailsFormGroup.controls.dorecruit as FormControl;
  }

  get branchesField(): FormControl{
    return this.branchFormGroup.controls.branches as FormControl;
  }

  get educationqualificationsField(): FormControl{
    return this.educationqualificationDetailFormGroup.controls.educationqualifications as FormControl;
  }

  get workexperiencesField(): FormControl{
    return this.workexperienceFormGroup.controls.workexperiences as FormControl;
  }

  get epfnoField(): FormControl{
    return this.designationAndBankDetailsFormGroup.controls.epfno as FormControl;
  }

  get bankaccountnoField(): FormControl{
    return this.designationAndBankDetailsFormGroup.controls.bankaccountno as FormControl;
  }

  get banknameField(): FormControl{
    return this.designationAndBankDetailsFormGroup.controls.bankname as FormControl;
  }

  get bankbranchField(): FormControl{
    return this.designationAndBankDetailsFormGroup.controls.bankbranch as FormControl;
  }

  get descriptionField(): FormControl{
    return this.descriptionAndPhotoFormGroup.controls.description as FormControl;
  }

  get designationField(): FormControl{
    return this.designationAndBankDetailsFormGroup.controls.designation as FormControl;
  }


  constructor(
    private nametitleService: NametitleService,
    private genderService: GenderService,
    private civilstatusService: CivilstatusService,
    private branchService: BranchService,
    private employeeService: EmployeeService,
    private designationService: DesignationService,
    private appointmentService: AppointmentService,
    private snackBar: MatSnackBar,
    private router: Router,
    private _formBuilder: FormBuilder,
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
    this.branchService.getAllBasic(new PageRequest()).then((branchDataPage) => {
      this.branches = branchDataPage.content;
    }).catch((e) => {
      console.log(e);
      this.snackBar.open('Something is wrong', null, {duration: 2000});
    });
    this.designationService.getAllBasic(new PageRequest()).then((designationDataPage) => {
      this.designations = designationDataPage.content;
    }).catch((e) => {
      console.log(e);
      this.snackBar.open('Something is wrong', null, {duration: 2000});
    });
    this.nametitleService.getAll().then((nametitles) => {
      this.nametitles = nametitles;
    }).catch((e) => {
      console.log(e);
      this.snackBar.open('Something is wrong', null, {duration: 2000});
    });
    this.loadData();
    this.refreshData();
  }

async loadData(): Promise<any>{

    this.updatePrivileges();
    if (!this.privilege.add) { return; }
  }

  updatePrivileges(): any {
    this.privilege.add = LoggedUser.can(UsecaseList.ADD_EMPLOYEE);
    this.privilege.showAll = LoggedUser.can(UsecaseList.SHOW_ALL_EMPLOYEES);
    this.privilege.showOne = LoggedUser.can(UsecaseList.SHOW_EMPLOYEE_DETAILS);
    this.privilege.delete = LoggedUser.can(UsecaseList.DELETE_EMPLOYEE);
    this.privilege.update = LoggedUser.can(UsecaseList.UPDATE_EMPLOYEE);
  }

  async submit(): Promise<void> {
    this.photoField.updateValueAndValidity();
    this.photoField.markAsTouched();
    this.branchesField.updateValueAndValidity();
    this.branchesField.markAsTouched();
    this.educationqualificationSubForm.resetForm();
    this.educationqualificationsField.markAsDirty();
    this.workexperienceSubForm.resetForm();
    this.workexperiencesField.markAsDirty();
    if (this.designationAndBankDetailsFormGroup.invalid) { return; }
    if (this.contactDetailsFormGroup.invalid) { return; }
    if (this.basicDetailsFormGroup.invalid) { return; }
    if (this.branchFormGroup.invalid) { return; }
    if (this.educationqualificationDetailFormGroup.invalid) { return; }
    if (this.workexperienceFormGroup.invalid) { return; }
    const employee: Employee = new Employee();
    employee.nametitle = this.nametitleField.value;
    employee.callingname = this.callingnameField.value;
    employee.fullname = this.fullnameField.value;
    const photoIds = this.photoField.value;
    if (photoIds !== null && photoIds !== []){
      employee.photo = photoIds[0];
    }else{
      employee.photo = null;
    }
    employee.gender = this.genderField.value;
    employee.civilstatus = this.civilstatusField.value;
    employee.dobirth = DateHelper.getDateAsString(this.dobirthField.value);
    employee.nic = this.nicField.value;
    employee.address = this.addressField.value;
    employee.mobile = this.mobileField.value;
    employee.land = this.landField.value;
    employee.email = this.emailField.value;
    employee.dorecruit = DateHelper.getDateAsString(this.dorecruitField.value);
    employee.branchList = this.branchesField.value;
    employee.educationqualificationList = this.educationqualificationsField.value;
    employee.workexperienceList = this.workexperiencesField.value;
    employee.epfno = this.epfnoField.value;
    employee.bankaccountno = this.bankaccountnoField.value;
    employee.bankname = this.banknameField.value;
    employee.bankbranch = this.bankbranchField.value;
    employee.description = this.descriptionField.value;

    const appointment: Appointment = new Appointment();
    appointment.designation = this.designationField.value;

    try{

      const resourceLink: ResourceLink = await this.employeeService.add(employee);
      appointment.employee = resourceLink.id;
      await this.appointmentService.add(appointment);

      if (this.privilege.showOne) {
        await this.router.navigateByUrl('/employees/' + resourceLink.id);
      } else {
        this.designationAndBankDetailsFormGroup.reset();
        this.contactDetailsFormGroup.reset();
        this.basicDetailsFormGroup.reset();
        this.branchFormGroup.reset();
        this.educationqualificationDetailFormGroup.reset();
        this.descriptionAndPhotoFormGroup.reset();
        this.workexperienceFormGroup.reset();
        this.snackBar.open('Successfully saved', null, {duration: 2000});
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
  validateNIC(): void {
    if (this.nicField.value.length === 12){
      const year = Number(String(this.nicField.value).slice(0, 4));
      const currYear: number = new Date().getFullYear();
      const minYears: number = currYear - 16;

      if (year >= minYears){
        this.nicField.setErrors({minYearsOld: true});
        this.basicDetailsFormGroup.updateValueAndValidity();
      }
    }
  }

  validateDOB(): void {
    const year = Number(String(DateHelper.getDateAsString(this.dobirthField.value)).slice(0, 4));
    const currYear: number = new Date().getFullYear();
    const minYears: number = currYear - 16;

    if (year >= minYears){
      this.dobirthField.setErrors({minYearsOld: true});
      this.basicDetailsFormGroup.updateValueAndValidity();
    }

    if (this.nicField.valid && this.dobirthField.valid){
      let nicYear = null;
      if (this.nicField.value.length === 12){
        nicYear = Number(String(this.nicField.value).slice(0, 4));
      }
      if (this.nicField.value.length === 10){
        nicYear = Number('19' + String(this.nicField.value).slice(0, 2));
      }

      if (nicYear !== year){
        this.dobirthField.setErrors({mismatch: true});
        this.basicDetailsFormGroup.updateValueAndValidity();
      }
    }
  }
  dateVaidation(): any {
    const date = new Date();
    return date;
  }
}
