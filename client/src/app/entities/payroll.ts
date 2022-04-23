import {User} from './user';
import {Employee} from './employee';
import {Appointment} from './appointment';
import {DataPage} from '../shared/data-page';
import {Payrolladdition} from './payrolladdition';
import {Payrolldeduction} from './payrolldeduction';

export class Payroll {
  id: number;
  code: string;
  employee: Employee;
  appointment: Appointment;
  basicsalary: number;
  epfamount: number;
  netsalary: number;
  paydate: string;
  bankaccountno: string;
  bankname: string;
  bankbranch: string;
  alowances: number;
  payrolladditionList: Payrolladdition[];
  payrolldeductionList: Payrolldeduction[];
  description: string;
  creator: User;
  tocreation: string;
}

export class PayrollDataPage extends DataPage{
    content: Payroll[];
}
