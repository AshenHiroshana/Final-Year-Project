import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ApiManager} from '../shared/api-manager';
import {PageRequest} from '../shared/page-request';
import {ResourceLink} from '../shared/resource-link';
import {Appointment, AppointmentDataPage} from '../entities/appointment';

@Injectable({
  providedIn: 'root'
})
export class AppointmentService {

  constructor(private http: HttpClient) { }

  async getAll(pageRequest: PageRequest): Promise<AppointmentDataPage>{
    const url = pageRequest.getPageRequestURL('appointments');
    const appointmentDataPage = await this.http.get<AppointmentDataPage>(ApiManager.getURL(url)).toPromise();
    appointmentDataPage.content = appointmentDataPage.content.map((appointment) => Object.assign(new Appointment(), appointment));
    return appointmentDataPage;
  }

  async getAllBasic(pageRequest: PageRequest): Promise<AppointmentDataPage>{
    const url = pageRequest.getPageRequestURL('appointments/basic');
    const appointmentDataPage = await this.http.get<AppointmentDataPage>(ApiManager.getURL(url)).toPromise();
    appointmentDataPage.content = appointmentDataPage.content.map((appointment) => Object.assign(new Appointment(), appointment));
    return appointmentDataPage;
  }

  async get(id: number): Promise<Appointment>{
    const appointment: Appointment = await this.http.get<Appointment>(ApiManager.getURL(`appointments/${id}`)).toPromise();
    return Object.assign(new Appointment(), appointment);
  }

  async delete(id: number): Promise<void>{
    return this.http.delete<void>(ApiManager.getURL(`appointments/${id}`)).toPromise();
  }

  async add(appointment: Appointment): Promise<ResourceLink>{
    return this.http.post<ResourceLink>(ApiManager.getURL(`appointments`), appointment).toPromise();
  }

  async update(id: number, appointment: Appointment): Promise<ResourceLink>{
    return this.http.put<ResourceLink>(ApiManager.getURL(`appointments/${id}`), appointment).toPromise();
  }

  async getAllForPayroll(id: number): Promise<Appointment[]>{
    let appointmentDataPage = await this.http.get<Appointment[]>(ApiManager.getURL(`appointments/forpayroll/${id}`)).toPromise();
    appointmentDataPage = appointmentDataPage.map((appointment) => Object.assign(new Appointment(), appointment));
    return appointmentDataPage;
  }
}
