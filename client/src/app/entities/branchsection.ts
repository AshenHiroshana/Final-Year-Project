import {User} from './user';
import {Branch} from './branch';
import {DataPage} from '../shared/data-page';
import {Branchsectiontype} from './branchsectiontype';
import {Branchsectionstatus} from './branchsectionstatus';

export class Branchsection {
  id: number;
  code: string;
  name: string;
  branchsectionstatus: Branchsectionstatus;
  branchsectiontype: Branchsectiontype;
  branch: Branch;
  photo: string;
  areaplan: string;
  description: string;
  creator: User;
  tocreation: string;
}

export class BranchsectionDataPage extends DataPage{
    content: Branchsection[];
}
