import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ApiManager} from '../shared/api-manager';
import {Billpaymenttype} from '../entities/billpaymenttype';

@Injectable({
  providedIn: 'root'
})
export class BillpaymenttypeService {

  constructor(private http: HttpClient) { }

  async getAll(): Promise<Billpaymenttype[]>{
    const billpaymenttypes = await this.http.get<Billpaymenttype[]>(ApiManager.getURL('billpaymenttypes')).toPromise();
    return billpaymenttypes.map((billpaymenttype) => Object.assign(new Billpaymenttype(), billpaymenttype));
  }

}
