import { Component, OnInit } from '@angular/core';
import {ResourceLink} from '../../../../shared/resource-link';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Router} from '@angular/router';
import {AbstractComponent} from '../../../../shared/abstract-component';
import {LoggedUser} from '../../../../shared/logged-user';
import {UsecaseList} from '../../../../usecase-list';
import {PageRequest} from '../../../../shared/page-request';
import {Appointment} from '../../../../entities/appointment';
import {AppointmentService} from '../../../../services/appointment.service';
import {ViewChild} from '@angular/core';
import {Employee} from '../../../../entities/employee';
import {Designation} from '../../../../entities/designation';
import {EmployeeService} from '../../../../services/employee.service';
import {DesignationService} from '../../../../services/designation.service';
import {AppointmentallowanceSubFormComponent} from './appointmentallowance-sub-form/appointmentallowance-sub-form.component';
import {Observable} from "rxjs";
import {Vendor} from "../../../../entities/vendor";
import {map, startWith} from "rxjs/operators";

@Component({
  selector: 'app-appointment-form',
  templateUrl: './appointment-form.component.html',
  styleUrls: ['./appointment-form.component.scss']
})
export class AppointmentFormComponent extends AbstractComponent implements OnInit {

  designations: Designation[] = [];
  employees: Employee[] = [];
  filteredOptions: Observable<Employee[]>;
  @ViewChild(AppointmentallowanceSubFormComponent) appointmentallowanceSubForm: AppointmentallowanceSubFormComponent;

  form = new FormGroup({
    designation: new FormControl(null, [
      Validators.required,
    ]),
    employee: new FormControl(null, [
      Validators.required,
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
    private appointmentService: AppointmentService,
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

  private _filterEmployee(value: string): Employee[] {
    const filterValue = value.toLowerCase();
    return this.employees.filter(employee => employee.code.toLowerCase().indexOf(filterValue) === 0);
  }

  ngOnInit(): void {
    this.loadData();
    this.refreshData();
  }

async loadData(): Promise<any>{

    this.updatePrivileges();
    if (!this.privilege.add) { return; }

    this.designationService.getAllBasic(new PageRequest()).then((designationDataPage) => {
      this.designations = designationDataPage.content;
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
  }

  updatePrivileges(): any {
    this.privilege.add = LoggedUser.can(UsecaseList.ADD_APPOINTMENT);
    this.privilege.showAll = LoggedUser.can(UsecaseList.SHOW_ALL_APPOINTMENTS);
    this.privilege.showOne = LoggedUser.can(UsecaseList.SHOW_APPOINTMENT_DETAILS);
    this.privilege.delete = LoggedUser.can(UsecaseList.DELETE_APPOINTMENT);
    this.privilege.update = LoggedUser.can(UsecaseList.UPDATE_APPOINTMENT);
  }

  async submit(): Promise<void> {
    this.appointmentallowanceSubForm.resetForm();
    this.appointmentallowancesField.markAsDirty();
    if (this.form.invalid) { return; }

    const appointment: Appointment = new Appointment();
    appointment.designation = this.designationField.value;
    appointment.employee = this.employeeField.value;
    appointment.appointmentallowanceList = this.appointmentallowancesField.value;
    appointment.description = this.descriptionField.value;
    try{
      const resourceLink: ResourceLink = await this.appointmentService.add(appointment);
      if (this.privilege.showOne) {
        await this.router.navigateByUrl('/appointments/' + resourceLink.id);
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
          if (msg.designation) { this.designationField.setErrors({server: msg.designation}); knownError = true; }
          if (msg.employee) { this.employeeField.setErrors({server: msg.employee}); knownError = true; }
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
