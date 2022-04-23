import {User} from './user';
import {Vendortype} from './vendortype';
import {Vendorstatus} from './vendorstatus';
import {DataPage} from '../shared/data-page';

export class Vendor {
  id: number;
  code: string;
  name: string;
  email: string;
  primarycontact: string;
  secondarycontact: string;
  fax: string;
  vendortype: Vendortype;
  vendorstatus: Vendorstatus;
  starrate: number;
  address: string;
  description: string;
  creator: User;
  tocreation: string;
}

export class VendorDataPage extends DataPage{
    content: Vendor[];
}
