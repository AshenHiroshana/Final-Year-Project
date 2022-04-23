import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ApiManager} from '../shared/api-manager';
import {Buyingcondition} from '../entities/buyingcondition';

@Injectable({
  providedIn: 'root'
})
export class BuyingconditionService {

  constructor(private http: HttpClient) { }

  async getAll(): Promise<Buyingcondition[]>{
    const buyingconditions = await this.http.get<Buyingcondition[]>(ApiManager.getURL('buyingconditions')).toPromise();
    return buyingconditions.map((buyingcondition) => Object.assign(new Buyingcondition(), buyingcondition));
  }

}
