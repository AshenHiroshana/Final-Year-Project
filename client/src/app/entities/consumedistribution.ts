import {User} from './user';
import {Branch} from './branch';
import {DataPage} from '../shared/data-page';
import {Consumedistributionitem} from './consumedistributionitem';
import {Consumedistributionstatus} from './consumedistributionstatus';

export class Consumedistribution {
  id: number;
  code: string;
  branch: Branch;
  date: string;
  consumedistributionstatus: Consumedistributionstatus;
  consumedistributionitemList: Consumedistributionitem[];
  description: string;
  creator: User;
  tocreation: string;
}

export class ConsumedistributionDataPage extends DataPage{
    content: Consumedistribution[];
}
