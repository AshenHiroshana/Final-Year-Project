import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {MatSnackBar} from '@angular/material/snack-bar';
import {LoggedUser} from '../../../../shared/logged-user';
import {UsecaseList} from '../../../../usecase-list';
import {ResourceLink} from '../../../../shared/resource-link';
import {AbstractComponent} from '../../../../shared/abstract-component';
import {PageRequest} from '../../../../shared/page-request';
import {Appointment} from '../../../../entities/appointment';
import {AppointmentService} from '../../../../services/appointment.service';
import {ViewChild} from '@angular/core';
import {Employee} from '../../../../entities/employee';
import {DateHelper} from '../../../../shared/date-helper';
import {Designation} from '../../../../entities/designation';
import {EmployeeService} from '../../../../services/employee.service';
import {Appointmentstatus} from '../../../../entities/appointmentstatus';
import {DesignationService} from '../../../../services/designation.service';
import {AppointmentstatusService} from '../../../../services/appointmentstatus.service';
import {AppointmentallowanceUpdateSubFormComponent} from './appointmentallowance-update-sub-form/appointmentallowance-update-sub-form.component';
import {map, startWith} from "rxjs/operators";
import {Observable} from "rxjs";

@Component({
  selector: 'app-appointment-update-form',
  templateUrl: './appointment-update-form.component.html',
  styleUrls: ['./appointment-update-form.component.scss']
})
export class AppointmentUpdateFormComponent extends AbstractComponent implements OnInit {

  selectedId: number;
  appointment: Appointment;

  designations: Designation[] = [];
  filteredOptions: Observable<Employee[]>;
  employees: Employee[] = [];
  appointmentstatuses: Appointmentstatus[] = [];
  @ViewChild(AppointmentallowanceUpdateSubFormComponent) appointmentallowanceUpdateSubForm: AppointmentallowanceUpdateSubFormComponent;

  form = new FormGroup({
    designation: new FormControl(null, [
      Validators.required,
    ]),
    employee: new FormControl(null, [
      Validators.required,
    ]),
    appointmentstatus: new FormControl('1', [
      Validators.required,
    ]),
    dogrant: new FormControl(1994-12-31, [
      Validators.required,
    ]),
    dorevoke: new FormControl(null, [
    ]),
    appointmentallowances: new FormControl(),
    description: new FormControl(null, [
      Validators.minLength(null),
      Validators.maxLength(65535),
    ]),
    searchemployee: new FormControl(),
  });

  get designationField(): FormControl{
    return this.form.controls.designation as FormControl;
  }

  get employeeField(): FormControl{
    return this.form.controls.employee as FormControl;
  }

  get appointmentstatusField(): FormControl{
    return this.form.controls.appointmentstatus as FormControl;
  }

  get dograntField(): FormControl{
    return this.form.controls.dogrant as FormControl;
  }

  get dorevokeField(): FormControl{
    return this.form.controls.dorevoke as FormControl;
  }

  get appointmentallowancesField(): FormControl{
    return this.form.controls.appointmentallowances as FormControl;
  }

  get descriptionField(): FormControl{
    return this.form.controls.description as FormControl;
  }

  get searchemployeeField(): FormControl{
    return this.form.controls.searchemployee as FormControl;
  }

  constructor(
    private designationService: DesignationService,
    private employeeService: EmployeeService,
    private appointmentstatusService: AppointmentstatusService,
    private appointmentService: AppointmentService,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar,
    private router: Router
  ) {
    super();
    this.filteredOptions = this.searchemployeeField.valueChanges
      .pipe(
        startWith(''),
        map(employee => employee ? this._filterEmployee(employee) : this.employees.slice())
      );
  }

  ngOnInit(): void {
    this.designationField.disable();
    this.route.paramMap.subscribe( async (params) => {
      this.selectedId =  + params.get('id');
      await this.loadData();
      this.refreshData();
    });
  }

  private _filterEmployee(value: string): Employee[] {
    const filterValue = value.toLowerCase();
    return this.employees.filter(employee => employee.code.toLowerCase().indexOf(filterValue) === 0);
  }

  async loadData(): Promise<any>{
    this.employeeField.disable();
    this.updatePrivileges();
    if (!this.privilege.update) { return; }

    this.designationService.getAllBasic(new PageRequest()).then((designationDataPage) => {
      this.designations = designationDataPage.content;
    }).catch((e) => {
      console.log(e);
      this.snackBar.open('Something is wrong', null, {duration: 2000});
    });
    this.employeeService.getAllBasic(new PageRequest()).then((employeeDataPage) => {
      this.employees = employeeDataPage.content;
    }).catch((e) => {
      console.log(e);
      this.snackBar.open('Something is wrong', null, {duration: 2000});
    });
    this.appointmentstatusService.getAll().then((appointmentstatuses) => {
      this.appointmentstatuses = appointmentstatuses;
    }).catch((e) => {
      console.log(e);
      this.snackBar.open('Something is wrong', null, {duration: 2000});
    });
    if (this.designationField.value){
      this.employeeService.getAllForApointment(this.designationField.value).then((employeeDataPage) => {
        this.employees = employeeDataPage;
      }).catch((e) => {
        console.log(e);
        this.snackBar.open('Something is wrong', null, {duration: 2000});
      });
    }
    this.appointment = await this.appointmentService.get(this.selectedId);
    this.setValues();
  }

  updatePrivileges(): any {
    this.privilege.add = LoggedUser.can(UsecaseList.ADD_APPOINTMENT);
    this.privilege.showAll = LoggedUser.can(UsecaseList.SHOW_ALL_APPOINTMENTS);
    this.privilege.showOne = LoggedUser.can(UsecaseList.SHOW_APPOINTMENT_DETAILS);
    this.privilege.delete = LoggedUser.can(UsecaseList.DELETE_APPOINTMENT);
    this.privilege.update = LoggedUser.can(UsecaseList.UPDATE_APPOINTMENT);
  }

  discardChanges(): void{
    this.form.markAsPristine();
    this.form.markAsUntouched();
    this.setValues();
  }

  setValues(): void{
    if (this.designationField.pristine) {
      this.designationField.setValue(this.appointment.designation.id);
    }
    if (this.employeeField.pristine) {
      this.employeeField.setValue(this.appointment.employee.id);
      this.searchemployeeField.setValue(this.appointment.employee.code);
    }
    if (this.appointmentstatusField.pristine) {
      this.appointmentstatusField.setValue(this.appointment.appointmentstatus.id);
    }
    if (this.dograntField.pristine) {
      this.dograntField.setValue(this.appointment.dogrant);
    }
    if (this.dorevokeField.pristine) {
      this.dorevokeField.setValue(this.appointment.dorevoke);
    }
    if (this.appointmentallowancesField.pristine) {
      this.appointmentallowancesField.setValue(this.appointment.appointmentallowanceList);
    }
    if (this.descriptionField.pristine) {
      this.descriptionField.setValue(this.appointment.description);
    }
}

  async submit(): Promise<void> {
    this.appointmentallowanceUpdateSubForm.resetForm();
    this.appointmentallowancesField.markAsDirty();
    if (this.form.invalid) { return; }

    const newappointment: Appointment = new Appointment();
    newappointment.designation = this.designationField.value;
    newappointment.employee = this.employeeField.value;
    newappointment.appointmentstatus = this.appointmentstatusField.value;
    newappointment.dogrant = DateHelper.getDateAsString(this.dograntField.value);
    newappointment.dorevoke = this.dorevokeField.value ? DateHelper.getDateAsString(this.dorevokeField.value) : null;
    newappointment.appointmentallowanceList = this.appointmentallowancesField.value;
    newappointment.description = this.descriptionField.value;
    try{
      const resourceLink: ResourceLink = await this.appointmentService.update(this.selectedId, newappointment);
      if (this.privilege.showOne) {
        await this.router.navigateByUrl('/appointments/' + resourceLink.id);
      } else {
        await this.router.navigateByUrl('/appointments');
      }
    }catch (e) {
      switch (e.status) {
        case 401: break;
        case 403: this.snackBar.open(e.error.message, null, {duration: 2000}); break;
        case 400:
          const msg = JSON.parse(e.error.message);
          let knownError = false;
          if (msg.designation) { this.designationField.setErrors({server: msg.designation}); knownError = true; }
          if (msg.employee) { this.employeeField.setErrors({server: msg.employee}); knownError = true; }
          if (msg.appointmentstatus) { this.appointmentstatusField.setErrors({server: msg.appointmentstatus}); knownError = true; }
          if (msg.dogrant) { this.dograntField.setErrors({server: msg.dogrant}); knownError = true; }
          if (msg.dorevoke) { this.dorevokeField.setErrors({server: msg.dorevoke}); knownError = true; }
          if (msg.appointmentallowanceList) { this.appointmentallowancesField.setErrors({server: msg.appointmentallowanceList}); knownError = true; }
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

  setSearchValue(option: any): void{
    console.log(option);
    this.employeeField.patchValue(option);
    //this.searchemployeeField.disable();
  }
}
