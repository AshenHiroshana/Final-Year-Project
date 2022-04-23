import {User} from './user';
import {Branch} from './branch';
import {Vendor} from './vendor';
import {Servicetype} from './servicetype';
import {DataPage} from '../shared/data-page';
import {Servicestatus} from './servicestatus';
import {Serviceprocurementitem} from './serviceprocurementitem';

export class Service {
  id: number;
  code: string;
  branch: Branch;
  vendor: Vendor;
  servicetype: Servicetype;
  sdate: string;
  title: string;
  serviceprocurementitemList: Serviceprocurementitem[];
  total: number;
  balance: number;
  edate: string;
  servicestatus: Servicestatus;
  invoice: string;
  description: string;
  creator: User;
  tocreation: string;
}

export class ServiceDataPage extends DataPage{
    content: Service[];
}
