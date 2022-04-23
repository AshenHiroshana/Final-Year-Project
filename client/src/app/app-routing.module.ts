import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {LoginComponent} from './views/login/login.component';
import {MainWindowComponent} from './views/main-window/main-window.component';
import {DashboardComponent} from './views/dashboard/dashboard.component';
import {PageNotFoundComponent} from './views/page-not-found/page-not-found.component';
import {UserTableComponent} from './views/modules/user/user-table/user-table.component';
import {UserFormComponent} from './views/modules/user/user-form/user-form.component';
import {UserDetailComponent} from './views/modules/user/user-detail/user-detail.component';
import {UserUpdateFormComponent} from './views/modules/user/user-update-form/user-update-form.component';
import {RoleTableComponent} from './views/modules/role/role-table/role-table.component';
import {RoleFormComponent} from './views/modules/role/role-form/role-form.component';
import {RoleDetailComponent} from './views/modules/role/role-detail/role-detail.component';
import {RoleUpdateFormComponent} from './views/modules/role/role-update-form/role-update-form.component';
import {ChangePasswordComponent} from './views/modules/user/change-password/change-password.component';
import {ResetPasswordComponent} from './views/modules/user/reset-password/reset-password.component';
import {ChangePhotoComponent} from './views/modules/user/change-photo/change-photo.component';
import {MyAllNotificationComponent} from './views/modules/user/my-all-notification/my-all-notification.component';
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
import {AuctionTableComponent} from './views/modules/auction/auction-table/auction-table.component';
import {AuctionFormComponent} from './views/modules/auction/auction-form/auction-form.component';
import {AuctionDetailComponent} from './views/modules/auction/auction-detail/auction-detail.component';
import {AuctionUpdateFormComponent} from './views/modules/auction/auction-update-form/auction-update-form.component';
import {ServicepaymentTableComponent} from './views/modules/servicepayment/servicepayment-table/servicepayment-table.component';
import {ServicepaymentFormComponent} from './views/modules/servicepayment/servicepayment-form/servicepayment-form.component';
import {ServicepaymentDetailComponent} from './views/modules/servicepayment/servicepayment-detail/servicepayment-detail.component';
import {ServicepaymentUpdateFormComponent} from './views/modules/servicepayment/servicepayment-update-form/servicepayment-update-form.component';
import {ProcurementpaymentTableComponent} from './views/modules/procurementpayment/procurementpayment-table/procurementpayment-table.component';
import {ProcurementpaymentFormComponent} from './views/modules/procurementpayment/procurementpayment-form/procurementpayment-form.component';
import {ProcurementpaymentDetailComponent} from './views/modules/procurementpayment/procurementpayment-detail/procurementpayment-detail.component';
import {ProcurementpaymentUpdateFormComponent} from './views/modules/procurementpayment/procurementpayment-update-form/procurementpayment-update-form.component';
import {VendorTableComponent} from './views/modules/vendor/vendor-table/vendor-table.component';
import {VendorFormComponent} from './views/modules/vendor/vendor-form/vendor-form.component';
import {VendorDetailComponent} from './views/modules/vendor/vendor-detail/vendor-detail.component';
import {VendorUpdateFormComponent} from './views/modules/vendor/vendor-update-form/vendor-update-form.component';
import {BranchsectionTableComponent} from './views/modules/branchsection/branchsection-table/branchsection-table.component';
import {BranchsectionFormComponent} from './views/modules/branchsection/branchsection-form/branchsection-form.component';
import {BranchsectionDetailComponent} from './views/modules/branchsection/branchsection-detail/branchsection-detail.component';
import {BranchsectionUpdateFormComponent} from './views/modules/branchsection/branchsection-update-form/branchsection-update-form.component';
import {ProcurementallocationTableComponent} from './views/modules/procurementallocation/procurementallocation-table/procurementallocation-table.component';
import {ProcurementallocationFormComponent} from './views/modules/procurementallocation/procurementallocation-form/procurementallocation-form.component';
import {ProcurementallocationDetailComponent} from './views/modules/procurementallocation/procurementallocation-detail/procurementallocation-detail.component';
import {ProcurementallocationUpdateFormComponent} from './views/modules/procurementallocation/procurementallocation-update-form/procurementallocation-update-form.component';
import {ConsumedistributionTableComponent} from './views/modules/consumedistribution/consumedistribution-table/consumedistribution-table.component';
import {ConsumedistributionFormComponent} from './views/modules/consumedistribution/consumedistribution-form/consumedistribution-form.component';
import {ConsumedistributionDetailComponent} from './views/modules/consumedistribution/consumedistribution-detail/consumedistribution-detail.component';
import {ConsumedistributionUpdateFormComponent} from './views/modules/consumedistribution/consumedistribution-update-form/consumedistribution-update-form.component';
import {ProcurementitempurchaseTableComponent} from './views/modules/procurementitempurchase/procurementitempurchase-table/procurementitempurchase-table.component';
import {ProcurementitempurchaseFormComponent} from './views/modules/procurementitempurchase/procurementitempurchase-form/procurementitempurchase-form.component';
import {ProcurementitempurchaseDetailComponent} from './views/modules/procurementitempurchase/procurementitempurchase-detail/procurementitempurchase-detail.component';
import {ProcurementitempurchaseUpdateFormComponent} from './views/modules/procurementitempurchase/procurementitempurchase-update-form/procurementitempurchase-update-form.component';
import {ConsumeitemTableComponent} from './views/modules/consumeitem/consumeitem-table/consumeitem-table.component';
import {ConsumeitemFormComponent} from './views/modules/consumeitem/consumeitem-form/consumeitem-form.component';
import {ConsumeitemDetailComponent} from './views/modules/consumeitem/consumeitem-detail/consumeitem-detail.component';
import {ConsumeitemUpdateFormComponent} from './views/modules/consumeitem/consumeitem-update-form/consumeitem-update-form.component';
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
import {BranchroleTableComponent} from './views/modules/branchrole/branchrole-table/branchrole-table.component';
import {BranchroleFormComponent} from './views/modules/branchrole/branchrole-form/branchrole-form.component';
import {BranchroleDetailComponent} from './views/modules/branchrole/branchrole-detail/branchrole-detail.component';
import {BranchroleUpdateFormComponent} from './views/modules/branchrole/branchrole-update-form/branchrole-update-form.component';
import {ProcurementrefundTableComponent} from './views/modules/procurementrefund/procurementrefund-table/procurementrefund-table.component';
import {ProcurementrefundFormComponent} from './views/modules/procurementrefund/procurementrefund-form/procurementrefund-form.component';
import {ProcurementrefundDetailComponent} from './views/modules/procurementrefund/procurementrefund-detail/procurementrefund-detail.component';
import {ProcurementrefundUpdateFormComponent} from './views/modules/procurementrefund/procurementrefund-update-form/procurementrefund-update-form.component';
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
import {ServiceTableComponent} from './views/modules/service/service-table/service-table.component';
import {ServiceFormComponent} from './views/modules/service/service-form/service-form.component';
import {ServiceDetailComponent} from './views/modules/service/service-detail/service-detail.component';
import {ServiceUpdateFormComponent} from './views/modules/service/service-update-form/service-update-form.component';
import {BillpaymentTableComponent} from './views/modules/billpayment/billpayment-table/billpayment-table.component';
import {BillpaymentFormComponent} from './views/modules/billpayment/billpayment-form/billpayment-form.component';
import {BillpaymentDetailComponent} from './views/modules/billpayment/billpayment-detail/billpayment-detail.component';
import {BillpaymentUpdateFormComponent} from './views/modules/billpayment/billpayment-update-form/billpayment-update-form.component';
import {DesignationTableComponent} from './views/modules/designation/designation-table/designation-table.component';
import {DesignationFormComponent} from './views/modules/designation/designation-form/designation-form.component';
import {DesignationDetailComponent} from './views/modules/designation/designation-detail/designation-detail.component';
import {DesignationUpdateFormComponent} from './views/modules/designation/designation-update-form/designation-update-form.component';
import {PayrollTableComponent} from './views/modules/payroll/payroll-table/payroll-table.component';
import {PayrollFormComponent} from './views/modules/payroll/payroll-form/payroll-form.component';
import {PayrollDetailComponent} from './views/modules/payroll/payroll-detail/payroll-detail.component';
import {PayrollUpdateFormComponent} from './views/modules/payroll/payroll-update-form/payroll-update-form.component';
import {AttendanceTableComponent} from './views/modules/attendance/attendance-table/attendance-table.component';
import {AttendanceFormComponent} from './views/modules/attendance/attendance-form/attendance-form.component';
import {AttendanceDetailComponent} from './views/modules/attendance/attendance-detail/attendance-detail.component';
import {AttendanceUpdateFormComponent} from './views/modules/attendance/attendance-update-form/attendance-update-form.component';
import {ProcurementitemTableComponent} from './views/modules/procurementitem/procurementitem-table/procurementitem-table.component';
import {ProcurementitemFormComponent} from './views/modules/procurementitem/procurementitem-form/procurementitem-form.component';
import {ProcurementitemDetailComponent} from './views/modules/procurementitem/procurementitem-detail/procurementitem-detail.component';
import {ProcurementitemUpdateFormComponent} from './views/modules/procurementitem/procurementitem-update-form/procurementitem-update-form.component';
import {YearWiseConsumeitempaymentCountComponent} from "./views/modules/reports/year-wise-consumeitempayment-count/year-wise-consumeitempayment-count.component";
import {BranchWiseRentalPaymentComponent} from "./views/modules/reports/branch-wise-rental-payment/branch-wise-rental-payment.component";
import {ConsumeitemInventoryComponent} from "./views/modules/reports/consumeitem-inventory/consumeitem-inventory.component";
import {EmployeePayrollComponent} from "./views/modules/reports/employee-payroll/employee-payroll.component";

const routes: Routes = [
  {path: 'login', component: LoginComponent},
  {
    path: '',
    component: MainWindowComponent,
    children: [

      {path: 'users', component: UserTableComponent},
      {path: 'users/add', component: UserFormComponent},
      {path: 'users/change-my-password', component: ChangePasswordComponent},
      {path: 'users/change-my-photo', component: ChangePhotoComponent},
      {path: 'users/my-all-notifications', component: MyAllNotificationComponent},
      {path: 'users/reset-password', component: ResetPasswordComponent},
      {path: 'users/:id', component: UserDetailComponent},
      {path: 'users/edit/:id', component: UserUpdateFormComponent},

      {path: 'roles', component: RoleTableComponent},
      {path: 'roles/add', component: RoleFormComponent},
      {path: 'roles/:id', component: RoleDetailComponent},
      {path: 'roles/edit/:id', component: RoleUpdateFormComponent},

      {path: 'consumeitempurchases', component: ConsumeitempurchaseTableComponent},
      {path: 'consumeitempurchases/add', component: ConsumeitempurchaseFormComponent},
      {path: 'consumeitempurchases/:id', component: ConsumeitempurchaseDetailComponent},
      {path: 'consumeitempurchases/edit/:id', component: ConsumeitempurchaseUpdateFormComponent},

      {path: 'procurementitemtypes', component: ProcurementitemtypeTableComponent},
      {path: 'procurementitemtypes/add', component: ProcurementitemtypeFormComponent},
      {path: 'procurementitemtypes/:id', component: ProcurementitemtypeDetailComponent},
      {path: 'procurementitemtypes/edit/:id', component: ProcurementitemtypeUpdateFormComponent},

      {path: 'appointments', component: AppointmentTableComponent},
      {path: 'appointments/add', component: AppointmentFormComponent},
      {path: 'appointments/:id', component: AppointmentDetailComponent},
      {path: 'appointments/edit/:id', component: AppointmentUpdateFormComponent},

      {path: 'consumeitempayments', component: ConsumeitempaymentTableComponent},
      {path: 'consumeitempayments/add', component: ConsumeitempaymentFormComponent},
      {path: 'consumeitempayments/:id', component: ConsumeitempaymentDetailComponent},
      {path: 'consumeitempayments/edit/:id', component: ConsumeitempaymentUpdateFormComponent},

      {path: 'servicerefunds', component: ServicerefundTableComponent},
      {path: 'servicerefunds/add', component: ServicerefundFormComponent},
      {path: 'servicerefunds/:id', component: ServicerefundDetailComponent},
      //{path: 'servicerefunds/edit/:id', component: ServicerefundUpdateFormComponent},

      {path: 'employees', component: EmployeeTableComponent},
      {path: 'employees/add', component: EmployeeFormComponent},
      {path: 'employees/:id', component: EmployeeDetailComponent},
      {path: 'employees/edit/:id', component: EmployeeUpdateFormComponent},

      {path: 'branches', component: BranchTableComponent},
      {path: 'branches/add', component: BranchFormComponent},
      {path: 'branches/:id', component: BranchDetailComponent},
      {path: 'branches/edit/:id', component: BranchUpdateFormComponent},

      {path: 'auctions', component: AuctionTableComponent},
      {path: 'auctions/add', component: AuctionFormComponent},
      {path: 'auctions/:id', component: AuctionDetailComponent},
      {path: 'auctions/edit/:id', component: AuctionUpdateFormComponent},

      {path: 'servicepayments', component: ServicepaymentTableComponent},
      {path: 'servicepayments/add', component: ServicepaymentFormComponent},
      {path: 'servicepayments/:id', component: ServicepaymentDetailComponent},
      {path: 'servicepayments/edit/:id', component: ServicepaymentUpdateFormComponent},

      {path: 'procurementpayments', component: ProcurementpaymentTableComponent},
      {path: 'procurementpayments/add', component: ProcurementpaymentFormComponent},
      {path: 'procurementpayments/:id', component: ProcurementpaymentDetailComponent},
      {path: 'procurementpayments/edit/:id', component: ProcurementpaymentUpdateFormComponent},

      {path: 'vendors', component: VendorTableComponent},
      {path: 'vendors/add', component: VendorFormComponent},
      {path: 'vendors/:id', component: VendorDetailComponent},
      {path: 'vendors/edit/:id', component: VendorUpdateFormComponent},

      {path: 'branchsections', component: BranchsectionTableComponent},
      {path: 'branchsections/add', component: BranchsectionFormComponent},
      {path: 'branchsections/:id', component: BranchsectionDetailComponent},
      {path: 'branchsections/edit/:id', component: BranchsectionUpdateFormComponent},

      {path: 'procurementallocations', component: ProcurementallocationTableComponent},
      {path: 'procurementallocations/add', component: ProcurementallocationFormComponent},
      {path: 'procurementallocations/:id', component: ProcurementallocationDetailComponent},
      {path: 'procurementallocations/edit/:id', component: ProcurementallocationUpdateFormComponent},

      {path: 'consumedistributions', component: ConsumedistributionTableComponent},
      {path: 'consumedistributions/add', component: ConsumedistributionFormComponent},
      {path: 'consumedistributions/:id', component: ConsumedistributionDetailComponent},
      {path: 'consumedistributions/edit/:id', component: ConsumedistributionUpdateFormComponent},

      {path: 'procurementitempurchases', component: ProcurementitempurchaseTableComponent},
      {path: 'procurementitempurchases/add', component: ProcurementitempurchaseFormComponent},
      {path: 'procurementitempurchases/:id', component: ProcurementitempurchaseDetailComponent},
      // {path: 'procurementitempurchases/edit/:id', component: ProcurementitempurchaseUpdateFormComponent},

      {path: 'consumeitems', component: ConsumeitemTableComponent},
      {path: 'consumeitems/add', component: ConsumeitemFormComponent},
      {path: 'consumeitems/:id', component: ConsumeitemDetailComponent},
      {path: 'consumeitems/edit/:id', component: ConsumeitemUpdateFormComponent},

      {path: 'printorders', component: PrintorderTableComponent},
      {path: 'printorders/add', component: PrintorderFormComponent},
      {path: 'printorders/:id', component: PrintorderDetailComponent},
      {path: 'printorders/edit/:id', component: PrintorderUpdateFormComponent},

      {path: 'rentalpayments', component: RentalpaymentTableComponent},
      {path: 'rentalpayments/add', component: RentalpaymentFormComponent},
      {path: 'rentalpayments/:id', component: RentalpaymentDetailComponent},
      {path: 'rentalpayments/edit/:id', component: RentalpaymentUpdateFormComponent},

      {path: 'branchroleassignments', component: BranchroleassignmentTableComponent},
      {path: 'branchroleassignments/add', component: BranchroleassignmentFormComponent},
      {path: 'branchroleassignments/:id', component: BranchroleassignmentDetailComponent},
      {path: 'branchroleassignments/edit/:id', component: BranchroleassignmentUpdateFormComponent},

      {path: 'branchroles', component: BranchroleTableComponent},
      {path: 'branchroles/add', component: BranchroleFormComponent},
      {path: 'branchroles/:id', component: BranchroleDetailComponent},
      {path: 'branchroles/edit/:id', component: BranchroleUpdateFormComponent},

      {path: 'procurementrefunds', component: ProcurementrefundTableComponent},
      {path: 'procurementrefunds/add', component: ProcurementrefundFormComponent},
      {path: 'procurementrefunds/:id', component: ProcurementrefundDetailComponent},
      //{path: 'procurementrefunds/edit/:id', component: ProcurementrefundUpdateFormComponent},

      {path: 'rentals', component: RentalTableComponent},
      {path: 'rentals/add', component: RentalFormComponent},
      {path: 'rentals/:id', component: RentalDetailComponent},
      {path: 'rentals/edit/:id', component: RentalUpdateFormComponent},

      {path: 'prints', component: PrintTableComponent},
      {path: 'prints/add', component: PrintFormComponent},
      {path: 'prints/:id', component: PrintDetailComponent},
      {path: 'prints/edit/:id', component: PrintUpdateFormComponent},

      {path: 'servicetypes', component: ServicetypeTableComponent},
      {path: 'servicetypes/add', component: ServicetypeFormComponent},
      {path: 'servicetypes/:id', component: ServicetypeDetailComponent},
      {path: 'servicetypes/edit/:id', component: ServicetypeUpdateFormComponent},

      {path: 'materials', component: MaterialTableComponent},
      {path: 'materials/add', component: MaterialFormComponent},
      {path: 'materials/:id', component: MaterialDetailComponent},
      {path: 'materials/edit/:id', component: MaterialUpdateFormComponent},

      {path: 'services', component: ServiceTableComponent},
      {path: 'services/add', component: ServiceFormComponent},
      {path: 'services/:id', component: ServiceDetailComponent},
      {path: 'services/edit/:id', component: ServiceUpdateFormComponent},

      {path: 'billpayments', component: BillpaymentTableComponent},
      {path: 'billpayments/add', component: BillpaymentFormComponent},
      {path: 'billpayments/:id', component: BillpaymentDetailComponent},
      {path: 'billpayments/edit/:id', component: BillpaymentUpdateFormComponent},

      {path: 'designations', component: DesignationTableComponent},
      {path: 'designations/add', component: DesignationFormComponent},
      {path: 'designations/:id', component: DesignationDetailComponent},
      {path: 'designations/edit/:id', component: DesignationUpdateFormComponent},

      {path: 'payrolls', component: PayrollTableComponent},
      {path: 'payrolls/add', component: PayrollFormComponent},
      {path: 'payrolls/:id', component: PayrollDetailComponent},
      {path: 'payrolls/edit/:id', component: PayrollUpdateFormComponent},

      {path: 'attendances', component: AttendanceTableComponent},
      {path: 'attendances/add', component: AttendanceFormComponent},
      {path: 'attendances/:id', component: AttendanceDetailComponent},
      {path: 'attendances/edit/:id', component: AttendanceUpdateFormComponent},

      {path: 'procurementitems', component: ProcurementitemTableComponent},
      {path: 'procurementitems/add', component: ProcurementitemFormComponent},
      {path: 'procurementitems/:id', component: ProcurementitemDetailComponent},
      {path: 'procurementitems/edit/:id', component: ProcurementitemUpdateFormComponent},

      {path: 'report/year-wise-consumeitempayment-count', component: YearWiseConsumeitempaymentCountComponent},
      {path: 'report/branch-wise-rental-payment', component: BranchWiseRentalPaymentComponent},
      {path: 'report/consumeitem-inventory', component: ConsumeitemInventoryComponent},
      {path: 'report/employee-payroll', component: EmployeePayrollComponent},


      {path: 'dashboard', component: DashboardComponent},
      {path: '', component: DashboardComponent},
    ]
  },
  {path: '**', component: PageNotFoundComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
