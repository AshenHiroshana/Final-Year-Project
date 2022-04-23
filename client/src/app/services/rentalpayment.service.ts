import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ApiManager} from '../shared/api-manager';
import {PageRequest} from '../shared/page-request';
import {ResourceLink} from '../shared/resource-link';
import {Rentalpayment, RentalpaymentDataPage} from '../entities/rentalpayment';

@Injectable({
  providedIn: 'root'
})
export class RentalpaymentService {

  constructor(private http: HttpClient) { }

  async getAll(pageRequest: PageRequest): Promise<RentalpaymentDataPage>{
    const url = pageRequest.getPageRequestURL('rentalpayments');
    const rentalpaymentDataPage = await this.http.get<RentalpaymentDataPage>(ApiManager.getURL(url)).toPromise();
    rentalpaymentDataPage.content = rentalpaymentDataPage.content.map((rentalpayment) => Object.assign(new Rentalpayment(), rentalpayment));
    return rentalpaymentDataPage;
  }

  async getAllBasic(pageRequest: PageRequest): Promise<RentalpaymentDataPage>{
    const url = pageRequest.getPageRequestURL('rentalpayments/basic');
    const rentalpaymentDataPage = await this.http.get<RentalpaymentDataPage>(ApiManager.getURL(url)).toPromise();
    rentalpaymentDataPage.content = rentalpaymentDataPage.content.map((rentalpayment) => Object.assign(new Rentalpayment(), rentalpayment));
    return rentalpaymentDataPage;
  }

  async get(id: number): Promise<Rentalpayment>{
    const rentalpayment: Rentalpayment = await this.http.get<Rentalpayment>(ApiManager.getURL(`rentalpayments/${id}`)).toPromise();
    return Object.assign(new Rentalpayment(), rentalpayment);
  }

  async delete(id: number): Promise<void>{
    return this.http.delete<void>(ApiManager.getURL(`rentalpayments/${id}`)).toPromise();
  }

  async add(rentalpayment: Rentalpayment): Promise<ResourceLink>{
    return this.http.post<ResourceLink>(ApiManager.getURL(`rentalpayments`), rentalpayment).toPromise();
  }

  async update(id: number, rentalpayment: Rentalpayment): Promise<ResourceLink>{
    return this.http.put<ResourceLink>(ApiManager.getURL(`rentalpayments/${id}`), rentalpayment).toPromise();
  }

  async getSumof30(): Promise<number>{
    return this.http.get<number>(ApiManager.getURL(`rentalpayments/sumof30`)).toPromise();
  }
}
