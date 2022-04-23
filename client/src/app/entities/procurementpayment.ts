import {User} from './user';
import {Paymenttype} from './paymenttype';
import {DataPage} from '../shared/data-page';
import {Paymentstatus} from './paymentstatus';
import {Procurementitempurchase} from './procurementitempurchase';

export class Procurementpayment {
  id: number;
  code: string;
  procurementitempurchase: Procurementitempurchase;
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

export class ProcurementpaymentDataPage extends DataPage{
    content: Procurementpayment[];
}
