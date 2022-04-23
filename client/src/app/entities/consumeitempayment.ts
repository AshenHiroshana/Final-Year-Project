import {User} from './user';
import {Paymenttype} from './paymenttype';
import {DataPage} from '../shared/data-page';
import {Paymentstatus} from './paymentstatus';
import {Consumeitempurchase} from './consumeitempurchase';

export class Consumeitempayment {
  id: number;
  code: string;
  consumeitempurchase: Consumeitempurchase;
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

export class ConsumeitempaymentDataPage extends DataPage{
    content: Consumeitempayment[];
}
