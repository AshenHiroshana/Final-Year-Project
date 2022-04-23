import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ApiManager} from '../shared/api-manager';
import {PageRequest} from '../shared/page-request';
import {ResourceLink} from '../shared/resource-link';
import {Servicepayment, ServicepaymentDataPage} from '../entities/servicepayment';

@Injectable({
  providedIn: 'root'
})
export class ServicepaymentService {

  constructor(private http: HttpClient) { }

  async getAll(pageRequest: PageRequest): Promise<ServicepaymentDataPage>{
    const url = pageRequest.getPageRequestURL('servicepayments');
    const servicepaymentDataPage = await this.http.get<ServicepaymentDataPage>(ApiManager.getURL(url)).toPromise();
    servicepaymentDataPage.content = servicepaymentDataPage.content.map((servicepayment) => Object.assign(new Servicepayment(), servicepayment));
    return servicepaymentDataPage;
  }

  async getAllBasic(pageRequest: PageRequest): Promise<ServicepaymentDataPage>{
    const url = pageRequest.getPageRequestURL('servicepayments/basic');
    const servicepaymentDataPage = await this.http.get<ServicepaymentDataPage>(ApiManager.getURL(url)).toPromise();
    servicepaymentDataPage.content = servicepaymentDataPage.content.map((servicepayment) => Object.assign(new Servicepayment(), servicepayment));
    return servicepaymentDataPage;
  }

  async get(id: number): Promise<Servicepayment>{
    const servicepayment: Servicepayment = await this.http.get<Servicepayment>(ApiManager.getURL(`servicepayments/${id}`)).toPromise();
    return Object.assign(new Servicepayment(), servicepayment);
  }

  async delete(id: number): Promise<void>{
    return this.http.delete<void>(ApiManager.getURL(`servicepayments/${id}`)).toPromise();
  }

  async add(servicepayment: Servicepayment): Promise<ResourceLink>{
    return this.http.post<ResourceLink>(ApiManager.getURL(`servicepayments`), servicepayment).toPromise();
  }

  async update(id: number, servicepayment: Servicepayment): Promise<ResourceLink>{
    return this.http.put<ResourceLink>(ApiManager.getURL(`servicepayments/${id}`), servicepayment).toPromise();
  }

  async getAllPaymentByPurchase(id: number): Promise<Servicepayment[]>{
    let servicepaymentDataPage = await this.http.get<Servicepayment[]>(ApiManager.getURL(`servicepayments/paymentbypurchase/${id}`)).toPromise();
    servicepaymentDataPage = servicepaymentDataPage.map((servicepayment) => Object.assign(new Servicepayment(), servicepayment));
    return servicepaymentDataPage;
  }


  async getSumof30(): Promise<number>{
    return this.http.get<number>(ApiManager.getURL(`servicepayments/sumof30`)).toPromise();
  }

}
