import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ApiManager} from '../shared/api-manager';
import {Servicestatus} from '../entities/servicestatus';

@Injectable({
  providedIn: 'root'
})
export class ServicestatusService {

  constructor(private http: HttpClient) { }

  async getAll(): Promise<Servicestatus[]>{
    const servicestatuses = await this.http.get<Servicestatus[]>(ApiManager.getURL('servicestatuses')).toPromise();
    return servicestatuses.map((servicestatus) => Object.assign(new Servicestatus(), servicestatus));
  }

}
