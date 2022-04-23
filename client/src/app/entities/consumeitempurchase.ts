import {User} from './user';
import {Vendor} from './vendor';
import {DataPage} from '../shared/data-page';
import {Consumeitempurchaseconsumeitem} from './consumeitempurchaseconsumeitem';

export class Consumeitempurchase {
  id: number;
  code: string;
  vendor: Vendor;
  date: string;
  total: number;
  discount: number;
  gorsamount: number;
  balance: number;
  consumeitempurchaseconsumeitemList: Consumeitempurchaseconsumeitem[];
  invoice: string;
  description: string;
  creator: User;
  tocreation: string;
}

export class ConsumeitempurchaseDataPage extends DataPage{
    content: Consumeitempurchase[];
}
