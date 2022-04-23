import {User} from './user';
import {Branch} from './branch';
import {DataPage} from '../shared/data-page';
import {Billpaymenttype} from './billpaymenttype';

export class Billpayment {
  id: number;
  code: string;
  billpaymenttype: Billpaymenttype;
  title: string;
  branch: Branch;
  amount: number;
  date: string;
  photo: string;
  description: string;
  creator: User;
  tocreation: string;
}

export class BillpaymentDataPage extends DataPage{
    content: Billpayment[];
}
