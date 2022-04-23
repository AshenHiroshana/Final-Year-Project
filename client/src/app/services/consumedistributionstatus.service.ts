import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ApiManager} from '../shared/api-manager';
import {Consumedistributionstatus} from '../entities/consumedistributionstatus';

@Injectable({
  providedIn: 'root'
})
export class ConsumedistributionstatusService {

  constructor(private http: HttpClient) { }

  async getAll(): Promise<Consumedistributionstatus[]>{
    const consumedistributionstatuses = await this.http.get<Consumedistributionstatus[]>(ApiManager.getURL('consumedistributionstatuses')).toPromise();
    return consumedistributionstatuses.map((consumedistributionstatus) => Object.assign(new Consumedistributionstatus(), consumedistributionstatus));
  }

}
