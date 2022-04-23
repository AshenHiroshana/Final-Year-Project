import {User} from './user';
import {DataPage} from '../shared/data-page';
import {Branchsection} from './branchsection';
import {Procurementallocationprocurementitem} from './procurementallocationprocurementitem';

export class Procurementallocation {
  id: number;
  code: string;
  branchsection: Branchsection;
  doallocated: string;
  procurementallocationprocurementitemList: Procurementallocationprocurementitem[];
  description: string;
  creator: User;
  tocreation: string;
}

export class ProcurementallocationDataPage extends DataPage{
    content: Procurementallocation[];
}
