import {Component, OnDestroy, OnInit} from '@angular/core';
import {UserService} from '../../services/user.service';
import {Router} from '@angular/router';
import {TokenManager} from '../../shared/security/token-manager';
import {AuthenticationService} from '../../shared/authentication.service';
import {LoggedUser} from '../../shared/logged-user';
import {LinkItem} from '../../shared/link-item';
import {ThemeManager} from '../../shared/views/theme-manager';
import {UsecaseList} from '../../usecase-list';
import {NotificationService} from '../../services/notification.service';
import {PrimeNumbers} from '../../shared/prime-numbers';
import {Notification} from '../../entities/notification';
import {BranchWiseRentalPaymentComponent} from "../modules/reports/branch-wise-rental-payment/branch-wise-rental-payment.component";

@Component({
  selector: 'app-main-window',
  templateUrl: './main-window.component.html',
  styleUrls: ['./main-window.component.scss']
})
export class MainWindowComponent implements OnInit, OnDestroy {

  constructor(
    private userService: UserService,
    private router: Router,
    private authenticationService: AuthenticationService,
    private notificationService: NotificationService
  ) {
    if (!TokenManager.isContainsToken()){
      this.router.navigateByUrl('/login');
    }
  }

  get loggedUserName(): string{
    return LoggedUser.getName();
  }

  get loggedUserPhoto(): string{
    return LoggedUser.getPhoto();
  }

  refreshRate = PrimeNumbers.getRandomNumber();
  unreadNotificationCount = '0';
  isLive = true;
  sidenavOpen = false;
  sidenaveMode = 'side';
  usecasesLoaded = false;
  linkItems: LinkItem[] = [];
  isDark: boolean;
  latestNotifications: Notification[] = [];

  async loadData(): Promise<void>{
    this.notificationService.getUnreadCount().then((count) => {
      if (count > 99) { this.unreadNotificationCount = '99+'; }
      else{ this.unreadNotificationCount = count.toString(); }
    }).catch((e) => {
      console.log(e);
    });

    this.notificationService.getLatest().then(async (data) => {
      this.latestNotifications = data;
      for (const notification of data){
        if (!notification.dodelivered){
          await this.notificationService.setDelivered(notification.id);
        }
      }
    }).catch((e) => {
      console.log(e);
    });

  }

  setNotificationsAsRead(): void{
    for (const notification of this.latestNotifications){
      if (!notification.doread){
        this.notificationService.setRead(notification.id);
      }
    }
  }

  refreshData(): void{
    setTimeout( async () => {
      if (!this.isLive) { return; }
      try{
        await this.loadData();
      }finally {
        this.refreshData();
      }
    }, this.refreshRate);
  }

  async ngOnInit(): Promise<void> {
    this.userService.me().then((user) => {
      LoggedUser.user = user;
    });
    this.userService.myUsecases().then((usecases) => {
      LoggedUser.usecases = usecases;
      this.setLinkItems();
      this.usecasesLoaded = true;
    });
    this.setSidenavSettings();
    this.isDark = ThemeManager.isDark();
    await this.loadData();
    this.refreshData();
  }

  async logout(): Promise<void>{
    await this.authenticationService.destroyToken();
    TokenManager.destroyToken();
    LoggedUser.clear();
    this.router.navigateByUrl('/login');
  }

  setSidenavSettings(): void{
    const width = window.innerWidth;
    if (width < 992){
      this.sidenavOpen = false;
      this.sidenaveMode = 'over';
    }else{
      this.sidenavOpen = true;
      this.sidenaveMode = 'side';
    }
  }

  private setLinkItems(): void{
    const dashboardLink = new LinkItem('Dashboard', '/', 'dashboard');
    const userLink = new LinkItem('User', '', 'admin_panel_settings');
    const roleLink = new LinkItem('Role', '', 'assignment_ind');

    const procurementpaymentLink = new LinkItem('Payment', '/', 'paid');
    const procurementrefundLink = new LinkItem('Refund', '/', 'highlight_off');
    const procurementitempurchaseLink = new LinkItem('Purchase', '/', 'add_shopping_cart');
    const procurementallocationLink = new LinkItem('Allocation', '/', 'add_business');
    const procurementitemtypeLink = new LinkItem('Item type', '/', 'view_in_ar');
    const procurementitemLink = new LinkItem('Procurement', '/', 'bedroom_parent');
    const auctionLink = new LinkItem('Auction', '/', 'sell');

    const serviceLink = new LinkItem('Service', '/', 'home_repair_service');
    const servicetypeLink = new LinkItem('Service Type', '/', 'trip_origin');
    const servicerefundLink = new LinkItem('Service Refund ', '/', 'trip_origin');
    const servicepaymentLink = new LinkItem('Service Payment', '/', 'trip_origin');


    const employeeLink = new LinkItem('Employee', '/', 'supervised_user_circle');
    const designationLink = new LinkItem('Designation', '/', 'trip_origin');
    const appointmentLink = new LinkItem('Appointment', '/', 'trip_origin');
    const attendanceLink = new LinkItem('Attendance', '/', 'trip_origin');
    const payrollLink = new LinkItem('Payroll', '/', 'trip_origin');

    const materialLink = new LinkItem('Print Material', '/', 'trip_origin');
    const printLink = new LinkItem('Print', '/', 'trip_origin');
    const printorderLink = new LinkItem('Print Order', '/', 'trip_origin');

    const consumeitemLink = new LinkItem('Consume Item', '/', 'trip_origin');
    const consumedistributionLink = new LinkItem('Distribution', '/', 'trip_origin');
    const consumeitempaymentLink = new LinkItem('Payment', '/', 'trip_origin');
    const consumeitempurchaseLink = new LinkItem('Purchase ', '/', 'add_shopping_cart');


    const branchroleassignmentLink = new LinkItem('Role Assignment', '/', 'trip_origin');
    const branchLink = new LinkItem('Branch', '/', 'trip_origin');
    const branchsectionLink = new LinkItem('Section', '/', 'trip_origin');
    const branchroleLink = new LinkItem('Role ', '/', 'trip_origin');


    const vendorLink = new LinkItem('Vendor', '/', 'trip_origin');

    const billpaymentLink = new LinkItem('Bill Payment', '/', 'trip_origin');
    const rentalLink = new LinkItem('Rental And Bill Payment', '/', 'trip_origin');
    const rentalpaymentLink = new LinkItem('Rental Payment', '/', 'trip_origin');

    const reportLink = new LinkItem('Reports', '/', 'trip_origin');

    const showUserLink = new LinkItem('Show All Users', '/users', 'list');
    showUserLink.addUsecaseId(UsecaseList.SHOW_ALL_USERS);
    userLink.children.push(showUserLink);

    const addUserLink = new LinkItem('Add New User', '/users/add', 'add');
    addUserLink.addUsecaseId(UsecaseList.ADD_USER);
    userLink.children.push(addUserLink);

    const showRoleLink = new LinkItem('Show All Roles', '/roles', 'list');
    showRoleLink.addUsecaseId(UsecaseList.SHOW_ALL_ROLES);
    roleLink.children.push(showRoleLink);

    const addRoleLink = new LinkItem('Add New Role', '/roles/add', 'add');
    addRoleLink.addUsecaseId(UsecaseList.ADD_ROLE);
    roleLink.children.push(addRoleLink);

    const addNewAppointmentLink = new LinkItem('Add New Appointment', 'appointments/add', 'add');
    addNewAppointmentLink.addUsecaseId(UsecaseList.ADD_APPOINTMENT);
    appointmentLink.children.push(addNewAppointmentLink);

    const showAllAppointmentLink = new LinkItem('Show All Appointment', 'appointments', 'list');
    showAllAppointmentLink.addUsecaseId(UsecaseList.SHOW_ALL_APPOINTMENTS);
    appointmentLink.children.push(showAllAppointmentLink);

    const addNewProcurementrefundLink = new LinkItem('Add New Procurementrefund', 'procurementrefunds/add', 'add');
    addNewProcurementrefundLink.addUsecaseId(UsecaseList.ADD_PROCUREMENTREFUND);
    procurementrefundLink.children.push(addNewProcurementrefundLink);

    const showAllProcurementrefundLink = new LinkItem('Show All Procurementrefund', 'procurementrefunds', 'list');
    showAllProcurementrefundLink.addUsecaseId(UsecaseList.SHOW_ALL_PROCUREMENTREFUNDS);
    procurementrefundLink.children.push(showAllProcurementrefundLink);

    const addNewServicetypeLink = new LinkItem('Add New Servicetype', 'servicetypes/add', 'add');
    addNewServicetypeLink.addUsecaseId(UsecaseList.ADD_SERVICETYPE);
    servicetypeLink.children.push(addNewServicetypeLink);

    const showAllServicetypeLink = new LinkItem('Show All Servicetype', 'servicetypes', 'list');
    showAllServicetypeLink.addUsecaseId(UsecaseList.SHOW_ALL_SERVICETYPES);
    servicetypeLink.children.push(showAllServicetypeLink);

    const addNewServicerefundLink = new LinkItem('Add New Servicerefund', 'servicerefunds/add', 'add');
    addNewServicerefundLink.addUsecaseId(UsecaseList.ADD_SERVICEREFUND);
    servicerefundLink.children.push(addNewServicerefundLink);

    const showAllServicerefundLink = new LinkItem('Show All Servicerefund', 'servicerefunds', 'list');
    showAllServicerefundLink.addUsecaseId(UsecaseList.SHOW_ALL_SERVICEREFUNDS);
    servicerefundLink.children.push(showAllServicerefundLink);

    const addNewProcurementitempurchaseLink = new LinkItem('Add New Procurementitempurchase', 'procurementitempurchases/add', 'add');
    addNewProcurementitempurchaseLink.addUsecaseId(UsecaseList.ADD_PROCUREMENTITEMPURCHASE);
    procurementitempurchaseLink.children.push(addNewProcurementitempurchaseLink);

    const showAllProcurementitempurchaseLink = new LinkItem('Show All Procurementitempurchase', 'procurementitempurchases', 'list');
    showAllProcurementitempurchaseLink.addUsecaseId(UsecaseList.SHOW_ALL_PROCUREMENTITEMPURCHASES);
    procurementitempurchaseLink.children.push(showAllProcurementitempurchaseLink);

    const addNewBranchroleassignmentLink = new LinkItem('Add New Branchroleassignment', 'branchroleassignments/add', 'add');
    addNewBranchroleassignmentLink.addUsecaseId(UsecaseList.ADD_BRANCHROLEASSIGNMENT);
    branchroleassignmentLink.children.push(addNewBranchroleassignmentLink);

    const showAllBranchroleassignmentLink = new LinkItem('Show All Branchroleassignment', 'branchroleassignments', 'list');
    showAllBranchroleassignmentLink.addUsecaseId(UsecaseList.SHOW_ALL_BRANCHROLEASSIGNMENTS);
    branchroleassignmentLink.children.push(showAllBranchroleassignmentLink);

    const addNewPrintLink = new LinkItem('Add New Print', 'prints/add', 'add');
    addNewPrintLink.addUsecaseId(UsecaseList.ADD_PRINT);
    printLink.children.push(addNewPrintLink);

    const showAllPrintLink = new LinkItem('Show All Print', 'prints', 'list');
    showAllPrintLink.addUsecaseId(UsecaseList.SHOW_ALL_PRINTS);
    printLink.children.push(showAllPrintLink);

    const addNewPayrollLink = new LinkItem('Add New Payroll', 'payrolls/add', 'add');
    addNewPayrollLink.addUsecaseId(UsecaseList.ADD_PAYROLL);
    payrollLink.children.push(addNewPayrollLink);

    const showAllPayrollLink = new LinkItem('Show All Payroll', 'payrolls', 'list');
    showAllPayrollLink.addUsecaseId(UsecaseList.SHOW_ALL_PAYROLLS);
    payrollLink.children.push(showAllPayrollLink);

    const addNewConsumeitemLink = new LinkItem('Add New Consumeitem', 'consumeitems/add', 'add');
    addNewConsumeitemLink.addUsecaseId(UsecaseList.ADD_CONSUMEITEM);
    consumeitemLink.children.push(addNewConsumeitemLink);

    const showAllConsumeitemLink = new LinkItem('Show All Consumeitem', 'consumeitems', 'list');
    showAllConsumeitemLink.addUsecaseId(UsecaseList.SHOW_ALL_CONSUMEITEMS);
    consumeitemLink.children.push(showAllConsumeitemLink);

    const addNewBranchLink = new LinkItem('Add New Branch', 'branches/add', 'add');
    addNewBranchLink.addUsecaseId(UsecaseList.ADD_BRANCH);
    branchLink.children.push(addNewBranchLink);

    const showAllBranchLink = new LinkItem('Show All Branch', 'branches', 'list');
    showAllBranchLink.addUsecaseId(UsecaseList.SHOW_ALL_BRANCHES);
    branchLink.children.push(showAllBranchLink);

    const addNewConsumeitempaymentLink = new LinkItem('Add New Consumeitempayment', 'consumeitempayments/add', 'add');
    addNewConsumeitempaymentLink.addUsecaseId(UsecaseList.ADD_CONSUMEITEMPAYMENT);
    consumeitempaymentLink.children.push(addNewConsumeitempaymentLink);

    const showAllConsumeitempaymentLink = new LinkItem('Show All Consumeitempayment', 'consumeitempayments', 'list');
    showAllConsumeitempaymentLink.addUsecaseId(UsecaseList.SHOW_ALL_CONSUMEITEMPAYMENTS);
    consumeitempaymentLink.children.push(showAllConsumeitempaymentLink);

    const addNewPrintorderLink = new LinkItem('Add New Printorder', 'printorders/add', 'add');
    addNewPrintorderLink.addUsecaseId(UsecaseList.ADD_PRINTORDER);
    printorderLink.children.push(addNewPrintorderLink);

    const showAllPrintorderLink = new LinkItem('Show All Printorder', 'printorders', 'list');
    showAllPrintorderLink.addUsecaseId(UsecaseList.SHOW_ALL_PRINTORDERS);
    printorderLink.children.push(showAllPrintorderLink);

    const addNewBranchsectionLink = new LinkItem('Add New Branchsection', 'branchsections/add', 'add');
    addNewBranchsectionLink.addUsecaseId(UsecaseList.ADD_BRANCHSECTION);
    branchsectionLink.children.push(addNewBranchsectionLink);

    const showAllBranchsectionLink = new LinkItem('Show All Branchsection', 'branchsections', 'list');
    showAllBranchsectionLink.addUsecaseId(UsecaseList.SHOW_ALL_BRANCHSECTIONS);
    branchsectionLink.children.push(showAllBranchsectionLink);

    const addNewProcurementallocationLink = new LinkItem('Add New Procurementallocation', 'procurementallocations/add', 'add');
    addNewProcurementallocationLink.addUsecaseId(UsecaseList.ADD_PROCUREMENTALLOCATION);
    procurementallocationLink.children.push(addNewProcurementallocationLink);

    const showAllProcurementallocationLink = new LinkItem('Show All Procurementallocation', 'procurementallocations', 'list');
    showAllProcurementallocationLink.addUsecaseId(UsecaseList.SHOW_ALL_PROCUREMENTALLOCATIONS);
    procurementallocationLink.children.push(showAllProcurementallocationLink);

    const addNewAttendanceLink = new LinkItem('Add New Attendance', 'attendances/add', 'add');
    addNewAttendanceLink.addUsecaseId(UsecaseList.ADD_ATTENDANCE);
    attendanceLink.children.push(addNewAttendanceLink);

    const showAllAttendanceLink = new LinkItem('Show All Attendance', 'attendances', 'list');
    showAllAttendanceLink.addUsecaseId(UsecaseList.SHOW_ALL_ATTENDANCES);
    attendanceLink.children.push(showAllAttendanceLink);

    const addNewDesignationLink = new LinkItem('Add New Designation', 'designations/add', 'add');
    addNewDesignationLink.addUsecaseId(UsecaseList.ADD_DESIGNATION);
    designationLink.children.push(addNewDesignationLink);

    const showAllDesignationLink = new LinkItem('Show All Designation', 'designations', 'list');
    showAllDesignationLink.addUsecaseId(UsecaseList.SHOW_ALL_DESIGNATIONS);
    designationLink.children.push(showAllDesignationLink);

    const addNewRentalpaymentLink = new LinkItem('Add New Rentalpayment', 'rentalpayments/add', 'add');
    addNewRentalpaymentLink.addUsecaseId(UsecaseList.ADD_RENTALPAYMENT);
    rentalpaymentLink.children.push(addNewRentalpaymentLink);

    const showAllRentalpaymentLink = new LinkItem('Show All Rentalpayment', 'rentalpayments', 'list');
    showAllRentalpaymentLink.addUsecaseId(UsecaseList.SHOW_ALL_RENTALPAYMENTS);
    rentalpaymentLink.children.push(showAllRentalpaymentLink);

    const addNewAuctionLink = new LinkItem('Add New Auction', 'auctions/add', 'add');
    addNewAuctionLink.addUsecaseId(UsecaseList.ADD_AUCTION);
    auctionLink.children.push(addNewAuctionLink);

    const showAllAuctionLink = new LinkItem('Show All Auction', 'auctions', 'list');
    showAllAuctionLink.addUsecaseId(UsecaseList.SHOW_ALL_AUCTIONS);
    auctionLink.children.push(showAllAuctionLink);

    const addNewServiceLink = new LinkItem('Add New Service', 'services/add', 'add');
    addNewServiceLink.addUsecaseId(UsecaseList.ADD_SERVICE);
    serviceLink.children.push(addNewServiceLink);

    const showAllServiceLink = new LinkItem('Show All Service', 'services', 'list');
    showAllServiceLink.addUsecaseId(UsecaseList.SHOW_ALL_SERVICES);
    serviceLink.children.push(showAllServiceLink);

    const addNewMaterialLink = new LinkItem('Add New Material', 'materials/add', 'add');
    addNewMaterialLink.addUsecaseId(UsecaseList.ADD_MATERIAL);
    materialLink.children.push(addNewMaterialLink);

    const showAllMaterialLink = new LinkItem('Show All Material', 'materials', 'list');
    showAllMaterialLink.addUsecaseId(UsecaseList.SHOW_ALL_MATERIALS);
    materialLink.children.push(showAllMaterialLink);

    const addNewVendorLink = new LinkItem('Add New Vendor', 'vendors/add', 'add');
    addNewVendorLink.addUsecaseId(UsecaseList.ADD_VENDOR);
    vendorLink.children.push(addNewVendorLink);

    const showAllVendorLink = new LinkItem('Show All Vendor', 'vendors', 'list');
    showAllVendorLink.addUsecaseId(UsecaseList.SHOW_ALL_VENDORS);
    vendorLink.children.push(showAllVendorLink);

    const addNewConsumedistributionLink = new LinkItem('Add New Consumedistribution', 'consumedistributions/add', 'add');
    addNewConsumedistributionLink.addUsecaseId(UsecaseList.ADD_CONSUMEDISTRIBUTION);
    consumedistributionLink.children.push(addNewConsumedistributionLink);

    const showAllConsumedistributionLink = new LinkItem('Show All Consumedistribution', 'consumedistributions', 'list');
    showAllConsumedistributionLink.addUsecaseId(UsecaseList.SHOW_ALL_CONSUMEDISTRIBUTIONS);
    consumedistributionLink.children.push(showAllConsumedistributionLink);

    const addNewBillpaymentLink = new LinkItem('Add New Billpayment', 'billpayments/add', 'add');
    addNewBillpaymentLink.addUsecaseId(UsecaseList.ADD_BILLPAYMENT);
    billpaymentLink.children.push(addNewBillpaymentLink);

    const showAllBillpaymentLink = new LinkItem('Show All Billpayment', 'billpayments', 'list');
    showAllBillpaymentLink.addUsecaseId(UsecaseList.SHOW_ALL_BILLPAYMENTS);
    billpaymentLink.children.push(showAllBillpaymentLink);

    const addNewProcurementpaymentLink = new LinkItem('Add New Procurementpayment', 'procurementpayments/add', 'add');
    addNewProcurementpaymentLink.addUsecaseId(UsecaseList.ADD_PROCUREMENTPAYMENT);
    procurementpaymentLink.children.push(addNewProcurementpaymentLink);

    const showAllProcurementpaymentLink = new LinkItem('Show All Procurementpayment', 'procurementpayments', 'list');
    showAllProcurementpaymentLink.addUsecaseId(UsecaseList.SHOW_ALL_PROCUREMENTPAYMENTS);
    procurementpaymentLink.children.push(showAllProcurementpaymentLink);

    const addNewProcurementitemtypeLink = new LinkItem('Add New Procurementitemtype', 'procurementitemtypes/add', 'add');
    addNewProcurementitemtypeLink.addUsecaseId(UsecaseList.ADD_PROCUREMENTITEMTYPE);
    procurementitemtypeLink.children.push(addNewProcurementitemtypeLink);

    const showAllProcurementitemtypeLink = new LinkItem('Show All Procurementitemtype', 'procurementitemtypes', 'list');
    showAllProcurementitemtypeLink.addUsecaseId(UsecaseList.SHOW_ALL_PROCUREMENTITEMTYPES);
    procurementitemtypeLink.children.push(showAllProcurementitemtypeLink);

    const addNewEmployeeLink = new LinkItem('Add New Employee', 'employees/add', 'add');
    addNewEmployeeLink.addUsecaseId(UsecaseList.ADD_EMPLOYEE);
    employeeLink.children.push(addNewEmployeeLink);

    const showAllEmployeeLink = new LinkItem('Show All Employee', 'employees', 'list');
    showAllEmployeeLink.addUsecaseId(UsecaseList.SHOW_ALL_EMPLOYEES);
    employeeLink.children.push(showAllEmployeeLink);

    const addNewProcurementitemLink = new LinkItem('Add New Procurementitem', 'procurementitems/add', 'add');
    addNewProcurementitemLink.addUsecaseId(UsecaseList.ADD_PROCUREMENTITEM);
    procurementitemLink.children.push(addNewProcurementitemLink);

    const showAllProcurementitemLink = new LinkItem('Show All Procurementitem', 'procurementitems', 'list');
    showAllProcurementitemLink.addUsecaseId(UsecaseList.SHOW_ALL_PROCUREMENTITEMS);
    procurementitemLink.children.push(showAllProcurementitemLink);

    const addNewRentalLink = new LinkItem('Add New Rental', 'rentals/add', 'add');
    addNewRentalLink.addUsecaseId(UsecaseList.ADD_RENTAL);
    rentalLink.children.push(addNewRentalLink);

    const showAllRentalLink = new LinkItem('Show All Rental', 'rentals', 'list');
    showAllRentalLink.addUsecaseId(UsecaseList.SHOW_ALL_RENTALS);
    rentalLink.children.push(showAllRentalLink);

    const addNewConsumeitempurchaseLink = new LinkItem('Add New Consumeitempurchase', 'consumeitempurchases/add', 'add');
    addNewConsumeitempurchaseLink.addUsecaseId(UsecaseList.ADD_CONSUMEITEMPURCHASE);
    consumeitempurchaseLink.children.push(addNewConsumeitempurchaseLink);

    const showAllConsumeitempurchaseLink = new LinkItem('Show All Consumeitempurchase', 'consumeitempurchases', 'list');
    showAllConsumeitempurchaseLink.addUsecaseId(UsecaseList.SHOW_ALL_CONSUMEITEMPURCHASES);
    consumeitempurchaseLink.children.push(showAllConsumeitempurchaseLink);

    const addNewServicepaymentLink = new LinkItem('Add New Servicepayment', 'servicepayments/add', 'add');
    addNewServicepaymentLink.addUsecaseId(UsecaseList.ADD_SERVICEPAYMENT);
    servicepaymentLink.children.push(addNewServicepaymentLink);

    const showAllServicepaymentLink = new LinkItem('Show All Servicepayment', 'servicepayments', 'list');
    showAllServicepaymentLink.addUsecaseId(UsecaseList.SHOW_ALL_SERVICEPAYMENTS);
    servicepaymentLink.children.push(showAllServicepaymentLink);

    const addNewBranchroleLink = new LinkItem('Add New Branchrole', 'branchroles/add', 'add');
    addNewBranchroleLink.addUsecaseId(UsecaseList.ADD_BRANCHROLE);
    branchroleLink.children.push(addNewBranchroleLink);

    const showAllBranchroleLink = new LinkItem('Show All Branchrole', 'branchroles', 'list');
    showAllBranchroleLink.addUsecaseId(UsecaseList.SHOW_ALL_BRANCHROLES);
    branchroleLink.children.push(showAllBranchroleLink);

    const showyearWiseConsumeitempaymentCountLink = new LinkItem('Show Branch Wise Bill Payment', 'report/year-wise-consumeitempayment-count', 'list');
    showyearWiseConsumeitempaymentCountLink.addUsecaseId(UsecaseList.SHOW_BILLPAYMENT_DETAILS);
    reportLink.children.push(showyearWiseConsumeitempaymentCountLink);

    const showBranchWiseRentalPaymentLink = new LinkItem('Show Branch Wise Rental Payment', 'report/branch-wise-rental-payment', 'list');
    showBranchWiseRentalPaymentLink.addUsecaseId(UsecaseList.SHOW_RENTALPAYMENT_DETAILS);
    reportLink.children.push(showBranchWiseRentalPaymentLink);


    const showConsumeItemInventoryLink = new LinkItem('Show Consume Item Inventory', 'report/consumeitem-inventory', 'list');
    showConsumeItemInventoryLink.addUsecaseId(UsecaseList.SHOW_CONSUMEITEM_DETAILS);
    reportLink.children.push(showConsumeItemInventoryLink);

    const showEmployeePayRollLink = new LinkItem('Salary By Employee', 'report/employee-payroll', 'list');
    showEmployeePayRollLink.addUsecaseId(UsecaseList.SHOW_EMPLOYEE_DETAILS);
    reportLink.children.push(showEmployeePayRollLink);


    this.linkItems.push(dashboardLink);
    this.linkItems.push(userLink);
    this.linkItems.push(roleLink);

    this.linkItems.push(employeeLink);
    employeeLink.children.push(designationLink);
    employeeLink.children.push(appointmentLink);
    employeeLink.children.push(attendanceLink);
    employeeLink.children.push(payrollLink);


    this.linkItems.push(branchLink);
    branchLink.children.push(branchsectionLink);
    branchLink.children.push(branchroleLink);
    branchLink.children.push(branchroleassignmentLink);

    this.linkItems.push(vendorLink);

    this.linkItems.push(procurementitemLink);
    procurementitemLink.children.push(procurementitemtypeLink);
    procurementitemLink.children.push(procurementitempurchaseLink);
    procurementitemLink.children.push(procurementpaymentLink);
    procurementitemLink.children.push(procurementallocationLink);
    procurementitemLink.children.push(procurementrefundLink);
    procurementitemLink.children.push(auctionLink);


    this.linkItems.push(serviceLink);
    serviceLink.children.push(servicetypeLink);
    serviceLink.children.push(servicepaymentLink);
    serviceLink.children.push(servicerefundLink);


    this.linkItems.push(consumeitemLink);
    consumeitemLink.children.push(consumeitempurchaseLink);
    consumeitemLink.children.push(consumeitempaymentLink);
    consumeitemLink.children.push(consumedistributionLink);


    this.linkItems.push(printLink);
    printLink.children.push(materialLink);
    printLink.children.push(printorderLink);


    this.linkItems.push(rentalLink);
    rentalLink.children.push(rentalpaymentLink);
    rentalLink.children.push(billpaymentLink);

    this.linkItems.push(reportLink);


  }

  changeTheme(e): void{
    if (e.checked){
      ThemeManager.setDark(true);
      this.isDark = true;
    }else{
      ThemeManager.setDark(false);
      this.isDark = false;
    }
  }

  ngOnDestroy(): void {
    this.isLive = false;
  }
}
