import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ApiManager} from '../shared/api-manager';
import {Procurementitemstatus} from '../entities/procurementitemstatus';

@Injectable({
  providedIn: 'root'
})
export class ProcurementitemstatusService {

  constructor(private http: HttpClient) { }

  async getAll(): Promise<Procurementitemstatus[]>{
    const procurementitemstatuses = await this.http.get<Procurementitemstatus[]>(ApiManager.getURL('procurementitemstatuses')).toPromise();
    return procurementitemstatuses.map((procurementitemstatus) => Object.assign(new Procurementitemstatus(), procurementitemstatus));
  }

}
