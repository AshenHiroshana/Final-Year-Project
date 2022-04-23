import {User} from './user';
import {Branch} from './branch';
import {Rentalstatus} from './rentalstatus';
import {DataPage} from '../shared/data-page';

export class Rental {
  id: number;
  code: string;
  branch: Branch;
  name: string;
  date: string;
  amount: number;
  rentalstatus: Rentalstatus;
  description: string;
  creator: User;
  tocreation: string;
}

export class RentalDataPage extends DataPage{
    content: Rental[];
}
