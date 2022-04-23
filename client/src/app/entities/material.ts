import {User} from './user';
import {Materialtype} from './materialtype';
import {DataPage} from '../shared/data-page';
import {Materialstatus} from './materialstatus';

export class Material {
  id: number;
  code: string;
  name: string;
  pagecount: number;
  materialtype: Materialtype;
  materialstatus: Materialstatus;
  file: string;
  creator: User;
  tocreation: string;
}

export class MaterialDataPage extends DataPage{
    content: Material[];
}
