import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ApiManager} from '../shared/api-manager';
import {PageRequest} from '../shared/page-request';
import {ResourceLink} from '../shared/resource-link';
import {Consumeitempayment, ConsumeitempaymentDataPage} from '../entities/consumeitempayment';
import {Procurementpayment} from "../entities/procurementpayment";

@Injectable({
  providedIn: 'root'
})
export class ConsumeitempaymentService {

  constructor(private http: HttpClient) { }

  async getAll(pageRequest: PageRequest): Promise<ConsumeitempaymentDataPage>{
    const url = pageRequest.getPageRequestURL('consumeitempayments');
    const consumeitempaymentDataPage = await this.http.get<ConsumeitempaymentDataPage>(ApiManager.getURL(url)).toPromise();
    consumeitempaymentDataPage.content = consumeitempaymentDataPage.content.map((consumeitempayment) => Object.assign(new Consumeitempayment(), consumeitempayment));
    return consumeitempaymentDataPage;
  }

  async getAllBasic(pageRequest: PageRequest): Promise<ConsumeitempaymentDataPage>{
    const url = pageRequest.getPageRequestURL('consumeitempayments/basic');
    const consumeitempaymentDataPage = await this.http.get<ConsumeitempaymentDataPage>(ApiManager.getURL(url)).toPromise();
    consumeitempaymentDataPage.content = consumeitempaymentDataPage.content.map((consumeitempayment) => Object.assign(new Consumeitempayment(), consumeitempayment));
    return consumeitempaymentDataPage;
  }

  async get(id: number): Promise<Consumeitempayment>{
    const consumeitempayment: Consumeitempayment = await this.http.get<Consumeitempayment>(ApiManager.getURL(`consumeitempayments/${id}`)).toPromise();
    return Object.assign(new Consumeitempayment(), consumeitempayment);
  }

  async delete(id: number): Promise<void>{
    return this.http.delete<void>(ApiManager.getURL(`consumeitempayments/${id}`)).toPromise();
  }

  async add(consumeitempayment: Consumeitempayment): Promise<ResourceLink>{
    return this.http.post<ResourceLink>(ApiManager.getURL(`consumeitempayments`), consumeitempayment).toPromise();
  }

  async update(id: number, consumeitempayment: Consumeitempayment): Promise<ResourceLink>{
    return this.http.put<ResourceLink>(ApiManager.getURL(`consumeitempayments/${id}`), consumeitempayment).toPromise();
  }

  async getAllPaymentByPurchase(id: number): Promise<Consumeitempayment[]>{
    let consumeitempaymentDataPage = await this.http.get<Consumeitempayment[]>(ApiManager.getURL(`consumeitempayments/paymentbypurchase/${id}`)).toPromise();
    consumeitempaymentDataPage = consumeitempaymentDataPage.map((consumeitempayment) => Object.assign(new Consumeitempayment(), consumeitempayment));
    return consumeitempaymentDataPage;
  }

  async getSumof30(): Promise<number>{
    return this.http.get<number>(ApiManager.getURL(`consumeitempayments/sumof30`)).toPromise();
  }

}
