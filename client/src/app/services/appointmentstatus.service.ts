import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ApiManager} from '../shared/api-manager';
import {Appointmentstatus} from '../entities/appointmentstatus';

@Injectable({
  providedIn: 'root'
})
export class AppointmentstatusService {

  constructor(private http: HttpClient) { }

  async getAll(): Promise<Appointmentstatus[]>{
    const appointmentstatuses = await this.http.get<Appointmentstatus[]>(ApiManager.getURL('appointmentstatuses')).toPromise();
    return appointmentstatuses.map((appointmentstatus) => Object.assign(new Appointmentstatus(), appointmentstatus));
  }

}
