import {User} from './user';
import {Employee} from './employee';
import {Designation} from './designation';
import {DataPage} from '../shared/data-page';
import {Appointmentstatus} from './appointmentstatus';
import {Appointmentallowance} from './appointmentallowance';

export class Appointment {
  id: number;
  code: string;
  designation: Designation;
  employee: Employee;
  appointmentstatus: Appointmentstatus;
  dogrant: string;
  dorevoke: string;
  appointmentallowanceList: Appointmentallowance[];
  description: string;
  creator: User;
  tocreation: string;
}

export class AppointmentDataPage extends DataPage{
    content: Appointment[];
}
