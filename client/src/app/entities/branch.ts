import {User} from './user';
import {Branchstatus} from './branchstatus';
import {DataPage} from '../shared/data-page';
import {Branchbranchplan} from './branchbranchplan';

export class Branch {
  id: number;
  code: string;
  city: string;
  primarycontact: string;
  secondarycontact: string;
  fax: string;
  photo: string;
  maplink: string;
  email: string;
  branchstatus: Branchstatus;
  address: string;
  branchbranchplanList: Branchbranchplan[];
  description: string;
  creator: User;
  tocreation: string;
}

export class BranchDataPage extends DataPage{
    content: Branch[];
}
