import {User} from './user';
import {Printorder} from './printorder';
import {Printstatus} from './printstatus';
import {DataPage} from '../shared/data-page';

export class Print {
  id: number;
  code: string;
  printorder: Printorder;
  sdate: string;
  edate: string;
  printstatus: Printstatus;
  creator: User;
  tocreation: string;
}

export class PrintDataPage extends DataPage{
    content: Print[];
}
