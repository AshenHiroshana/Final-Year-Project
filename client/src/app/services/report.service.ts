import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {ApiManager} from "../shared/api-manager";
import {PageRequest} from "../shared/page-request";
import {RentalDataPage} from "../entities/rental";
import {Consumeitem, ConsumeitemDataPage} from "../entities/consumeitem";
import {Payroll, PayrollDataPage} from "../entities/payroll";

@Injectable({
  providedIn: 'root'
})
export class ReportService {

  constructor(private http: HttpClient) { }

  async yearWiseConsumeitempaymentCount(count: number): Promise<any>{
    return await this.http.get<any>(ApiManager.getURL(`reports/year-wise-consumeitempayment-count/${count}`)).toPromise();
  }
  async branchWiseBillPayment(pageRequest: PageRequest): Promise<any[]>{
    const url = pageRequest.getPageRequestURL('reports/branch-wise-bill-payment');
    return await this.http.get<any[]>(ApiManager.getURL(url)).toPromise();
  }

  async branchWiseRentalPayment(pageRequest: PageRequest): Promise<any[]>{
    const url = pageRequest.getPageRequestURL('reports/branch-wise-rental-payment');
    return await this.http.get<any[]>(ApiManager.getURL(url)).toPromise();
  }
  async getAllConsumeItem(pageRequest: PageRequest): Promise<ConsumeitemDataPage>{
    const url = pageRequest.getPageRequestURL('consumeitems');
    const consumeitemDataPage = await this.http.get<ConsumeitemDataPage>(ApiManager.getURL(url)).toPromise();
    consumeitemDataPage.content = consumeitemDataPage.content.map((consumeitem) => Object.assign(new Consumeitem(), consumeitem));
    return consumeitemDataPage;
  }

  async getAllPayRollByEmployee(id: number, pageRequest: PageRequest): Promise<Payroll[]>{
    const url = pageRequest.getPageRequestURL(`payrolls/byemployee/${id}`);
    let payrollDataPage = await this.http.get<Payroll[]>(ApiManager.getURL(url)).toPromise();
    payrollDataPage = payrollDataPage.map((payroll) => Object.assign(new Payroll(), payroll));
    return payrollDataPage;
  }

}
