import {User} from './user';
import {Vendor} from './vendor';
import {DataPage} from '../shared/data-page';
import {Buyingcondition} from './buyingcondition';
import {Procurementitemtype} from './procurementitemtype';
import {Procurementitemstatus} from './procurementitemstatus';
import {Procurementitempurchase} from './procurementitempurchase';

export class Procurementitem {
  id: number;
  code: string;
  vendor: Vendor;
  procurementitemtype: Procurementitemtype;
  procurementitempurchase: Procurementitempurchase;
  buyingcondition: Buyingcondition;
  itemphoto: string;
  price: number;
  dopurchased: string;
  procurementitemstatus: Procurementitemstatus;
  warrantyphoto: string;
  invoice: string;
  warrantyenddate: string;
  nooffreeservices: number;
  brand: string;
  description: string;
  creator: User;
  tocreation: string;
}

export class ProcurementitemDataPage extends DataPage{
    content: Procurementitem[];
}
