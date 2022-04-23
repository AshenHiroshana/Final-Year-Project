import {User} from './user';
import {Branch} from './branch';
import {Material} from './material';
import {DataPage} from '../shared/data-page';
import {Printorderstatus} from './printorderstatus';

export class Printorder {
  id: number;
  code: string;
  branch: Branch;
  material: Material;
  qty: number;
  ordereddate: string;
  requireddate: string;
  receiveddate: string;
  printorderstatus: Printorderstatus;
  creator: User;
  tocreation: string;
}

export class PrintorderDataPage extends DataPage{
    content: Printorder[];
}
