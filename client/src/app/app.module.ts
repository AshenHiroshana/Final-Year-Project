import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LoginComponent } from './views/login/login.component';
import { MainWindowComponent } from './views/main-window/main-window.component';
import { DashboardComponent } from './views/dashboard/dashboard.component';
import { PageNotFoundComponent } from './views/page-not-found/page-not-found.component';
import {ReactiveFormsModule} from '@angular/forms';
import {MatCardModule} from '@angular/material/card';
import {MatButtonModule} from '@angular/material/button';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatIconModule} from '@angular/material/icon';
import {MatToolbarModule} from '@angular/material/toolbar';
import { PageHeaderComponent } from './shared/views/page-header/page-header.component';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {Interceptor} from './shared/interceptor';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatBadgeModule} from '@angular/material/badge';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatListModule} from '@angular/material/list';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatGridListModule} from '@angular/material/grid-list';
import {MatTreeModule} from '@angular/material/tree';
import { NavigationComponent } from './shared/views/navigation/navigation.component';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import { RoleDetailComponent } from './views/modules/role/role-detail/role-detail.component';
import { RoleFormComponent } from './views/modules/role/role-form/role-form.component';
import { RoleTableComponent } from './views/modules/role/role-table/role-table.component';
import { RoleUpdateFormComponent } from './views/modules/role/role-update-form/role-update-form.component';
import { UserDetailComponent } from './views/modules/user/user-detail/user-detail.component';
import { UserFormComponent } from './views/modules/user/user-form/user-form.component';
import { UserTableComponent } from './views/modules/user/user-table/user-table.component';
import { UserUpdateFormComponent } from './views/modules/user/user-update-form/user-update-form.component';
import { ChangePasswordComponent } from './views/modules/user/change-password/change-password.component';
import { ResetPasswordComponent } from './views/modules/user/reset-password/reset-password.component';
import {MatMenuModule} from '@angular/material/menu';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {MatDialogModule} from '@angular/material/dialog';
import { DeleteConfirmDialogComponent } from './shared/views/delete-confirm-dialog/delete-confirm-dialog.component';
import {MatTableModule} from '@angular/material/table';
import {MatPaginatorModule} from '@angular/material/paginator';
import { EmptyDataTableComponent } from './shared/views/empty-data-table/empty-data-table.component';
import { LoginTimeOutDialogComponent } from './shared/views/login-time-out-dialog/login-time-out-dialog.component';
import { Nl2brPipe } from './shared/nl2br.pipe';
import { NoPrivilegeComponent } from './shared/views/no-privilege/no-privilege.component';
import {MatSelectModule} from '@angular/material/select';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatNativeDateModule} from '@angular/material/core';
import {MatRadioModule} from '@angular/material/radio';
import { AdminConfigurationComponent } from './views/admin-configuration/admin-configuration.component';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { ObjectNotFoundComponent } from './shared/views/object-not-found/object-not-found.component';
import { LoadingComponent } from './shared/views/loading/loading.component';
import { ConfirmDialogComponent } from './shared/views/confirm-dialog/confirm-dialog.component';
import {MatTabsModule} from '@angular/material/tabs';
import { DualListboxComponent } from './shared/ui-components/dual-listbox/dual-listbox.component';
import {FileChooserComponent} from './shared/ui-components/file-chooser/file-chooser.component';
import { ChangePhotoComponent } from './views/modules/user/change-photo/change-photo.component';
import { MyAllNotificationComponent } from './views/modules/user/my-all-notification/my-all-notification.component';
import {EducationqualificationSubFormComponent} from './views/modules/employee/employee-form/educationqualification-sub-form/educationqualification-sub-form.component';
import {AppointmentallowanceSubFormComponent} from './views/modules/appointment/appointment-form/appointmentallowance-sub-form/appointmentallowance-sub-form.component';
import {ConsumeitempurchaseTableComponent} from './views/modules/consumeitempurchase/consumeitempurchase-table/consumeitempurchase-table.component';
import {ConsumeitempurchaseFormComponent} from './views/modules/consumeitempurchase/consumeitempurchase-form/consumeitempurchase-form.component';
import {ConsumeitempurchaseDetailComponent} from './views/modules/consumeitempurchase/consumeitempurchase-detail/consumeitempurchase-detail.component';
import {ConsumeitempurchaseUpdateFormComponent} from './views/modules/consumeitempurchase/consumeitempurchase-update-form/consumeitempurchase-update-form.component';
import {ProcurementitemtypeTableComponent} from './views/modules/procurementitemtype/procurementitemtype-table/procurementitemtype-table.component';
import {ProcurementitemtypeFormComponent} from './views/modules/procurementitemtype/procurementitemtype-form/procurementitemtype-form.component';
import {ProcurementitemtypeDetailComponent} from './views/modules/procurementitemtype/procurementitemtype-detail/procurementitemtype-detail.component';
import {ProcurementitemtypeUpdateFormComponent} from './views/modules/procurementitemtype/procurementitemtype-update-form/procurementitemtype-update-form.component';
import {AppointmentTableComponent} from './views/modules/appointment/appointment-table/appointment-table.component';
import {AppointmentFormComponent} from './views/modules/appointment/appointment-form/appointment-form.component';
import {AppointmentDetailComponent} from './views/modules/appointment/appointment-detail/appointment-detail.component';
import {AppointmentUpdateFormComponent} from './views/modules/appointment/appointment-update-form/appointment-update-form.component';
import {ConsumeitempaymentTableComponent} from './views/modules/consumeitempayment/consumeitempayment-table/consumeitempayment-table.component';
import {ConsumeitempaymentFormComponent} from './views/modules/consumeitempayment/consumeitempayment-form/consumeitempayment-form.component';
import {ConsumeitempaymentDetailComponent} from './views/modules/consumeitempayment/consumeitempayment-detail/consumeitempayment-detail.component';
import {ConsumeitempaymentUpdateFormComponent} from './views/modules/consumeitempayment/consumeitempayment-update-form/consumeitempayment-update-form.component';
import {ServicerefundTableComponent} from './views/modules/servicerefund/servicerefund-table/servicerefund-table.component';
import {ServicerefundFormComponent} from './views/modules/servicerefund/servicerefund-form/servicerefund-form.component';
import {ServicerefundDetailComponent} from './views/modules/servicerefund/servicerefund-detail/servicerefund-detail.component';
import {ServicerefundUpdateFormComponent} from './views/modules/servicerefund/servicerefund-update-form/servicerefund-update-form.component';
import {EmployeeTableComponent} from './views/modules/employee/employee-table/employee-table.component';
import {EmployeeFormComponent} from './views/modules/employee/employee-form/employee-form.component';
import {EmployeeDetailComponent} from './views/modules/employee/employee-detail/employee-detail.component';
import {EmployeeUpdateFormComponent} from './views/modules/employee/employee-update-form/employee-update-form.component';
import {BranchTableComponent} from './views/modules/branch/branch-table/branch-table.component';
import {BranchFormComponent} from './views/modules/branch/branch-form/branch-form.component';
import {BranchDetailComponent} from './views/modules/branch/branch-detail/branch-detail.component';
import {BranchUpdateFormComponent} from './views/modules/branch/branch-update-form/branch-update-form.component';
import {PayrolldeductionUpdateSubFormComponent} from './views/modules/payroll/payroll-update-form/payrolldeduction-update-sub-form/payrolldeduction-update-sub-form.component';
import {ProcurementpaymentTableComponent} from './views/modules/procurementpayment/procurementpayment-table/procurementpayment-table.component';
import {ProcurementpaymentFormComponent} from './views/modules/procurementpayment/procurementpayment-form/procurementpayment-form.component';
import {ProcurementpaymentDetailComponent} from './views/modules/procurementpayment/procurementpayment-detail/procurementpayment-detail.component';
import {ProcurementpaymentUpdateFormComponent} from './views/modules/procurementpayment/procurementpayment-update-form/procurementpayment-update-form.component';
import {ProcurementallocationTableComponent} from './views/modules/procurementallocation/procurementallocation-table/procurementallocation-table.component';
import {ProcurementallocationFormComponent} from './views/modules/procurementallocation/procurementallocation-form/procurementallocation-form.component';
import {ProcurementallocationDetailComponent} from './views/modules/procurementallocation/procurementallocation-detail/procurementallocation-detail.component';
import {ProcurementallocationUpdateFormComponent} from './views/modules/procurementallocation/procurementallocation-update-form/procurementallocation-update-form.component';
import {ProcurementitempurchaseTableComponent} from './views/modules/procurementitempurchase/procurementitempurchase-table/procurementitempurchase-table.component';
import {ProcurementitempurchaseFormComponent} from './views/modules/procurementitempurchase/procurementitempurchase-form/procurementitempurchase-form.component';
import {ProcurementitempurchaseDetailComponent} from './views/modules/procurementitempurchase/procurementitempurchase-detail/procurementitempurchase-detail.component';
import {ProcurementitempurchaseUpdateFormComponent} from './views/modules/procurementitempurchase/procurementitempurchase-update-form/procurementitempurchase-update-form.component';
import {ConsumeitempurchaseconsumeitemUpdateSubFormComponent} from './views/modules/consumeitempurchase/consumeitempurchase-update-form/consumeitempurchaseconsumeitem-update-sub-form/consumeitempurchaseconsumeitem-update-sub-form.component';
import {WorkexperienceUpdateSubFormComponent} from './views/modules/employee/employee-update-form/workexperience-update-sub-form/workexperience-update-sub-form.component';
import {BranchroleTableComponent} from './views/modules/branchrole/branchrole-table/branchrole-table.component';
import {BranchroleFormComponent} from './views/modules/branchrole/branchrole-form/branchrole-form.component';
import {BranchroleDetailComponent} from './views/modules/branchrole/branchrole-detail/branchrole-detail.component';
import {BranchroleUpdateFormComponent} from './views/modules/branchrole/branchrole-update-form/branchrole-update-form.component';
import {ProcurementrefundTableComponent} from './views/modules/procurementrefund/procurementrefund-table/procurementrefund-table.component';
import {ProcurementrefundFormComponent} from './views/modules/procurementrefund/procurementrefund-form/procurementrefund-form.component';
import {ProcurementrefundDetailComponent} from './views/modules/procurementrefund/procurementrefund-detail/procurementrefund-detail.component';
import {ProcurementrefundUpdateFormComponent} from './views/modules/procurementrefund/procurementrefund-update-form/procurementrefund-update-form.component';
import {ServiceprocurementitemUpdateSubFormComponent} from './views/modules/service/service-update-form/serviceprocurementitem-update-sub-form/serviceprocurementitem-update-sub-form.component';
import {PayrolldeductionSubFormComponent} from './views/modules/payroll/payroll-form/payrolldeduction-sub-form/payrolldeduction-sub-form.component';
import {BillpaymentTableComponent} from './views/modules/billpayment/billpayment-table/billpayment-table.component';
import {BillpaymentFormComponent} from './views/modules/billpayment/billpayment-form/billpayment-form.component';
import {BillpaymentDetailComponent} from './views/modules/billpayment/billpayment-detail/billpayment-detail.component';
import {BillpaymentUpdateFormComponent} from './views/modules/billpayment/billpayment-update-form/billpayment-update-form.component';
import {ConsumeitempurchaseconsumeitemSubFormComponent} from './views/modules/consumeitempurchase/consumeitempurchase-form/consumeitempurchaseconsumeitem-sub-form/consumeitempurchaseconsumeitem-sub-form.component';
import {DesignationTableComponent} from './views/modules/designation/designation-table/designation-table.component';
import {DesignationFormComponent} from './views/modules/designation/designation-form/designation-form.component';
import {DesignationDetailComponent} from './views/modules/designation/designation-detail/designation-detail.component';
import {DesignationUpdateFormComponent} from './views/modules/designation/designation-update-form/designation-update-form.component';
import {PayrollTableComponent} from './views/modules/payroll/payroll-table/payroll-table.component';
import {PayrollFormComponent} from './views/modules/payroll/payroll-form/payroll-form.component';
import {PayrollDetailComponent} from './views/modules/payroll/payroll-detail/payroll-detail.component';
import {PayrollUpdateFormComponent} from './views/modules/payroll/payroll-update-form/payroll-update-form.component';
import {ProcurementitemTableComponent} from './views/modules/procurementitem/procurementitem-table/procurementitem-table.component';
import {ProcurementitemFormComponent} from './views/modules/procurementitem/procurementitem-form/procurementitem-form.component';
import {ProcurementitemDetailComponent} from './views/modules/procurementitem/procurementitem-detail/procurementitem-detail.component';
import {ProcurementitemUpdateFormComponent} from './views/modules/procurementitem/procurementitem-update-form/procurementitem-update-form.component';
import {ServiceprocurementitemSubFormComponent} from './views/modules/service/service-form/serviceprocurementitem-sub-form/serviceprocurementitem-sub-form.component';
import {EducationqualificationUpdateSubFormComponent} from './views/modules/employee/employee-update-form/educationqualification-update-sub-form/educationqualification-update-sub-form.component';
import {WorkexperienceSubFormComponent} from './views/modules/employee/employee-form/workexperience-sub-form/workexperience-sub-form.component';
import {AuctionTableComponent} from './views/modules/auction/auction-table/auction-table.component';
import {AuctionFormComponent} from './views/modules/auction/auction-form/auction-form.component';
import {AuctionDetailComponent} from './views/modules/auction/auction-detail/auction-detail.component';
import {AuctionUpdateFormComponent} from './views/modules/auction/auction-update-form/auction-update-form.component';
import {ConsumedistributionitemSubFormComponent} from './views/modules/consumedistribution/consumedistribution-form/consumedistributionitem-sub-form/consumedistributionitem-sub-form.component';
import {ProcurementallocationprocurementitemSubFormComponent} from './views/modules/procurementallocation/procurementallocation-form/procurementallocationprocurementitem-sub-form/procurementallocationprocurementitem-sub-form.component';
import {ServicepaymentTableComponent} from './views/modules/servicepayment/servicepayment-table/servicepayment-table.component';
import {ServicepaymentFormComponent} from './views/modules/servicepayment/servicepayment-form/servicepayment-form.component';
import {ServicepaymentDetailComponent} from './views/modules/servicepayment/servicepayment-detail/servicepayment-detail.component';
import {ServicepaymentUpdateFormComponent} from './views/modules/servicepayment/servicepayment-update-form/servicepayment-update-form.component';
import {VendorTableComponent} from './views/modules/vendor/vendor-table/vendor-table.component';
import {VendorFormComponent} from './views/modules/vendor/vendor-form/vendor-form.component';
import {VendorDetailComponent} from './views/modules/vendor/vendor-detail/vendor-detail.component';
import {VendorUpdateFormComponent} from './views/modules/vendor/vendor-update-form/vendor-update-form.component';
import {BranchsectionTableComponent} from './views/modules/branchsection/branchsection-table/branchsection-table.component';
import {BranchsectionFormComponent} from './views/modules/branchsection/branchsection-form/branchsection-form.component';
import {BranchsectionDetailComponent} from './views/modules/branchsection/branchsection-detail/branchsection-detail.component';
import {BranchsectionUpdateFormComponent} from './views/modules/branchsection/branchsection-update-form/branchsection-update-form.component';
import {ConsumedistributionTableComponent} from './views/modules/consumedistribution/consumedistribution-table/consumedistribution-table.component';
import {ConsumedistributionFormComponent} from './views/modules/consumedistribution/consumedistribution-form/consumedistribution-form.component';
import {ConsumedistributionDetailComponent} from './views/modules/consumedistribution/consumedistribution-detail/consumedistribution-detail.component';
import {ConsumedistributionUpdateFormComponent} from './views/modules/consumedistribution/consumedistribution-update-form/consumedistribution-update-form.component';
import {AppointmentallowanceUpdateSubFormComponent} from './views/modules/appointment/appointment-update-form/appointmentallowance-update-sub-form/appointmentallowance-update-sub-form.component';
import {ConsumeitemTableComponent} from './views/modules/consumeitem/consumeitem-table/consumeitem-table.component';
import {ConsumeitemFormComponent} from './views/modules/consumeitem/consumeitem-form/consumeitem-form.component';
import {ConsumeitemDetailComponent} from './views/modules/consumeitem/consumeitem-detail/consumeitem-detail.component';
import {ConsumeitemUpdateFormComponent} from './views/modules/consumeitem/consumeitem-update-form/consumeitem-update-form.component';
import {ProcurementallocationprocurementitemUpdateSubFormComponent} from './views/modules/procurementallocation/procurementallocation-update-form/procurementallocationprocurementitem-update-sub-form/procurementallocationprocurementitem-update-sub-form.component';
import {PrintorderTableComponent} from './views/modules/printorder/printorder-table/printorder-table.component';
import {PrintorderFormComponent} from './views/modules/printorder/printorder-form/printorder-form.component';
import {PrintorderDetailComponent} from './views/modules/printorder/printorder-detail/printorder-detail.component';
import {PrintorderUpdateFormComponent} from './views/modules/printorder/printorder-update-form/printorder-update-form.component';
import {RentalpaymentTableComponent} from './views/modules/rentalpayment/rentalpayment-table/rentalpayment-table.component';
import {RentalpaymentFormComponent} from './views/modules/rentalpayment/rentalpayment-form/rentalpayment-form.component';
import {RentalpaymentDetailComponent} from './views/modules/rentalpayment/rentalpayment-detail/rentalpayment-detail.component';
import {RentalpaymentUpdateFormComponent} from './views/modules/rentalpayment/rentalpayment-update-form/rentalpayment-update-form.component';
import {BranchroleassignmentTableComponent} from './views/modules/branchroleassignment/branchroleassignment-table/branchroleassignment-table.component';
import {BranchroleassignmentFormComponent} from './views/modules/branchroleassignment/branchroleassignment-form/branchroleassignment-form.component';
import {BranchroleassignmentDetailComponent} from './views/modules/branchroleassignment/branchroleassignment-detail/branchroleassignment-detail.component';
import {BranchroleassignmentUpdateFormComponent} from './views/modules/branchroleassignment/branchroleassignment-update-form/branchroleassignment-update-form.component';
import {ConsumedistributionitemUpdateSubFormComponent} from './views/modules/consumedistribution/consumedistribution-update-form/consumedistributionitem-update-sub-form/consumedistributionitem-update-sub-form.component';
import {RentalTableComponent} from './views/modules/rental/rental-table/rental-table.component';
import {RentalFormComponent} from './views/modules/rental/rental-form/rental-form.component';
import {RentalDetailComponent} from './views/modules/rental/rental-detail/rental-detail.component';
import {RentalUpdateFormComponent} from './views/modules/rental/rental-update-form/rental-update-form.component';
import {PrintTableComponent} from './views/modules/print/print-table/print-table.component';
import {PrintFormComponent} from './views/modules/print/print-form/print-form.component';
import {PrintDetailComponent} from './views/modules/print/print-detail/print-detail.component';
import {PrintUpdateFormComponent} from './views/modules/print/print-update-form/print-update-form.component';
import {ServicetypeTableComponent} from './views/modules/servicetype/servicetype-table/servicetype-table.component';
import {ServicetypeFormComponent} from './views/modules/servicetype/servicetype-form/servicetype-form.component';
import {ServicetypeDetailComponent} from './views/modules/servicetype/servicetype-detail/servicetype-detail.component';
import {ServicetypeUpdateFormComponent} from './views/modules/servicetype/servicetype-update-form/servicetype-update-form.component';
import {MaterialTableComponent} from './views/modules/material/material-table/material-table.component';
import {MaterialFormComponent} from './views/modules/material/material-form/material-form.component';
import {MaterialDetailComponent} from './views/modules/material/material-detail/material-detail.component';
import {MaterialUpdateFormComponent} from './views/modules/material/material-update-form/material-update-form.component';
import {PayrolladditionSubFormComponent} from './views/modules/payroll/payroll-form/payrolladdition-sub-form/payrolladdition-sub-form.component';
import {ServiceTableComponent} from './views/modules/service/service-table/service-table.component';
import {ServiceFormComponent} from './views/modules/service/service-form/service-form.component';
import {ServiceDetailComponent} from './views/modules/service/service-detail/service-detail.component';
import {ServiceUpdateFormComponent} from './views/modules/service/service-update-form/service-update-form.component';
import {PayrolladditionUpdateSubFormComponent} from './views/modules/payroll/payroll-update-form/payrolladdition-update-sub-form/payrolladdition-update-sub-form.component';
import {AttendanceTableComponent} from './views/modules/attendance/attendance-table/attendance-table.component';
import {AttendanceFormComponent} from './views/modules/attendance/attendance-form/attendance-form.component';
import {AttendanceDetailComponent} from './views/modules/attendance/attendance-detail/attendance-detail.component';
import {AttendanceUpdateFormComponent} from './views/modules/attendance/attendance-update-form/attendance-update-form.component';
import {MatStepperModule} from "@angular/material/stepper";
import {MatAutocompleteModule} from "@angular/material/autocomplete";
import { ProcurementitempurchaseProcurementitemSubFormComponent } from './views/modules/procurementitempurchase/procurementitempurchase-form/procurementitempurchase-procurementitem-sub-form/procurementitempurchase-procurementitem-sub-form.component';
import { YearWiseConsumeitempaymentCountComponent } from './views/modules/reports/year-wise-consumeitempayment-count/year-wise-consumeitempayment-count.component';
import {ChartsModule} from "ng2-charts";
import {MatTableExporterModule} from "mat-table-exporter";
import { BranchWiseRentalPaymentComponent } from './views/modules/reports/branch-wise-rental-payment/branch-wise-rental-payment.component';
import { ConsumeitemInventoryComponent } from './views/modules/reports/consumeitem-inventory/consumeitem-inventory.component';
import { EmployeePayrollComponent } from './views/modules/reports/employee-payroll/employee-payroll.component';

@NgModule({
    declarations: [
        AppComponent,
        LoginComponent,
        MainWindowComponent,
        DashboardComponent,
        PageNotFoundComponent,
        PageHeaderComponent,
        NavigationComponent,
        RoleDetailComponent,
        RoleFormComponent,
        RoleTableComponent,
        RoleUpdateFormComponent,
        UserDetailComponent,
        UserFormComponent,
        UserTableComponent,
        UserUpdateFormComponent,
        ChangePasswordComponent,
        ResetPasswordComponent,
        DeleteConfirmDialogComponent,
        EmptyDataTableComponent,
        LoginTimeOutDialogComponent,
        Nl2brPipe,
        NoPrivilegeComponent,
        AdminConfigurationComponent,
        FileChooserComponent,
        ObjectNotFoundComponent,
        LoadingComponent,
        ConfirmDialogComponent,
        DualListboxComponent,
        ChangePhotoComponent,
        MyAllNotificationComponent,
        EducationqualificationSubFormComponent,
        AppointmentallowanceSubFormComponent,
        ConsumeitempurchaseTableComponent,
        ConsumeitempurchaseFormComponent,
        ConsumeitempurchaseDetailComponent,
        ConsumeitempurchaseUpdateFormComponent,
        ProcurementitemtypeTableComponent,
        ProcurementitemtypeFormComponent,
        ProcurementitemtypeDetailComponent,
        ProcurementitemtypeUpdateFormComponent,
        AppointmentTableComponent,
        AppointmentFormComponent,
        AppointmentDetailComponent,
        AppointmentUpdateFormComponent,
        ConsumeitempaymentTableComponent,
        ConsumeitempaymentFormComponent,
        ConsumeitempaymentDetailComponent,
        ConsumeitempaymentUpdateFormComponent,
        ServicerefundTableComponent,
        ServicerefundFormComponent,
        ServicerefundDetailComponent,
        ServicerefundUpdateFormComponent,
        EmployeeTableComponent,
        EmployeeFormComponent,
        EmployeeDetailComponent,
        EmployeeUpdateFormComponent,
        BranchTableComponent,
        BranchFormComponent,
        BranchDetailComponent,
        BranchUpdateFormComponent,
        PayrolldeductionUpdateSubFormComponent,
        ProcurementpaymentTableComponent,
        ProcurementpaymentFormComponent,
        ProcurementpaymentDetailComponent,
        ProcurementpaymentUpdateFormComponent,
        ProcurementallocationTableComponent,
        ProcurementallocationFormComponent,
        ProcurementallocationDetailComponent,
        ProcurementallocationUpdateFormComponent,
        ProcurementitempurchaseTableComponent,
        ProcurementitempurchaseFormComponent,
        ProcurementitempurchaseDetailComponent,
        ProcurementitempurchaseUpdateFormComponent,
        ConsumeitempurchaseconsumeitemUpdateSubFormComponent,
        WorkexperienceUpdateSubFormComponent,
        BranchroleTableComponent,
        BranchroleFormComponent,
        BranchroleDetailComponent,
        BranchroleUpdateFormComponent,
        ProcurementrefundTableComponent,
        ProcurementrefundFormComponent,
        ProcurementrefundDetailComponent,
        ProcurementrefundUpdateFormComponent,
        ServiceprocurementitemUpdateSubFormComponent,
        PayrolldeductionSubFormComponent,
        BillpaymentTableComponent,
        BillpaymentFormComponent,
        BillpaymentDetailComponent,
        BillpaymentUpdateFormComponent,
        ConsumeitempurchaseconsumeitemSubFormComponent,
        DesignationTableComponent,
        DesignationFormComponent,
        DesignationDetailComponent,
        DesignationUpdateFormComponent,
        PayrollTableComponent,
        PayrollFormComponent,
        PayrollDetailComponent,
        PayrollUpdateFormComponent,
        ProcurementitemTableComponent,
        ProcurementitemFormComponent,
        ProcurementitemDetailComponent,
        ProcurementitemUpdateFormComponent,
        ServiceprocurementitemSubFormComponent,
        EducationqualificationUpdateSubFormComponent,
        WorkexperienceSubFormComponent,
        AuctionTableComponent,
        AuctionFormComponent,
        AuctionDetailComponent,
        AuctionUpdateFormComponent,
        ConsumedistributionitemSubFormComponent,
        ProcurementallocationprocurementitemSubFormComponent,
        ServicepaymentTableComponent,
        ServicepaymentFormComponent,
        ServicepaymentDetailComponent,
        ServicepaymentUpdateFormComponent,
        VendorTableComponent,
        VendorFormComponent,
        VendorDetailComponent,
        VendorUpdateFormComponent,
        BranchsectionTableComponent,
        BranchsectionFormComponent,
        BranchsectionDetailComponent,
        BranchsectionUpdateFormComponent,
        ConsumedistributionTableComponent,
        ConsumedistributionFormComponent,
        ConsumedistributionDetailComponent,
        ConsumedistributionUpdateFormComponent,
        AppointmentallowanceUpdateSubFormComponent,
        ConsumeitemTableComponent,
        ConsumeitemFormComponent,
        ConsumeitemDetailComponent,
        ConsumeitemUpdateFormComponent,
        ProcurementallocationprocurementitemUpdateSubFormComponent,
        PrintorderTableComponent,
        PrintorderFormComponent,
        PrintorderDetailComponent,
        PrintorderUpdateFormComponent,
        RentalpaymentTableComponent,
        RentalpaymentFormComponent,
        RentalpaymentDetailComponent,
        RentalpaymentUpdateFormComponent,
        BranchroleassignmentTableComponent,
        BranchroleassignmentFormComponent,
        BranchroleassignmentDetailComponent,
        BranchroleassignmentUpdateFormComponent,
        ConsumedistributionitemUpdateSubFormComponent,
        RentalTableComponent,
        RentalFormComponent,
        RentalDetailComponent,
        RentalUpdateFormComponent,
        PrintTableComponent,
        PrintFormComponent,
        PrintDetailComponent,
        PrintUpdateFormComponent,
        ServicetypeTableComponent,
        ServicetypeFormComponent,
        ServicetypeDetailComponent,
        ServicetypeUpdateFormComponent,
        MaterialTableComponent,
        MaterialFormComponent,
        MaterialDetailComponent,
        MaterialUpdateFormComponent,
        PayrolladditionSubFormComponent,
        ServiceTableComponent,
        ServiceFormComponent,
        ServiceDetailComponent,
        ServiceUpdateFormComponent,
        PayrolladditionUpdateSubFormComponent,
        AttendanceTableComponent,
        AttendanceFormComponent,
        AttendanceDetailComponent,
        AttendanceUpdateFormComponent,
        ProcurementitempurchaseProcurementitemSubFormComponent,
        YearWiseConsumeitempaymentCountComponent,
        BranchWiseRentalPaymentComponent,
        ConsumeitemInventoryComponent,
        EmployeePayrollComponent,
    ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    MatCardModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatCheckboxModule,
    MatIconModule,
    MatToolbarModule,
    MatCardModule,
    HttpClientModule,
    MatSidenavModule,
    MatBadgeModule,
    MatTooltipModule,
    MatListModule,
    MatExpansionModule,
    MatGridListModule,
    MatTreeModule,
    MatSlideToggleModule,
    MatMenuModule,
    MatSnackBarModule,
    MatDialogModule,
    MatTableModule,
    MatPaginatorModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatRadioModule,
    MatProgressSpinnerModule,
    MatTabsModule,
    MatStepperModule,
    MatAutocompleteModule,
    ChartsModule,
    MatTableExporterModule,
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: Interceptor, multi: true },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
