import {User} from './user';
import {Branch} from './branch';
import {Employee} from './employee';
import {Branchrole} from './branchrole';
import {DataPage} from '../shared/data-page';
import {Branchroleassignmentstatus} from './branchroleassignmentstatus';

export class Branchroleassignment {
  id: number;
  code: string;
  branch: Branch;
  branchrole: Branchrole;
  employee: Employee;
  dogrant: string;
  dorevoke: string;
  branchroleassignmentstatus: Branchroleassignmentstatus;
  allowance: number;
  creator: User;
  tocreation: string;
}

export class BranchroleassignmentDataPage extends DataPage{
    content: Branchroleassignment[];
}
