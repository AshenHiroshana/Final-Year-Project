import {User} from './user';
import {Rental} from './rental';
import {Paymenttype} from './paymenttype';
import {DataPage} from '../shared/data-page';
import {Paymentstatus} from './paymentstatus';

export class Rentalpayment {
  id: number;
  code: string;
  rental: Rental;
  date: string;
  amount: number;
  paymentstatus: Paymentstatus;
  paymenttype: Paymenttype;
  chequeno: string;
  chequedate: string;
  chequebank: string;
  chequebranch: string;
  description: string;
  creator: User;
  tocreation: string;
}

export class RentalpaymentDataPage extends DataPage{
    content: Rentalpayment[];
}
