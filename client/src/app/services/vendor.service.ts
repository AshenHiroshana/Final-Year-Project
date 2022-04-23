import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ApiManager} from '../shared/api-manager';
import {PageRequest} from '../shared/page-request';
import {ResourceLink} from '../shared/resource-link';
import {Vendor, VendorDataPage} from '../entities/vendor';

@Injectable({
  providedIn: 'root'
})
export class VendorService {

  constructor(private http: HttpClient) { }

  async getAll(pageRequest: PageRequest): Promise<VendorDataPage>{
    const url = pageRequest.getPageRequestURL('vendors');
    const vendorDataPage = await this.http.get<VendorDataPage>(ApiManager.getURL(url)).toPromise();
    vendorDataPage.content = vendorDataPage.content.map((vendor) => Object.assign(new Vendor(), vendor));
    return vendorDataPage;
  }

  async getAllBasic(pageRequest: PageRequest): Promise<VendorDataPage>{
    const url = pageRequest.getPageRequestURL('vendors/basic');
    const vendorDataPage = await this.http.get<VendorDataPage>(ApiManager.getURL(url)).toPromise();
    vendorDataPage.content = vendorDataPage.content.map((vendor) => Object.assign(new Vendor(), vendor));
    return vendorDataPage;
  }

  async get(id: number): Promise<Vendor>{
    const vendor: Vendor = await this.http.get<Vendor>(ApiManager.getURL(`vendors/${id}`)).toPromise();
    return Object.assign(new Vendor(), vendor);
  }

  async delete(id: number): Promise<void>{
    return this.http.delete<void>(ApiManager.getURL(`vendors/${id}`)).toPromise();
  }

  async add(vendor: Vendor): Promise<ResourceLink>{
    return this.http.post<ResourceLink>(ApiManager.getURL(`vendors`), vendor).toPromise();
  }

  async update(id: number, vendor: Vendor): Promise<ResourceLink>{
    return this.http.put<ResourceLink>(ApiManager.getURL(`vendors/${id}`), vendor).toPromise();
  }

}
