export abstract class UsecaseList {
  public static readonly SHOW_ALL_USERS = 1;
  public static readonly SHOW_USER_DETAILS = 2;
  public static readonly ADD_USER = 3;
  public static readonly UPDATE_USER = 4;
  public static readonly DELETE_USER = 5;
  public static readonly RESET_USER_PASSWORDS = 6;
  public static readonly SHOW_ALL_ROLES = 7;
  public static readonly SHOW_ROLE_DETAILS = 8;
  public static readonly ADD_ROLE = 9;
  public static readonly UPDATE_ROLE = 10;
  public static readonly DELETE_ROLE = 11;
  public static readonly SHOW_ALL_APPOINTMENTS = 12;
  public static readonly SHOW_APPOINTMENT_DETAILS = 13;
  public static readonly ADD_APPOINTMENT = 14;
  public static readonly UPDATE_APPOINTMENT = 15;
  public static readonly DELETE_APPOINTMENT = 16;
  public static readonly SHOW_ALL_ATTENDANCES = 17;
  public static readonly SHOW_ATTENDANCE_DETAILS = 18;
  public static readonly ADD_ATTENDANCE = 19;
  public static readonly UPDATE_ATTENDANCE = 20;
  public static readonly DELETE_ATTENDANCE = 21;
  public static readonly SHOW_ALL_AUCTIONS = 22;
  public static readonly SHOW_AUCTION_DETAILS = 23;
  public static readonly ADD_AUCTION = 24;
  public static readonly UPDATE_AUCTION = 25;
  public static readonly DELETE_AUCTION = 26;
  public static readonly SHOW_ALL_BILLPAYMENTS = 27;
  public static readonly SHOW_BILLPAYMENT_DETAILS = 28;
  public static readonly ADD_BILLPAYMENT = 29;
  public static readonly UPDATE_BILLPAYMENT = 30;
  public static readonly DELETE_BILLPAYMENT = 31;
  public static readonly SHOW_ALL_BRANCHES = 32;
  public static readonly SHOW_BRANCH_DETAILS = 33;
  public static readonly ADD_BRANCH = 34;
  public static readonly UPDATE_BRANCH = 35;
  public static readonly DELETE_BRANCH = 36;
  public static readonly SHOW_ALL_BRANCHROLES = 37;
  public static readonly SHOW_BRANCHROLE_DETAILS = 38;
  public static readonly ADD_BRANCHROLE = 39;
  public static readonly UPDATE_BRANCHROLE = 40;
  public static readonly DELETE_BRANCHROLE = 41;
  public static readonly SHOW_ALL_BRANCHROLEASSIGNMENTS = 42;
  public static readonly SHOW_BRANCHROLEASSIGNMENT_DETAILS = 43;
  public static readonly ADD_BRANCHROLEASSIGNMENT = 44;
  public static readonly UPDATE_BRANCHROLEASSIGNMENT = 45;
  public static readonly DELETE_BRANCHROLEASSIGNMENT = 46;
  public static readonly SHOW_ALL_BRANCHSECTIONS = 47;
  public static readonly SHOW_BRANCHSECTION_DETAILS = 48;
  public static readonly ADD_BRANCHSECTION = 49;
  public static readonly UPDATE_BRANCHSECTION = 50;
  public static readonly DELETE_BRANCHSECTION = 51;
  public static readonly SHOW_ALL_CONSUMEDISTRIBUTIONS = 52;
  public static readonly SHOW_CONSUMEDISTRIBUTION_DETAILS = 53;
  public static readonly ADD_CONSUMEDISTRIBUTION = 54;
  public static readonly UPDATE_CONSUMEDISTRIBUTION = 55;
  public static readonly DELETE_CONSUMEDISTRIBUTION = 56;
  public static readonly SHOW_ALL_CONSUMEITEMS = 57;
  public static readonly SHOW_CONSUMEITEM_DETAILS = 58;
  public static readonly ADD_CONSUMEITEM = 59;
  public static readonly UPDATE_CONSUMEITEM = 60;
  public static readonly DELETE_CONSUMEITEM = 61;
  public static readonly SHOW_ALL_CONSUMEITEMPAYMENTS = 62;
  public static readonly SHOW_CONSUMEITEMPAYMENT_DETAILS = 63;
  public static readonly ADD_CONSUMEITEMPAYMENT = 64;
  public static readonly UPDATE_CONSUMEITEMPAYMENT = 65;
  public static readonly DELETE_CONSUMEITEMPAYMENT = 66;
  public static readonly SHOW_ALL_CONSUMEITEMPURCHASES = 67;
  public static readonly SHOW_CONSUMEITEMPURCHASE_DETAILS = 68;
  public static readonly ADD_CONSUMEITEMPURCHASE = 69;
  public static readonly UPDATE_CONSUMEITEMPURCHASE = 70;
  public static readonly DELETE_CONSUMEITEMPURCHASE = 71;
  public static readonly SHOW_ALL_DESIGNATIONS = 72;
  public static readonly SHOW_DESIGNATION_DETAILS = 73;
  public static readonly ADD_DESIGNATION = 74;
  public static readonly UPDATE_DESIGNATION = 75;
  public static readonly DELETE_DESIGNATION = 76;
  public static readonly SHOW_ALL_EMPLOYEES = 77;
  public static readonly SHOW_EMPLOYEE_DETAILS = 78;
  public static readonly ADD_EMPLOYEE = 79;
  public static readonly UPDATE_EMPLOYEE = 80;
  public static readonly DELETE_EMPLOYEE = 81;
  public static readonly SHOW_ALL_MATERIALS = 82;
  public static readonly SHOW_MATERIAL_DETAILS = 83;
  public static readonly ADD_MATERIAL = 84;
  public static readonly UPDATE_MATERIAL = 85;
  public static readonly DELETE_MATERIAL = 86;
  public static readonly SHOW_ALL_PAYROLLS = 87;
  public static readonly SHOW_PAYROLL_DETAILS = 88;
  public static readonly ADD_PAYROLL = 89;
  public static readonly UPDATE_PAYROLL = 90;
  public static readonly DELETE_PAYROLL = 91;
  public static readonly SHOW_ALL_PRINTS = 92;
  public static readonly SHOW_PRINT_DETAILS = 93;
  public static readonly ADD_PRINT = 94;
  public static readonly UPDATE_PRINT = 95;
  public static readonly DELETE_PRINT = 96;
  public static readonly SHOW_ALL_PRINTORDERS = 97;
  public static readonly SHOW_PRINTORDER_DETAILS = 98;
  public static readonly ADD_PRINTORDER = 99;
  public static readonly UPDATE_PRINTORDER = 100;
  public static readonly DELETE_PRINTORDER = 101;
  public static readonly SHOW_ALL_PROCUREMENTALLOCATIONS = 102;
  public static readonly SHOW_PROCUREMENTALLOCATION_DETAILS = 103;
  public static readonly ADD_PROCUREMENTALLOCATION = 104;
  public static readonly UPDATE_PROCUREMENTALLOCATION = 105;
  public static readonly DELETE_PROCUREMENTALLOCATION = 106;
  public static readonly SHOW_ALL_PROCUREMENTITEMS = 107;
  public static readonly SHOW_PROCUREMENTITEM_DETAILS = 108;
  public static readonly ADD_PROCUREMENTITEM = 109;
  public static readonly UPDATE_PROCUREMENTITEM = 110;
  public static readonly DELETE_PROCUREMENTITEM = 111;
  public static readonly SHOW_ALL_PROCUREMENTITEMPURCHASES = 112;
  public static readonly SHOW_PROCUREMENTITEMPURCHASE_DETAILS = 113;
  public static readonly ADD_PROCUREMENTITEMPURCHASE = 114;
  public static readonly UPDATE_PROCUREMENTITEMPURCHASE = 115;
  public static readonly DELETE_PROCUREMENTITEMPURCHASE = 116;
  public static readonly SHOW_ALL_PROCUREMENTITEMTYPES = 117;
  public static readonly SHOW_PROCUREMENTITEMTYPE_DETAILS = 118;
  public static readonly ADD_PROCUREMENTITEMTYPE = 119;
  public static readonly UPDATE_PROCUREMENTITEMTYPE = 120;
  public static readonly DELETE_PROCUREMENTITEMTYPE = 121;
  public static readonly SHOW_ALL_PROCUREMENTPAYMENTS = 122;
  public static readonly SHOW_PROCUREMENTPAYMENT_DETAILS = 123;
  public static readonly ADD_PROCUREMENTPAYMENT = 124;
  public static readonly UPDATE_PROCUREMENTPAYMENT = 125;
  public static readonly DELETE_PROCUREMENTPAYMENT = 126;
  public static readonly SHOW_ALL_PROCUREMENTREFUNDS = 127;
  public static readonly SHOW_PROCUREMENTREFUND_DETAILS = 128;
  public static readonly ADD_PROCUREMENTREFUND = 129;
  public static readonly UPDATE_PROCUREMENTREFUND = 130;
  public static readonly DELETE_PROCUREMENTREFUND = 131;
  public static readonly SHOW_ALL_RENTALS = 132;
  public static readonly SHOW_RENTAL_DETAILS = 133;
  public static readonly ADD_RENTAL = 134;
  public static readonly UPDATE_RENTAL = 135;
  public static readonly DELETE_RENTAL = 136;
  public static readonly SHOW_ALL_RENTALPAYMENTS = 137;
  public static readonly SHOW_RENTALPAYMENT_DETAILS = 138;
  public static readonly ADD_RENTALPAYMENT = 139;
  public static readonly UPDATE_RENTALPAYMENT = 140;
  public static readonly DELETE_RENTALPAYMENT = 141;
  public static readonly SHOW_ALL_SERVICES = 142;
  public static readonly SHOW_SERVICE_DETAILS = 143;
  public static readonly ADD_SERVICE = 144;
  public static readonly UPDATE_SERVICE = 145;
  public static readonly DELETE_SERVICE = 146;
  public static readonly SHOW_ALL_SERVICEPAYMENTS = 147;
  public static readonly SHOW_SERVICEPAYMENT_DETAILS = 148;
  public static readonly ADD_SERVICEPAYMENT = 149;
  public static readonly UPDATE_SERVICEPAYMENT = 150;
  public static readonly DELETE_SERVICEPAYMENT = 151;
  public static readonly SHOW_ALL_SERVICEREFUNDS = 152;
  public static readonly SHOW_SERVICEREFUND_DETAILS = 153;
  public static readonly ADD_SERVICEREFUND = 154;
  public static readonly UPDATE_SERVICEREFUND = 155;
  public static readonly DELETE_SERVICEREFUND = 156;
  public static readonly SHOW_ALL_SERVICETYPES = 157;
  public static readonly SHOW_SERVICETYPE_DETAILS = 158;
  public static readonly ADD_SERVICETYPE = 159;
  public static readonly UPDATE_SERVICETYPE = 160;
  public static readonly DELETE_SERVICETYPE = 161;
  public static readonly SHOW_ALL_VENDORS = 162;
  public static readonly SHOW_VENDOR_DETAILS = 163;
  public static readonly ADD_VENDOR = 164;
  public static readonly UPDATE_VENDOR = 165;
  public static readonly DELETE_VENDOR = 166;
}