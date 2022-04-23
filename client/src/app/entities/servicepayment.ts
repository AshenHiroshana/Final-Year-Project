import {User} from './user';
import {Service} from './service';
import {Paymenttype} from './paymenttype';
import {DataPage} from '../shared/data-page';
import {Paymentstatus} from './paymentstatus';

export class Servicepayment {
  id: number;
  code: string;
  service: Service;
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

export class ServicepaymentDataPage extends DataPage{
    content: Servicepayment[];
}
