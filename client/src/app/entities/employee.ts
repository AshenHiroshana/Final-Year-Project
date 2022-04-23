import {User} from './user';
import {Gender} from './gender';
import {Branch} from './branch';
import {Nametitle} from './nametitle';
import {Civilstatus} from './civilstatus';
import {DataPage} from '../shared/data-page';
import {Employeestatus} from './employeestatus';
import {Workexperience} from './workexperience';
import {Educationqualification} from './educationqualification';

export class Employee {
  id: number;
  code: string;
  nametitle: Nametitle;
  callingname: string;
  fullname: string;
  photo: string;
  gender: Gender;
  civilstatus: Civilstatus;
  employeestatus: Employeestatus;
  dobirth: string;
  nic: string;
  address: string;
  mobile: string;
  land: string;
  email: string;
  dorecruit: string;
  branchList: Branch[];
  educationqualificationList: Educationqualification[];
  workexperienceList: Workexperience[];
  epfno: string;
  doresigned: string;
  bankaccountno: string;
  bankname: string;
  bankbranch: string;
  description: string;
  creator: User;
  tocreation: string;
}

export class EmployeeDataPage extends DataPage{
    content: Employee[];
}
