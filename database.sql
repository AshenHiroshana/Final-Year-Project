-- drop database if exist
DROP DATABASE IF EXISTS `eucadmin`;


-- create new database
CREATE DATABASE `eucadmin`;
USE `eucadmin`;


-- set max allowed packet size
set global max_allowed_packet = 64000000;


-- table definitions
CREATE TABLE `allocationstatus`(
    `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(10) NULL
);

CREATE TABLE `appointmentstatus`(
    `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(25) NULL
);

CREATE TABLE `billpaymenttype`(
    `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(20) NULL
);

CREATE TABLE `branchroleassignmentstatus`(
    `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(25) NULL
);

CREATE TABLE `branchrolestatus`(
    `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(15) NULL
);

CREATE TABLE `branchsectionstatus`(
    `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(25) NULL
);

CREATE TABLE `branchsectiontype`(
    `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(25) NULL
);

CREATE TABLE `branchstatus`(
    `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(45) NULL
);

CREATE TABLE `buyingcondition`(
    `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(25) NULL
);

CREATE TABLE `civilstatus`(
    `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(20) NULL
);

CREATE TABLE `consumedistributionstatus`(
    `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(10) NULL
);

CREATE TABLE `consumeitemcategory`(
    `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(25) NULL
);

CREATE TABLE `department`(
    `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(25) NULL
);

CREATE TABLE `employeestatus`(
    `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(12) NULL
);

CREATE TABLE `gender`(
    `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(10) NULL
);

CREATE TABLE `materialstatus`(
    `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(25) NULL
);

CREATE TABLE `materialtype`(
    `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(10) NULL
);

CREATE TABLE `nametitle`(
    `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(10) NULL
);

CREATE TABLE `paymentstatus`(
    `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(10) NULL
);

CREATE TABLE `paymenttype`(
    `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(10) NULL
);

CREATE TABLE `printorderstatus`(
    `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(20) NULL
);

CREATE TABLE `printstatus`(
    `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(15) NULL
);

CREATE TABLE `procurementitemstatus`(
    `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(25) NULL
);

CREATE TABLE `rentalstatus`(
    `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(20) NULL
);

CREATE TABLE `servicestatus`(
    `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(25) NULL
);

CREATE TABLE `unit`(
    `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(25) NULL
);

CREATE TABLE `vendorstatus`(
    `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(25) NULL
);

CREATE TABLE `vendortype`(
    `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(12) NULL
);

CREATE TABLE `appointmentallowancelist`(
    `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `appointment_id` INT NOT NULL,
    `title` VARCHAR(255) NOT NULL,
    `amount` DECIMAL(10,2) NOT NULL
);

CREATE TABLE `appointment`(
    `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `code` CHAR(8) NOT NULL,
    `designation_id` INT NOT NULL,
    `employee_id` INT NOT NULL,
    `appointmentstatus_id` INT NOT NULL,
    `dogrant` DATE NOT NULL,
    `dorevoke` DATE NULL,
    `description` TEXT NULL,
    `tocreation` DATETIME NULL,
    `creator_id` INT NOT NULL
);

CREATE TABLE `attendance`(
    `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `code` CHAR(8) NOT NULL,
    `branch_id` INT NOT NULL,
    `employee_id` INT NOT NULL,
    `date` DATE NOT NULL,
    `in` TIME NULL,
    `out` TIME NULL,
    `tocreation` DATETIME NULL,
    `creator_id` INT NOT NULL
);

CREATE TABLE `auction`(
    `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `code` CHAR(8) NOT NULL,
    `buyer` VARCHAR(255) NOT NULL,
    `procurementitem_id` INT NOT NULL,
    `amount` DECIMAL(10,2) NOT NULL,
    `date` DATE NOT NULL,
    `description` TEXT NULL,
    `tocreation` DATETIME NULL,
    `creator_id` INT NOT NULL
);

CREATE TABLE `billpayment`(
    `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `code` CHAR(8) NOT NULL,
    `billpaymenttype_id` INT NOT NULL,
    `title` VARCHAR(255) NOT NULL,
    `branch_id` INT NOT NULL,
    `amount` DECIMAL(10,2) NOT NULL,
    `date` DATE NOT NULL,
    `photo` CHAR(36) NOT NULL,
    `description` TEXT NULL,
    `tocreation` DATETIME NULL,
    `creator_id` INT NOT NULL
);

CREATE TABLE `branchbranchplan`(
    `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `branch_id` INT NOT NULL,
    `branchplan` CHAR(36) NOT NULL
);

CREATE TABLE `branch`(
    `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `code` CHAR(8) NOT NULL,
    `city` VARCHAR(45) NOT NULL,
    `primarycontact` CHAR(10) NOT NULL,
    `secondarycontact` CHAR(10) NULL,
    `fax` CHAR(10) NULL,
    `photo` CHAR(36) NOT NULL,
    `maplink` TEXT NOT NULL,
    `email` VARCHAR(255) NULL,
    `branchstatus_id` INT NOT NULL,
    `address` TEXT NOT NULL,
    `description` TEXT NULL,
    `tocreation` DATETIME NULL,
    `creator_id` INT NOT NULL
);

CREATE TABLE `branchrole`(
    `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `code` CHAR(8) NOT NULL,
    `branch_id` INT NOT NULL,
    `name` VARCHAR(255) NOT NULL,
    `min` INT(11) NOT NULL,
    `max` INT(11) NOT NULL,
    `branchrolestatus_id` INT NOT NULL,
    `allowance` DECIMAL(10,2) NULL,
    `department_id` INT NOT NULL,
    `tocreation` DATETIME NULL,
    `creator_id` INT NOT NULL
);

CREATE TABLE `branchroleassignment`(
    `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `code` CHAR(10) NOT NULL,
    `branch_id` INT NOT NULL,
    `branchrole_id` INT NOT NULL,
    `employee_id` INT NOT NULL,
    `dogrant` DATE NOT NULL,
    `dorevoke` DATE NULL,
    `branchroleassignmentstatus_id` INT NOT NULL,
    `allowance` DECIMAL(10,2) NULL,
    `tocreation` DATETIME NULL,
    `creator_id` INT NOT NULL
);

CREATE TABLE `branchsection`(
    `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `code` CHAR(8) NOT NULL,
    `name` VARCHAR(45) NOT NULL,
    `branchsectionstatus_id` INT NOT NULL,
    `branchsectiontype_id` INT NOT NULL,
    `branch_id` INT NOT NULL,
    `photo` CHAR(36) NULL,
    `areaplan` CHAR(36) NULL,
    `description` TEXT NULL,
    `tocreation` DATETIME NULL,
    `creator_id` INT NOT NULL
);

CREATE TABLE `consumedistributionitemlist`(
    `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `consumedistribution_id` INT NOT NULL,
    `consumeitem_id` INT NOT NULL,
    `qty` INT(11) NOT NULL
);

CREATE TABLE `consumedistribution`(
    `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `code` CHAR(8) NOT NULL,
    `branch_id` INT NOT NULL,
    `date` DATE NOT NULL,
    `consumedistributionstatus_id` INT NOT NULL,
    `description` TEXT NULL,
    `tocreation` DATETIME NULL,
    `creator_id` INT NOT NULL
);

CREATE TABLE `consumeitemvendor`(
    `consumeitem_id` INT NOT NULL,
    `vendor_id` INT NOT NULL
);

CREATE TABLE `consumeitem`(
    `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `code` CHAR(8) NOT NULL,
    `consumeitemcategory_id` INT NOT NULL,
    `name` VARCHAR(255) NOT NULL,
    `unit_id` INT NOT NULL,
    `qty` INT(11) NOT NULL,
    `photo` CHAR(36) NULL,
    `description` TEXT NULL,
    `tocreation` DATETIME NULL,
    `creator_id` INT NOT NULL
);

CREATE TABLE `consumeitempayment`(
    `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `code` CHAR(10) NOT NULL,
    `consumeitempurchase_id` INT NOT NULL,
    `date` DATE NOT NULL,
    `amount` DECIMAL(10,2) NOT NULL,
    `paymentstatus_id` INT NOT NULL,
    `paymenttype_id` INT NOT NULL,
    `chequeno` VARCHAR(45) ,
    `chequedate` DATE ,
    `chequebank` VARCHAR(45) ,
    `chequebranch` VARCHAR(45) ,
    `description` TEXT NULL,
    `tocreation` DATETIME NULL,
    `creator_id` INT NOT NULL
);

CREATE TABLE `consumeitempurchaseconsumeitemlist`(
    `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `consumeitempurchase_id` INT NOT NULL,
    `qty` INT(11) NOT NULL,
    `unitprice` DECIMAL(10,2) NOT NULL,
    `consumeitem_id` INT NOT NULL,
    `linetotal` DECIMAL(10,2) NOT NULL
);

CREATE TABLE `consumeitempurchase`(
    `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `code` CHAR(8) NOT NULL,
    `vendor_id` INT NOT NULL,
    `date` DATE NOT NULL,
    `total` DECIMAL(10,2) NOT NULL,
    `balance` DECIMAL(10,2) NOT NULL,
    `invoice` CHAR(36) NULL,
    `description` TEXT NULL,
    `tocreation` DATETIME NULL,
    `creator_id` INT NOT NULL
);

CREATE TABLE `designation`(
    `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `code` CHAR(8) NOT NULL,
    `name` VARCHAR(255) NOT NULL,
    `department_id` INT NOT NULL,
    `basicsalary` DECIMAL(10,2) NOT NULL,
    `tocreation` DATETIME NULL,
    `creator_id` INT NOT NULL
);

CREATE TABLE `employeebranch`(
    `employee_id` INT NOT NULL,
    `branch_id` INT NOT NULL
);

CREATE TABLE `educationqualificationlist`(
    `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `employee_id` INT NOT NULL,
    `title` VARCHAR(255) NOT NULL,
    `description` TEXT NULL,
    `file` CHAR(36) NULL
);

CREATE TABLE `workexperiencelist`(
    `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `employee_id` INT NOT NULL,
    `title` VARCHAR(255) NOT NULL,
    `description` TEXT NULL,
    `file` CHAR(36) NULL
);

CREATE TABLE `employee`(
    `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `code` CHAR(8) NOT NULL,
    `nametitle_id` INT NOT NULL,
    `callingname` VARCHAR(255) NOT NULL,
    `fullname` VARCHAR(255) NOT NULL,
    `photo` CHAR(36) NOT NULL,
    `gender_id` INT NOT NULL,
    `civilstatus_id` INT NOT NULL,
    `employeestatus_id` INT NOT NULL,
    `dobirth` DATE NOT NULL,
    `nic` VARCHAR(12) NOT NULL,
    `address` TEXT NOT NULL,
    `mobile` VARCHAR(10) NOT NULL,
    `land` VARCHAR(10) NULL,
    `email` VARCHAR(255) NULL,
    `dorecruit` DATE NOT NULL,
    `epfno` VARCHAR(255) NULL,
    `doresigned` DATE NULL,
    `bankaccountno` VARCHAR(255) NULL,
    `bankname` VARCHAR(255) NULL,
    `bankbranch` VARCHAR(255) NULL,
    `description` TEXT NULL,
    `tocreation` DATETIME NULL,
    `creator_id` INT NOT NULL
);

CREATE TABLE `material`(
    `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `code` CHAR(8) NOT NULL,
    `name` VARCHAR(255) NOT NULL,
    `pagecount` INT(11) NOT NULL,
    `materialtype_id` INT NOT NULL,
    `materialstatus_id` INT NOT NULL,
    `file` CHAR(36) NOT NULL,
    `tocreation` DATETIME NULL,
    `creator_id` INT NOT NULL
);

CREATE TABLE `payrolladditionlist`(
    `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `payroll_id` INT NOT NULL,
    `title` VARCHAR(255) NOT NULL,
    `amount` DECIMAL(10,2) NOT NULL
);

CREATE TABLE `payrolldeductionlist`(
    `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `payroll_id` INT NOT NULL,
    `title` VARCHAR(255) NOT NULL,
    `amount` DECIMAL(10,2) NOT NULL
);

CREATE TABLE `payroll`(
    `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `code` CHAR(8) NOT NULL,
    `employee_id` INT NOT NULL,
    `appointment_id` INT NOT NULL,
    `basicsalary` DECIMAL(10,2) NOT NULL,
    `epfamount` DECIMAL(10,2) NOT NULL,
    `netsalary` DECIMAL(10,2) NOT NULL,
    `paydate` DATE NOT NULL,
    `month` DATE NOT NULL,
    `bankaccountno` VARCHAR(255) NOT NULL,
    `bankname` VARCHAR(255) NOT NULL,
    `bankbranch` VARCHAR(255) NOT NULL,
    `description` TEXT NULL,
    `tocreation` DATETIME NULL,
    `creator_id` INT NOT NULL
);

CREATE TABLE `print`(
    `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `code` CHAR(8) NOT NULL,
    `printorder_id` INT NOT NULL,
    `sdate` DATE NOT NULL,
    `edate` DATE NULL,
    `printstatus_id` INT NOT NULL,
    `tocreation` DATETIME NULL,
    `creator_id` INT NOT NULL
);

CREATE TABLE `printorder`(
    `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `code` CHAR(8) NOT NULL,
    `branch_id` INT NOT NULL,
    `material_id` INT NOT NULL,
    `qty` INT(11) NOT NULL,
    `ordereddate` DATE NOT NULL,
    `requireddate` DATE NOT NULL,
    `receiveddate` DATE NULL,
    `printorderstatus_id` INT NOT NULL,
    `tocreation` DATETIME NULL,
    `creator_id` INT NOT NULL
);

CREATE TABLE `procurementallocationprocurementitemlist`(
    `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `procurementallocation_id` INT NOT NULL,
    `dodeallocate` DATE NOT NULL,
    `procurementitem_id` INT NOT NULL,
    `allocationstatus_id` INT NOT NULL
);

CREATE TABLE `procurementallocation`(
    `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `code` CHAR(8) NOT NULL,
    `branchsection_id` INT NOT NULL,
    `doallocated` DATE NOT NULL,
    `description` TEXT NULL,
    `tocreation` DATETIME NULL,
    `creator_id` INT NOT NULL
);

CREATE TABLE `procurementitem`(
    `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `code` CHAR(8) NOT NULL,
    `vendor_id` INT NULL,
    `procurementitemtype_id` INT NOT NULL,
    `procurementitempurchase_id` INT NULL,
    `buyingcondition_id` INT NOT NULL,
    `itemphoto` CHAR(36) NULL,
    `price` DECIMAL(10,2) NULL,
    `dopurchased` DATE NULL,
    `procurementitemstatus_id` INT NOT NULL,
    `warrantyphoto` CHAR(36) NULL,
    `invoice` CHAR(36) NULL,
    `warrantyenddate` DATE NULL,
    `nooffreeservices` INT(11) NULL,
    `brand` VARCHAR(45) NULL,
    `description` TEXT NULL,
    `tocreation` DATETIME NULL,
    `creator_id` INT NOT NULL
);

CREATE TABLE `procurementitempurchase`(
    `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `code` CHAR(8) NOT NULL,
    `vendor_id` INT NOT NULL,
    `date` DATE NOT NULL,
    `total` DECIMAL(10,2) NOT NULL,
    `balance` DECIMAL(10,2) NOT NULL,
    `invoice` CHAR(36) NULL,
    `description` TEXT NULL,
    `tocreation` DATETIME NULL,
    `creator_id` INT NOT NULL
);

CREATE TABLE `procurementitemtypevendor`(
    `procurementitemtype_id` INT NOT NULL,
    `vendor_id` INT NOT NULL
);

CREATE TABLE `procurementitemtype`(
    `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `code` CHAR(8) NOT NULL,
    `name` VARCHAR(255) NOT NULL,
    `description` TEXT NULL,
    `tocreation` DATETIME NULL,
    `creator_id` INT NOT NULL
);

CREATE TABLE `procurementpayment`(
    `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `code` CHAR(8) NOT NULL,
    `procurementitempurchase_id` INT NOT NULL,
    `date` DATE NOT NULL,
    `amount` DECIMAL(10,2) NOT NULL,
    `paymentstatus_id` INT NOT NULL,
    `paymenttype_id` INT NOT NULL,
    `chequeno` VARCHAR(45) ,
    `chequedate` DATE ,
    `chequebank` VARCHAR(45) ,
    `chequebranch` VARCHAR(45) ,
    `description` TEXT NULL,
    `tocreation` DATETIME NULL,
    `creator_id` INT NOT NULL
);

CREATE TABLE `procurementrefundprocurementitem`(
    `procurementrefund_id` INT NOT NULL,
    `procurementitem_id` INT NOT NULL
);

CREATE TABLE `procurementrefund`(
    `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `code` CHAR(8) NOT NULL,
    `procurementitempurchase_id` INT NOT NULL,
    `date` DATE NOT NULL,
    `amount` DECIMAL(10,2) NOT NULL,
    `paymentstatus_id` INT NOT NULL,
    `paymenttype_id` INT NOT NULL,
    `chequeno` VARCHAR(45) ,
    `chequedate` DATE ,
    `chequebank` VARCHAR(45) ,
    `chequebranch` VARCHAR(45) ,
    `description` TEXT NULL,
    `tocreation` DATETIME NULL,
    `creator_id` INT NOT NULL
);

CREATE TABLE `rental`(
    `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `code` CHAR(8) NOT NULL,
    `branch_id` INT NOT NULL,
    `name` VARCHAR(255) NOT NULL,
    `date` DATE NOT NULL,
    `amount` DECIMAL(10,2) NOT NULL,
    `rentalstatus_id` INT NOT NULL,
    `description` TEXT NULL,
    `tocreation` DATETIME NULL,
    `creator_id` INT NOT NULL
);

CREATE TABLE `rentalpayment`(
    `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `code` CHAR(8) NOT NULL,
    `rental_id` INT NOT NULL,
    `date` DATE NOT NULL,
    `amount` DECIMAL(10,2) NOT NULL,
    `paymentstatus_id` INT NOT NULL,
    `paymenttype_id` INT NOT NULL,
    `chequeno` VARCHAR(45) ,
    `chequedate` DATE ,
    `chequebank` VARCHAR(45) ,
    `chequebranch` VARCHAR(45) ,
    `description` TEXT NULL,
    `tocreation` DATETIME NULL,
    `creator_id` INT NOT NULL
);

CREATE TABLE `serviceprocurementitemlist`(
    `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `service_id` INT NOT NULL,
    `amount` DECIMAL(10,2) NOT NULL,
    `procurementitem_id` INT NULL
);

CREATE TABLE `service`(
    `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `code` CHAR(8) NOT NULL,
    `branch_id` INT NOT NULL,
    `vendor_id` INT NOT NULL,
    `servicetype_id` INT NOT NULL,
    `sdate` DATE NOT NULL,
    `title` VARCHAR(255) NOT NULL,
    `total` DECIMAL(10,2) NOT NULL,
    `balance` DECIMAL(10,2) NOT NULL,
    `edate` DATE NULL,
    `servicestatus_id` INT NOT NULL,
    `invoice` CHAR(36) NULL,
    `description` TEXT NULL,
    `tocreation` DATETIME NULL,
    `creator_id` INT NOT NULL
);

CREATE TABLE `servicepayment`(
    `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `code` CHAR(10) NOT NULL,
    `service_id` INT NOT NULL,
    `date` DATE NOT NULL,
    `amount` DECIMAL(10,2) NOT NULL,
    `paymentstatus_id` INT NOT NULL,
    `paymenttype_id` INT NOT NULL,
    `chequeno` VARCHAR(45) ,
    `chequedate` DATE ,
    `chequebank` VARCHAR(45) ,
    `chequebranch` VARCHAR(45) ,
    `description` TEXT NULL,
    `tocreation` DATETIME NULL,
    `creator_id` INT NOT NULL
);

CREATE TABLE `servicerefund`(
    `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `code` CHAR(10) NOT NULL,
    `service_id` INT NOT NULL,
    `date` DATE NOT NULL,
    `amount` DECIMAL(10,2) NOT NULL,
    `paymentstatus_id` INT NOT NULL,
    `paymenttype_id` INT NOT NULL,
    `chequeno` VARCHAR(45) ,
    `chequedate` DATE ,
    `chequebank` VARCHAR(45) ,
    `chequebranch` VARCHAR(45) ,
    `description` TEXT NULL,
    `tocreation` DATETIME NULL,
    `creator_id` INT NOT NULL
);

CREATE TABLE `servicetypevendor`(
    `servicetype_id` INT NOT NULL,
    `vendor_id` INT NOT NULL
);

CREATE TABLE `servicetype`(
    `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `code` CHAR(8) NOT NULL,
    `name` VARCHAR(255) NOT NULL,
    `description` TEXT NULL,
    `tocreation` DATETIME NULL,
    `creator_id` INT NOT NULL
);

CREATE TABLE `vendor`(
    `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `code` CHAR(8) NOT NULL,
    `name` VARCHAR(255) NOT NULL,
    `email` VARCHAR(255) NULL,
    `primarycontact` CHAR(10) NOT NULL,
    `secondarycontact` CHAR(10) NULL,
    `fax` CHAR(10) NULL,
    `vendortype_id` INT NOT NULL,
    `vendorstatus_id` INT NOT NULL,
    `starrate` DECIMAL(10,2) NULL,
    `address` TEXT NOT NULL,
    `description` TEXT NULL,
    `tocreation` DATETIME NULL,
    `creator_id` INT NOT NULL
);

CREATE TABLE `user`(
    `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `username` VARCHAR(50) NOT NULL,
    `password` VARCHAR(255) NOT NULL,
    `status` VARCHAR(20) NOT NULL,
    `tocreation` DATETIME NULL,
    `tolocked` DATETIME NULL,
    `failedattempts` INT NULL DEFAULT 0,
    `creator_id` INT NULL,
    `photo` CHAR(36) NULL,
    `employee_id` INT NULL
);

CREATE TABLE `userrole`(
    `user_id` INT NOT NULL,
    `role_id` INT NOT NULL
);

CREATE TABLE `role`(
    `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(100) NOT NULL,
    `tocreation` DATETIME NULL,
    `creator_id` INT NOT NULL
);

CREATE TABLE `systemmodule`(
    `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(255) NOT NULL
);

CREATE TABLE `usecase`(
    `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `task` VARCHAR(255) NOT NULL,
    `systemmodule_id` INT NOT NULL
);

CREATE TABLE `roleusecase`(
    `role_id` INT NOT NULL,
    `usecase_id` INT NOT NULL
);

CREATE TABLE `notification`(
    `id` CHAR(36) NOT NULL,
    `dosend` DATETIME NOT NULL,
    `dodelivered` DATETIME NULL,
    `doread` DATETIME NULL,
    `message` TEXT NOT NULL,
    `user_id` INT NOT NULL
);

CREATE TABLE `token`(
    `id` CHAR(36) NOT NULL,
    `tocreation` DATETIME NULL,
    `toexpiration` DATETIME NULL,
    `ip` VARCHAR(100) NULL,
    `status` VARCHAR(20) NULL,
    `user_id` INT NOT NULL
);

CREATE TABLE `servicelog`(
    `id` CHAR(36) NOT NULL,
    `method` VARCHAR(10) NULL,
    `responsecode` INT NULL,
    `ip` VARCHAR(100) NULL,
    `torequest` DATETIME NULL,
    `url` TEXT NULL,
    `handler` VARCHAR(255) NULL,
    `token_id` CHAR(36) NULL
);

CREATE TABLE `file`(
    `id` CHAR(36) NOT NULL,
    `file` MEDIUMBLOB NULL,
    `thumbnail` MEDIUMBLOB NULL,
    `filemimetype` VARCHAR(255) NULL,
    `thumbnailmimetype` VARCHAR(255) NULL,
    `filesize` INT NULL,
    `originalname` VARCHAR(255) NULL,
    `tocreation` DATETIME NULL,
    `isused` TINYINT NULL DEFAULT 0
);



-- primary key definitions
ALTER TABLE `consumeitemvendor` ADD CONSTRAINT pk_consumeitemvendor PRIMARY KEY (`consumeitem_id`,`vendor_id`);
ALTER TABLE `employeebranch` ADD CONSTRAINT pk_employeebranch PRIMARY KEY (`employee_id`,`branch_id`);
ALTER TABLE `procurementitemtypevendor` ADD CONSTRAINT pk_procurementitemtypevendor PRIMARY KEY (`procurementitemtype_id`,`vendor_id`);
ALTER TABLE `procurementrefundprocurementitem` ADD CONSTRAINT pk_procurementrefundprocurementitem PRIMARY KEY (`procurementrefund_id`,`procurementitem_id`);
ALTER TABLE `servicetypevendor` ADD CONSTRAINT pk_servicetypevendor PRIMARY KEY (`servicetype_id`,`vendor_id`);
ALTER TABLE `userrole` ADD CONSTRAINT pk_userrole PRIMARY KEY (`user_id`,`role_id`);
ALTER TABLE `roleusecase` ADD CONSTRAINT pk_roleusecase PRIMARY KEY (`role_id`,`usecase_id`);
ALTER TABLE `notification` ADD CONSTRAINT pk_notification PRIMARY KEY (`id`);
ALTER TABLE `token` ADD CONSTRAINT pk_token PRIMARY KEY (`id`);
ALTER TABLE `servicelog` ADD CONSTRAINT pk_servicelog PRIMARY KEY (`id`);
ALTER TABLE `file` ADD CONSTRAINT pk_file PRIMARY KEY (`id`);


-- unique key definitions
ALTER TABLE `appointment` ADD CONSTRAINT unique_appointment_code UNIQUE (`code`);
ALTER TABLE `attendance` ADD CONSTRAINT unique_attendance_code UNIQUE (`code`);
ALTER TABLE `auction` ADD CONSTRAINT unique_auction_code UNIQUE (`code`);
ALTER TABLE `billpayment` ADD CONSTRAINT unique_billpayment_code UNIQUE (`code`);
ALTER TABLE `branch` ADD CONSTRAINT unique_branch_code UNIQUE (`code`);
ALTER TABLE `branch` ADD CONSTRAINT unique_branch_primarycontact UNIQUE (`primarycontact`);
ALTER TABLE `branch` ADD CONSTRAINT unique_branch_fax UNIQUE (`fax`);
ALTER TABLE `branch` ADD CONSTRAINT unique_branch_email UNIQUE (`email`);
ALTER TABLE `branchrole` ADD CONSTRAINT unique_branchrole_code UNIQUE (`code`);
ALTER TABLE `branchroleassignment` ADD CONSTRAINT unique_branchroleassignment_code UNIQUE (`code`);
ALTER TABLE `branchsection` ADD CONSTRAINT unique_branchsection_code UNIQUE (`code`);
ALTER TABLE `consumedistribution` ADD CONSTRAINT unique_consumedistribution_code UNIQUE (`code`);
ALTER TABLE `consumeitem` ADD CONSTRAINT unique_consumeitem_code UNIQUE (`code`);
ALTER TABLE `consumeitempayment` ADD CONSTRAINT unique_consumeitempayment_code UNIQUE (`code`);
ALTER TABLE `consumeitempurchase` ADD CONSTRAINT unique_consumeitempurchase_code UNIQUE (`code`);
ALTER TABLE `designation` ADD CONSTRAINT unique_designation_code UNIQUE (`code`);
ALTER TABLE `employee` ADD CONSTRAINT unique_employee_code UNIQUE (`code`);
ALTER TABLE `employee` ADD CONSTRAINT unique_employee_nic UNIQUE (`nic`);
ALTER TABLE `employee` ADD CONSTRAINT unique_employee_mobile UNIQUE (`mobile`);
ALTER TABLE `employee` ADD CONSTRAINT unique_employee_email UNIQUE (`email`);
ALTER TABLE `material` ADD CONSTRAINT unique_material_code UNIQUE (`code`);
ALTER TABLE `payroll` ADD CONSTRAINT unique_payroll_code UNIQUE (`code`);
ALTER TABLE `print` ADD CONSTRAINT unique_print_code UNIQUE (`code`);
ALTER TABLE `printorder` ADD CONSTRAINT unique_printorder_code UNIQUE (`code`);
ALTER TABLE `procurementallocation` ADD CONSTRAINT unique_procurementallocation_code UNIQUE (`code`);
ALTER TABLE `procurementitem` ADD CONSTRAINT unique_procurementitem_code UNIQUE (`code`);
ALTER TABLE `procurementitempurchase` ADD CONSTRAINT unique_procurementitempurchase_code UNIQUE (`code`);
ALTER TABLE `procurementitemtype` ADD CONSTRAINT unique_procurementitemtype_code UNIQUE (`code`);
ALTER TABLE `procurementpayment` ADD CONSTRAINT unique_procurementpayment_code UNIQUE (`code`);
ALTER TABLE `procurementrefund` ADD CONSTRAINT unique_procurementrefund_code UNIQUE (`code`);
ALTER TABLE `rental` ADD CONSTRAINT unique_rental_code UNIQUE (`code`);
ALTER TABLE `rentalpayment` ADD CONSTRAINT unique_rentalpayment_code UNIQUE (`code`);
ALTER TABLE `service` ADD CONSTRAINT unique_service_code UNIQUE (`code`);
ALTER TABLE `servicepayment` ADD CONSTRAINT unique_servicepayment_code UNIQUE (`code`);
ALTER TABLE `servicerefund` ADD CONSTRAINT unique_servicerefund_code UNIQUE (`code`);
ALTER TABLE `servicetype` ADD CONSTRAINT unique_servicetype_code UNIQUE (`code`);
ALTER TABLE `vendor` ADD CONSTRAINT unique_vendor_code UNIQUE (`code`);
ALTER TABLE `vendor` ADD CONSTRAINT unique_vendor_email UNIQUE (`email`);
ALTER TABLE `vendor` ADD CONSTRAINT unique_vendor_primarycontact UNIQUE (`primarycontact`);
ALTER TABLE `vendor` ADD CONSTRAINT unique_vendor_fax UNIQUE (`fax`);
ALTER TABLE `user` ADD CONSTRAINT unique_user_employee_id UNIQUE (`employee_id`);
ALTER TABLE `user` ADD CONSTRAINT unique_user_username UNIQUE (`username`);
ALTER TABLE `role` ADD CONSTRAINT unique_role_name UNIQUE (`name`);


-- foreign key definitions
ALTER TABLE `appointment` ADD CONSTRAINT f_appointment_designation_id_fr_designation_id FOREIGN KEY (`designation_id`) REFERENCES `designation`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `appointment` ADD CONSTRAINT f_appointment_employee_id_fr_employee_id FOREIGN KEY (`employee_id`) REFERENCES `employee`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `appointment` ADD CONSTRAINT f_appointment_appointmentstatus_id_fr_appointmentstatus_id FOREIGN KEY (`appointmentstatus_id`) REFERENCES `appointmentstatus`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `appointmentallowancelist` ADD CONSTRAINT f_appointmentallowancelist_appointment_id_fr_appointment_id FOREIGN KEY (`appointment_id`) REFERENCES `appointment`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `appointment` ADD CONSTRAINT f_appointment_creator_id_fr_user_id FOREIGN KEY (`creator_id`) REFERENCES `user`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `attendance` ADD CONSTRAINT f_attendance_branch_id_fr_branch_id FOREIGN KEY (`branch_id`) REFERENCES `branch`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `attendance` ADD CONSTRAINT f_attendance_employee_id_fr_employee_id FOREIGN KEY (`employee_id`) REFERENCES `employee`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `attendance` ADD CONSTRAINT f_attendance_creator_id_fr_user_id FOREIGN KEY (`creator_id`) REFERENCES `user`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `auction` ADD CONSTRAINT f_auction_procurementitem_id_fr_procurementitem_id FOREIGN KEY (`procurementitem_id`) REFERENCES `procurementitem`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `auction` ADD CONSTRAINT f_auction_creator_id_fr_user_id FOREIGN KEY (`creator_id`) REFERENCES `user`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `billpayment` ADD CONSTRAINT f_billpayment_billpaymenttype_id_fr_billpaymenttype_id FOREIGN KEY (`billpaymenttype_id`) REFERENCES `billpaymenttype`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `billpayment` ADD CONSTRAINT f_billpayment_branch_id_fr_branch_id FOREIGN KEY (`branch_id`) REFERENCES `branch`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `billpayment` ADD CONSTRAINT f_billpayment_creator_id_fr_user_id FOREIGN KEY (`creator_id`) REFERENCES `user`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `branch` ADD CONSTRAINT f_branch_branchstatus_id_fr_branchstatus_id FOREIGN KEY (`branchstatus_id`) REFERENCES `branchstatus`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `branchbranchplan` ADD CONSTRAINT f_branchbranchplan_branch_id_fr_branch_id FOREIGN KEY (`branch_id`) REFERENCES `branch`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `branch` ADD CONSTRAINT f_branch_creator_id_fr_user_id FOREIGN KEY (`creator_id`) REFERENCES `user`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `branchrole` ADD CONSTRAINT f_branchrole_branch_id_fr_branch_id FOREIGN KEY (`branch_id`) REFERENCES `branch`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `branchrole` ADD CONSTRAINT f_branchrole_branchrolestatus_id_fr_branchrolestatus_id FOREIGN KEY (`branchrolestatus_id`) REFERENCES `branchrolestatus`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `branchrole` ADD CONSTRAINT f_branchrole_department_id_fr_department_id FOREIGN KEY (`department_id`) REFERENCES `department`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `branchrole` ADD CONSTRAINT f_branchrole_creator_id_fr_user_id FOREIGN KEY (`creator_id`) REFERENCES `user`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `branchroleassignment` ADD CONSTRAINT f_branchroleassignment_branch_id_fr_branch_id FOREIGN KEY (`branch_id`) REFERENCES `branch`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `branchroleassignment` ADD CONSTRAINT f_branchroleassignment_branchrole_id_fr_branchrole_id FOREIGN KEY (`branchrole_id`) REFERENCES `branchrole`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `branchroleassignment` ADD CONSTRAINT f_branchroleassignment_employee_id_fr_employee_id FOREIGN KEY (`employee_id`) REFERENCES `employee`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `branchroleassignment` ADD CONSTRAINT f_branchroleassignment_branchroleassignmentstatus_id_fr_branchr FOREIGN KEY (`branchroleassignmentstatus_id`) REFERENCES `branchroleassignmentstatus`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `branchroleassignment` ADD CONSTRAINT f_branchroleassignment_creator_id_fr_user_id FOREIGN KEY (`creator_id`) REFERENCES `user`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `branchsection` ADD CONSTRAINT f_branchsection_branchsectionstatus_id_fr_branchsectionstatus_id FOREIGN KEY (`branchsectionstatus_id`) REFERENCES `branchsectionstatus`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `branchsection` ADD CONSTRAINT f_branchsection_branchsectiontype_id_fr_branchsectiontype_id FOREIGN KEY (`branchsectiontype_id`) REFERENCES `branchsectiontype`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `branchsection` ADD CONSTRAINT f_branchsection_branch_id_fr_branch_id FOREIGN KEY (`branch_id`) REFERENCES `branch`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `branchsection` ADD CONSTRAINT f_branchsection_creator_id_fr_user_id FOREIGN KEY (`creator_id`) REFERENCES `user`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `consumedistribution` ADD CONSTRAINT f_consumedistribution_branch_id_fr_branch_id FOREIGN KEY (`branch_id`) REFERENCES `branch`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `consumedistribution` ADD CONSTRAINT f_consumedistribution_consumedistributionstatus_id_fr_consumedi FOREIGN KEY (`consumedistributionstatus_id`) REFERENCES `consumedistributionstatus`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `consumedistributionitemlist` ADD CONSTRAINT f_consumedistributionitemlist_consumeitem_id_fr_consumeitem_id FOREIGN KEY (`consumeitem_id`) REFERENCES `consumeitem`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `consumedistributionitemlist` ADD CONSTRAINT f_consumedistributionitemlist_consumedistribution_id_fr_consume FOREIGN KEY (`consumedistribution_id`) REFERENCES `consumedistribution`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `consumedistribution` ADD CONSTRAINT f_consumedistribution_creator_id_fr_user_id FOREIGN KEY (`creator_id`) REFERENCES `user`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `consumeitem` ADD CONSTRAINT f_consumeitem_consumeitemcategory_id_fr_consumeitemcategory_id FOREIGN KEY (`consumeitemcategory_id`) REFERENCES `consumeitemcategory`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `consumeitem` ADD CONSTRAINT f_consumeitem_unit_id_fr_unit_id FOREIGN KEY (`unit_id`) REFERENCES `unit`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `consumeitemvendor` ADD CONSTRAINT f_consumeitemvendor_consumeitem_id_fr_consumeitem_id FOREIGN KEY (`consumeitem_id`) REFERENCES `consumeitem`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `consumeitemvendor` ADD CONSTRAINT f_consumeitemvendor_vendor_id_fr_vendor_id FOREIGN KEY (`vendor_id`) REFERENCES `vendor`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `consumeitem` ADD CONSTRAINT f_consumeitem_creator_id_fr_user_id FOREIGN KEY (`creator_id`) REFERENCES `user`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `consumeitempayment` ADD CONSTRAINT f_consumeitempayment_consumeitempurchase_id_fr_consumeitempurch FOREIGN KEY (`consumeitempurchase_id`) REFERENCES `consumeitempurchase`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `consumeitempayment` ADD CONSTRAINT f_consumeitempayment_paymentstatus_id_fr_paymentstatus_id FOREIGN KEY (`paymentstatus_id`) REFERENCES `paymentstatus`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `consumeitempayment` ADD CONSTRAINT f_consumeitempayment_paymenttype_id_fr_paymenttype_id FOREIGN KEY (`paymenttype_id`) REFERENCES `paymenttype`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `consumeitempayment` ADD CONSTRAINT f_consumeitempayment_creator_id_fr_user_id FOREIGN KEY (`creator_id`) REFERENCES `user`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `consumeitempurchase` ADD CONSTRAINT f_consumeitempurchase_vendor_id_fr_vendor_id FOREIGN KEY (`vendor_id`) REFERENCES `vendor`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `consumeitempurchaseconsumeitemlist` ADD CONSTRAINT f_consumeitempurchaseconsumeitemlist_consumeitem_id_fr_consumei FOREIGN KEY (`consumeitem_id`) REFERENCES `consumeitem`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `consumeitempurchaseconsumeitemlist` ADD CONSTRAINT f_consumeitempurchaseconsumeitemlist_consumeitempurchase_id_fr_ FOREIGN KEY (`consumeitempurchase_id`) REFERENCES `consumeitempurchase`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `consumeitempurchase` ADD CONSTRAINT f_consumeitempurchase_creator_id_fr_user_id FOREIGN KEY (`creator_id`) REFERENCES `user`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `designation` ADD CONSTRAINT f_designation_department_id_fr_department_id FOREIGN KEY (`department_id`) REFERENCES `department`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `designation` ADD CONSTRAINT f_designation_creator_id_fr_user_id FOREIGN KEY (`creator_id`) REFERENCES `user`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `employee` ADD CONSTRAINT f_employee_nametitle_id_fr_nametitle_id FOREIGN KEY (`nametitle_id`) REFERENCES `nametitle`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `employee` ADD CONSTRAINT f_employee_gender_id_fr_gender_id FOREIGN KEY (`gender_id`) REFERENCES `gender`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `employee` ADD CONSTRAINT f_employee_civilstatus_id_fr_civilstatus_id FOREIGN KEY (`civilstatus_id`) REFERENCES `civilstatus`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `employee` ADD CONSTRAINT f_employee_employeestatus_id_fr_employeestatus_id FOREIGN KEY (`employeestatus_id`) REFERENCES `employeestatus`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `employeebranch` ADD CONSTRAINT f_employeebranch_employee_id_fr_employee_id FOREIGN KEY (`employee_id`) REFERENCES `employee`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `employeebranch` ADD CONSTRAINT f_employeebranch_branch_id_fr_branch_id FOREIGN KEY (`branch_id`) REFERENCES `branch`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `educationqualificationlist` ADD CONSTRAINT f_educationqualificationlist_employee_id_fr_employee_id FOREIGN KEY (`employee_id`) REFERENCES `employee`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `workexperiencelist` ADD CONSTRAINT f_workexperiencelist_employee_id_fr_employee_id FOREIGN KEY (`employee_id`) REFERENCES `employee`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `employee` ADD CONSTRAINT f_employee_creator_id_fr_user_id FOREIGN KEY (`creator_id`) REFERENCES `user`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `material` ADD CONSTRAINT f_material_materialtype_id_fr_materialtype_id FOREIGN KEY (`materialtype_id`) REFERENCES `materialtype`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `material` ADD CONSTRAINT f_material_materialstatus_id_fr_materialstatus_id FOREIGN KEY (`materialstatus_id`) REFERENCES `materialstatus`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `material` ADD CONSTRAINT f_material_creator_id_fr_user_id FOREIGN KEY (`creator_id`) REFERENCES `user`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `payroll` ADD CONSTRAINT f_payroll_employee_id_fr_employee_id FOREIGN KEY (`employee_id`) REFERENCES `employee`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `payroll` ADD CONSTRAINT f_payroll_appointment_id_fr_appointment_id FOREIGN KEY (`appointment_id`) REFERENCES `appointment`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `payrolladditionlist` ADD CONSTRAINT f_payrolladditionlist_payroll_id_fr_payroll_id FOREIGN KEY (`payroll_id`) REFERENCES `payroll`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `payrolldeductionlist` ADD CONSTRAINT f_payrolldeductionlist_payroll_id_fr_payroll_id FOREIGN KEY (`payroll_id`) REFERENCES `payroll`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `payroll` ADD CONSTRAINT f_payroll_creator_id_fr_user_id FOREIGN KEY (`creator_id`) REFERENCES `user`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `print` ADD CONSTRAINT f_print_printorder_id_fr_printorder_id FOREIGN KEY (`printorder_id`) REFERENCES `printorder`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `print` ADD CONSTRAINT f_print_printstatus_id_fr_printstatus_id FOREIGN KEY (`printstatus_id`) REFERENCES `printstatus`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `print` ADD CONSTRAINT f_print_creator_id_fr_user_id FOREIGN KEY (`creator_id`) REFERENCES `user`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `printorder` ADD CONSTRAINT f_printorder_branch_id_fr_branch_id FOREIGN KEY (`branch_id`) REFERENCES `branch`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `printorder` ADD CONSTRAINT f_printorder_material_id_fr_material_id FOREIGN KEY (`material_id`) REFERENCES `material`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `printorder` ADD CONSTRAINT f_printorder_printorderstatus_id_fr_printorderstatus_id FOREIGN KEY (`printorderstatus_id`) REFERENCES `printorderstatus`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `printorder` ADD CONSTRAINT f_printorder_creator_id_fr_user_id FOREIGN KEY (`creator_id`) REFERENCES `user`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `procurementallocation` ADD CONSTRAINT f_procurementallocation_branchsection_id_fr_branchsection_id FOREIGN KEY (`branchsection_id`) REFERENCES `branchsection`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `procurementallocationprocurementitemlist` ADD CONSTRAINT f_procurementallocationprocurementitemlist_procurementitem_id_f FOREIGN KEY (`procurementitem_id`) REFERENCES `procurementitem`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `procurementallocationprocurementitemlist` ADD CONSTRAINT f_procurementallocationprocurementitemlist_allocationstatus_id_ FOREIGN KEY (`allocationstatus_id`) REFERENCES `allocationstatus`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `procurementallocationprocurementitemlist` ADD CONSTRAINT f_procurementallocationprocurementitemlist_procurementallocatio FOREIGN KEY (`procurementallocation_id`) REFERENCES `procurementallocation`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `procurementallocation` ADD CONSTRAINT f_procurementallocation_creator_id_fr_user_id FOREIGN KEY (`creator_id`) REFERENCES `user`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `procurementitem` ADD CONSTRAINT f_procurementitem_vendor_id_fr_vendor_id FOREIGN KEY (`vendor_id`) REFERENCES `vendor`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `procurementitem` ADD CONSTRAINT f_procurementitem_procurementitemtype_id_fr_procurementitemtype FOREIGN KEY (`procurementitemtype_id`) REFERENCES `procurementitemtype`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `procurementitem` ADD CONSTRAINT f_procurementitem_procurementitempurchase_id_fr_procurementitem FOREIGN KEY (`procurementitempurchase_id`) REFERENCES `procurementitempurchase`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `procurementitem` ADD CONSTRAINT f_procurementitem_buyingcondition_id_fr_buyingcondition_id FOREIGN KEY (`buyingcondition_id`) REFERENCES `buyingcondition`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `procurementitem` ADD CONSTRAINT f_procurementitem_procurementitemstatus_id_fr_procurementitemst FOREIGN KEY (`procurementitemstatus_id`) REFERENCES `procurementitemstatus`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `procurementitem` ADD CONSTRAINT f_procurementitem_creator_id_fr_user_id FOREIGN KEY (`creator_id`) REFERENCES `user`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `procurementitempurchase` ADD CONSTRAINT f_procurementitempurchase_vendor_id_fr_vendor_id FOREIGN KEY (`vendor_id`) REFERENCES `vendor`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `procurementitempurchase` ADD CONSTRAINT f_procurementitempurchase_creator_id_fr_user_id FOREIGN KEY (`creator_id`) REFERENCES `user`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `procurementitemtypevendor` ADD CONSTRAINT f_procurementitemtypevendor_procurementitemtype_id_fr_procureme FOREIGN KEY (`procurementitemtype_id`) REFERENCES `procurementitemtype`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `procurementitemtypevendor` ADD CONSTRAINT f_procurementitemtypevendor_vendor_id_fr_vendor_id FOREIGN KEY (`vendor_id`) REFERENCES `vendor`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `procurementitemtype` ADD CONSTRAINT f_procurementitemtype_creator_id_fr_user_id FOREIGN KEY (`creator_id`) REFERENCES `user`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `procurementpayment` ADD CONSTRAINT f_procurementpayment_procurementitempurchase_id_fr_procurementi FOREIGN KEY (`procurementitempurchase_id`) REFERENCES `procurementitempurchase`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `procurementpayment` ADD CONSTRAINT f_procurementpayment_paymentstatus_id_fr_paymentstatus_id FOREIGN KEY (`paymentstatus_id`) REFERENCES `paymentstatus`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `procurementpayment` ADD CONSTRAINT f_procurementpayment_paymenttype_id_fr_paymenttype_id FOREIGN KEY (`paymenttype_id`) REFERENCES `paymenttype`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `procurementpayment` ADD CONSTRAINT f_procurementpayment_creator_id_fr_user_id FOREIGN KEY (`creator_id`) REFERENCES `user`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `procurementrefund` ADD CONSTRAINT f_procurementrefund_procurementitempurchase_id_fr_procurementit FOREIGN KEY (`procurementitempurchase_id`) REFERENCES `procurementitempurchase`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `procurementrefund` ADD CONSTRAINT f_procurementrefund_paymentstatus_id_fr_paymentstatus_id FOREIGN KEY (`paymentstatus_id`) REFERENCES `paymentstatus`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `procurementrefund` ADD CONSTRAINT f_procurementrefund_paymenttype_id_fr_paymenttype_id FOREIGN KEY (`paymenttype_id`) REFERENCES `paymenttype`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `procurementrefundprocurementitem` ADD CONSTRAINT f_procurementrefundprocurementitem_procurementrefund_id_fr_proc FOREIGN KEY (`procurementrefund_id`) REFERENCES `procurementrefund`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `procurementrefundprocurementitem` ADD CONSTRAINT f_procurementrefundprocurementitem_procurementitem_id_fr_procur FOREIGN KEY (`procurementitem_id`) REFERENCES `procurementitem`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `procurementrefund` ADD CONSTRAINT f_procurementrefund_creator_id_fr_user_id FOREIGN KEY (`creator_id`) REFERENCES `user`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `rental` ADD CONSTRAINT f_rental_branch_id_fr_branch_id FOREIGN KEY (`branch_id`) REFERENCES `branch`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `rental` ADD CONSTRAINT f_rental_rentalstatus_id_fr_rentalstatus_id FOREIGN KEY (`rentalstatus_id`) REFERENCES `rentalstatus`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `rental` ADD CONSTRAINT f_rental_creator_id_fr_user_id FOREIGN KEY (`creator_id`) REFERENCES `user`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `rentalpayment` ADD CONSTRAINT f_rentalpayment_rental_id_fr_rental_id FOREIGN KEY (`rental_id`) REFERENCES `rental`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `rentalpayment` ADD CONSTRAINT f_rentalpayment_paymentstatus_id_fr_paymentstatus_id FOREIGN KEY (`paymentstatus_id`) REFERENCES `paymentstatus`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `rentalpayment` ADD CONSTRAINT f_rentalpayment_paymenttype_id_fr_paymenttype_id FOREIGN KEY (`paymenttype_id`) REFERENCES `paymenttype`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `rentalpayment` ADD CONSTRAINT f_rentalpayment_creator_id_fr_user_id FOREIGN KEY (`creator_id`) REFERENCES `user`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `service` ADD CONSTRAINT f_service_branch_id_fr_branch_id FOREIGN KEY (`branch_id`) REFERENCES `branch`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `service` ADD CONSTRAINT f_service_vendor_id_fr_vendor_id FOREIGN KEY (`vendor_id`) REFERENCES `vendor`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `service` ADD CONSTRAINT f_service_servicetype_id_fr_servicetype_id FOREIGN KEY (`servicetype_id`) REFERENCES `servicetype`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `serviceprocurementitemlist` ADD CONSTRAINT f_serviceprocurementitemlist_procurementitem_id_fr_procurementi FOREIGN KEY (`procurementitem_id`) REFERENCES `procurementitem`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `serviceprocurementitemlist` ADD CONSTRAINT f_serviceprocurementitemlist_service_id_fr_service_id FOREIGN KEY (`service_id`) REFERENCES `service`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `service` ADD CONSTRAINT f_service_servicestatus_id_fr_servicestatus_id FOREIGN KEY (`servicestatus_id`) REFERENCES `servicestatus`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `service` ADD CONSTRAINT f_service_creator_id_fr_user_id FOREIGN KEY (`creator_id`) REFERENCES `user`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `servicepayment` ADD CONSTRAINT f_servicepayment_service_id_fr_service_id FOREIGN KEY (`service_id`) REFERENCES `service`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `servicepayment` ADD CONSTRAINT f_servicepayment_paymentstatus_id_fr_paymentstatus_id FOREIGN KEY (`paymentstatus_id`) REFERENCES `paymentstatus`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `servicepayment` ADD CONSTRAINT f_servicepayment_paymenttype_id_fr_paymenttype_id FOREIGN KEY (`paymenttype_id`) REFERENCES `paymenttype`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `servicepayment` ADD CONSTRAINT f_servicepayment_creator_id_fr_user_id FOREIGN KEY (`creator_id`) REFERENCES `user`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `servicerefund` ADD CONSTRAINT f_servicerefund_service_id_fr_service_id FOREIGN KEY (`service_id`) REFERENCES `service`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `servicerefund` ADD CONSTRAINT f_servicerefund_paymentstatus_id_fr_paymentstatus_id FOREIGN KEY (`paymentstatus_id`) REFERENCES `paymentstatus`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `servicerefund` ADD CONSTRAINT f_servicerefund_paymenttype_id_fr_paymenttype_id FOREIGN KEY (`paymenttype_id`) REFERENCES `paymenttype`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `servicerefund` ADD CONSTRAINT f_servicerefund_creator_id_fr_user_id FOREIGN KEY (`creator_id`) REFERENCES `user`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `servicetypevendor` ADD CONSTRAINT f_servicetypevendor_servicetype_id_fr_servicetype_id FOREIGN KEY (`servicetype_id`) REFERENCES `servicetype`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `servicetypevendor` ADD CONSTRAINT f_servicetypevendor_vendor_id_fr_vendor_id FOREIGN KEY (`vendor_id`) REFERENCES `vendor`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `servicetype` ADD CONSTRAINT f_servicetype_creator_id_fr_user_id FOREIGN KEY (`creator_id`) REFERENCES `user`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `vendor` ADD CONSTRAINT f_vendor_vendortype_id_fr_vendortype_id FOREIGN KEY (`vendortype_id`) REFERENCES `vendortype`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `vendor` ADD CONSTRAINT f_vendor_vendorstatus_id_fr_vendorstatus_id FOREIGN KEY (`vendorstatus_id`) REFERENCES `vendorstatus`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `vendor` ADD CONSTRAINT f_vendor_creator_id_fr_user_id FOREIGN KEY (`creator_id`) REFERENCES `user`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `user` ADD CONSTRAINT f_user_employee_id_fr_employee_id FOREIGN KEY (`employee_id`) REFERENCES `employee`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `user` ADD CONSTRAINT f_user_creator_id_fr_user_id FOREIGN KEY (`creator_id`) REFERENCES `user`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `userrole` ADD CONSTRAINT f_userrole_user_id_fr_user_id FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `userrole` ADD CONSTRAINT f_userrole_role_id_fr_role_id FOREIGN KEY (`role_id`) REFERENCES `role`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `role` ADD CONSTRAINT f_role_creator_id_fr_user_id FOREIGN KEY (`creator_id`) REFERENCES `user`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `roleusecase` ADD CONSTRAINT f_roleusecase_role_id_fr_role_id FOREIGN KEY (`role_id`) REFERENCES `role`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `roleusecase` ADD CONSTRAINT f_roleusecase_usecase_id_fr_usecase_id FOREIGN KEY (`usecase_id`) REFERENCES `usecase`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `usecase` ADD CONSTRAINT f_usecase_systemmodule_id_fr_systemmodule_id FOREIGN KEY (`systemmodule_id`) REFERENCES `systemmodule`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `notification` ADD CONSTRAINT f_notification_user_id_fr_user_id FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `token` ADD CONSTRAINT f_token_user_id_fr_user_id FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `servicelog` ADD CONSTRAINT f_servicelog_token_id_fr_token_id FOREIGN KEY (`token_id`) REFERENCES `token`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
