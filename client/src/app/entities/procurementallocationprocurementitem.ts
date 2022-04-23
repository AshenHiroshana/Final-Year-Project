import {Procurementitem} from './procurementitem';
import {Allocationstatus} from './allocationstatus';

export class Procurementallocationprocurementitem {
  id: number;
  dodeallocate: string;
  procurementitem: Procurementitem;
  allocationstatus: Allocationstatus;
}
