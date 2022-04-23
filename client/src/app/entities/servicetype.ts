import {User} from './user';
import {Vendor} from './vendor';
import {DataPage} from '../shared/data-page';

export class Servicetype {
  id: number;
  code: string;
  name: string;
  vendorList: Vendor[];
  description: string;
  creator: User;
  tocreation: string;
}

export class ServicetypeDataPage extends DataPage{
    content: Servicetype[];
}
