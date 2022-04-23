import {User} from './user';
import {Department} from './department';
import {DataPage} from '../shared/data-page';

export class Designation {
  id: number;
  code: string;
  name: string;
  department: Department;
  basicsalary: number;
  creator: User;
  tocreation: string;
}

export class DesignationDataPage extends DataPage{
    content: Designation[];
}
