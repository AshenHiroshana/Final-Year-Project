import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ApiManager} from '../shared/api-manager';
import {PageRequest} from '../shared/page-request';
import {ResourceLink} from '../shared/resource-link';
import {Billpayment, BillpaymentDataPage} from '../entities/billpayment';

@Injectable({
  providedIn: 'root'
})
export class BillpaymentService {

  constructor(private http: HttpClient) { }

  async getAll(pageRequest: PageRequest): Promise<BillpaymentDataPage>{
    const url = pageRequest.getPageRequestURL('billpayments');
    const billpaymentDataPage = await this.http.get<BillpaymentDataPage>(ApiManager.getURL(url)).toPromise();
    billpaymentDataPage.content = billpaymentDataPage.content.map((billpayment) => Object.assign(new Billpayment(), billpayment));
    return billpaymentDataPage;
  }

  async getAllBasic(pageRequest: PageRequest): Promise<BillpaymentDataPage>{
    const url = pageRequest.getPageRequestURL('billpayments/basic');
    const billpaymentDataPage = await this.http.get<BillpaymentDataPage>(ApiManager.getURL(url)).toPromise();
    billpaymentDataPage.content = billpaymentDataPage.content.map((billpayment) => Object.assign(new Billpayment(), billpayment));
    return billpaymentDataPage;
  }

  async get(id: number): Promise<Billpayment>{
    const billpayment: Billpayment = await this.http.get<Billpayment>(ApiManager.getURL(`billpayments/${id}`)).toPromise();
    return Object.assign(new Billpayment(), billpayment);
  }

  async delete(id: number): Promise<void>{
    return this.http.delete<void>(ApiManager.getURL(`billpayments/${id}`)).toPromise();
  }

  async add(billpayment: Billpayment): Promise<ResourceLink>{
    return this.http.post<ResourceLink>(ApiManager.getURL(`billpayments`), billpayment).toPromise();
  }

  async update(id: number, billpayment: Billpayment): Promise<ResourceLink>{
    return this.http.put<ResourceLink>(ApiManager.getURL(`billpayments/${id}`), billpayment).toPromise();
  }

  async getSumof30(): Promise<number>{
    return this.http.get<number>(ApiManager.getURL(`billpayments/sumof30`)).toPromise();
  }

}
