import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ApiManager} from '../shared/api-manager';
import {Vendortype} from '../entities/vendortype';

@Injectable({
  providedIn: 'root'
})
export class VendortypeService {

  constructor(private http: HttpClient) { }

  async getAll(): Promise<Vendortype[]>{
    const vendortypes = await this.http.get<Vendortype[]>(ApiManager.getURL('vendortypes')).toPromise();
    return vendortypes.map((vendortype) => Object.assign(new Vendortype(), vendortype));
  }

}
