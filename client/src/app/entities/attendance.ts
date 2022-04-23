import {User} from './user';
import {Branch} from './branch';
import {Employee} from './employee';
import {DataPage} from '../shared/data-page';

export class Attendance {
  id: number;
  code: string;
  branch: Branch;
  employee: Employee;
  date: string;
  intime: string;
  outtime: string;
  creator: User;
  tocreation: string;
}

export class AttendanceDataPage extends DataPage{
    content: Attendance[];
}
