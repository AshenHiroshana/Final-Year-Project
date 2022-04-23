import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ApiManager} from '../shared/api-manager';
import {Vendorstatus} from '../entities/vendorstatus';

@Injectable({
  providedIn: 'root'
})
export class VendorstatusService {

  constructor(private http: HttpClient) { }

  async getAll(): Promise<Vendorstatus[]>{
    const vendorstatuses = await this.http.get<Vendorstatus[]>(ApiManager.getURL('vendorstatuses')).toPromise();
    return vendorstatuses.map((vendorstatus) => Object.assign(new Vendorstatus(), vendorstatus));
  }

}
