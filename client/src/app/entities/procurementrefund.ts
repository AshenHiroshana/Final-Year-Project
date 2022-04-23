import {User} from './user';
import {Paymenttype} from './paymenttype';
import {DataPage} from '../shared/data-page';
import {Paymentstatus} from './paymentstatus';
import {Procurementitem} from './procurementitem';
import {Procurementitempurchase} from './procurementitempurchase';

export class Procurementrefund {
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
  procurementitemList: Procurementitem[];
  description: string;
  creator: User;
  tocreation: string;
}

export class ProcurementrefundDataPage extends DataPage{
    content: Procurementrefund[];
}
