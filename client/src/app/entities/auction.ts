import {User} from './user';
import {DataPage} from '../shared/data-page';
import {Procurementitem} from './procurementitem';

export class Auction {
  id: number;
  code: string;
  buyer: string;
  procurementitem: Procurementitem;
  amount: number;
  date: string;
  description: string;
  creator: User;
  tocreation: string;
}

export class AuctionDataPage extends DataPage{
    content: Auction[];
}
