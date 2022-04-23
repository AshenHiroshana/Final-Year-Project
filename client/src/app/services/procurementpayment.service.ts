import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ApiManager} from '../shared/api-manager';
import {PageRequest} from '../shared/page-request';
import {ResourceLink} from '../shared/resource-link';
import {Procurementpayment, ProcurementpaymentDataPage} from '../entities/procurementpayment';
import {Procurementitem} from "../entities/procurementitem";

@Injectable({
  providedIn: 'root'
})
export class ProcurementpaymentService {

  constructor(private http: HttpClient) { }

  async getAll(pageRequest: PageRequest): Promise<ProcurementpaymentDataPage>{
    const url = pageRequest.getPageRequestURL('procurementpayments');
    const procurementpaymentDataPage = await this.http.get<ProcurementpaymentDataPage>(ApiManager.getURL(url)).toPromise();
    procurementpaymentDataPage.content = procurementpaymentDataPage.content.map((procurementpayment) => Object.assign(new Procurementpayment(), procurementpayment));
    return procurementpaymentDataPage;
  }

  async getAllBasic(pageRequest: PageRequest): Promise<ProcurementpaymentDataPage>{
    const url = pageRequest.getPageRequestURL('procurementpayments/basic');
    const procurementpaymentDataPage = await this.http.get<ProcurementpaymentDataPage>(ApiManager.getURL(url)).toPromise();
    procurementpaymentDataPage.content = procurementpaymentDataPage.content.map((procurementpayment) => Object.assign(new Procurementpayment(), procurementpayment));
    return procurementpaymentDataPage;
  }

  async get(id: number): Promise<Procurementpayment>{
    const procurementpayment: Procurementpayment = await this.http.get<Procurementpayment>(ApiManager.getURL(`procurementpayments/${id}`)).toPromise();
    return Object.assign(new Procurementpayment(), procurementpayment);
  }

  async delete(id: number): Promise<void>{
    return this.http.delete<void>(ApiManager.getURL(`procurementpayments/${id}`)).toPromise();
  }

  async add(procurementpayment: Procurementpayment): Promise<ResourceLink>{
    return this.http.post<ResourceLink>(ApiManager.getURL(`procurementpayments`), procurementpayment).toPromise();
  }

  async update(id: number, procurementpayment: Procurementpayment): Promise<ResourceLink>{
    return this.http.put<ResourceLink>(ApiManager.getURL(`procurementpayments/${id}`), procurementpayment).toPromise();
  }

  async getAllPaymentByPurchase(id: number): Promise<Procurementpayment[]>{
    let procurementpayments = await this.http.get<Procurementpayment[]>(ApiManager.getURL(`procurementpayments/paymentbypurchase/${id}`)).toPromise();
    procurementpayments = procurementpayments.map((procurementpayment) => Object.assign(new Procurementpayment(), procurementpayment));
    return procurementpayments;
  }

}
