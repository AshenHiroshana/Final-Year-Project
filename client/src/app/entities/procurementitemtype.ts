import {User} from './user';
import {Vendor} from './vendor';
import {DataPage} from '../shared/data-page';

export class Procurementitemtype {
  id: number;
  code: string;
  name: string;
  vendorList: Vendor[];
  description: string;
  creator: User;
  tocreation: string;
}

export class ProcurementitemtypeDataPage extends DataPage{
    content: Procurementitemtype[];
}
