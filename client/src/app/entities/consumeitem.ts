import {Unit} from './unit';
import {User} from './user';
import {Vendor} from './vendor';
import {DataPage} from '../shared/data-page';
import {Consumeitemcategory} from './consumeitemcategory';

export class Consumeitem {
  id: number;
  code: string;
  consumeitemcategory: Consumeitemcategory;
  name: string;
  unit: Unit;
  qty: number;
  photo: string;
  vendorList: Vendor[];
  description: string;
  creator: User;
  tocreation: string;
}

export class ConsumeitemDataPage extends DataPage{
    content: Consumeitem[];
}
