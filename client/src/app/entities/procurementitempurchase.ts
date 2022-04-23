import {User} from './user';
import {Vendor} from './vendor';
import {DataPage} from '../shared/data-page';
import {Procurementitem} from "./procurementitem";

export class Procurementitempurchase {
  id: number;
  code: string;
  vendor: Vendor;
  date: string;
  total: number;
  balance: number;
  invoice: string;
  description: string;
  creator: User;
  tocreation: string;
  procurementitemList: Procurementitem[];
}

export class ProcurementitempurchaseDataPage extends DataPage{
    content: Procurementitempurchase[];
}
