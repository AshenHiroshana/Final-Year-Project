import {User} from './user';
import {Branch} from './branch';
import {Department} from './department';
import {DataPage} from '../shared/data-page';
import {Branchrolestatus} from './branchrolestatus';

export class Branchrole {
  id: number;
  code: string;
  branch: Branch;
  name: string;
  min: number;
  max: number;
  branchrolestatus: Branchrolestatus;
  allowance: number;
  department: Department;
  creator: User;
  tocreation: string;
}

export class BranchroleDataPage extends DataPage{
    content: Branchrole[];
}
