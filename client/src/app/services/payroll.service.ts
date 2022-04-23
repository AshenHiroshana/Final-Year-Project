import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ApiManager} from '../shared/api-manager';
import {PageRequest} from '../shared/page-request';
import {ResourceLink} from '../shared/resource-link';
import {Payroll, PayrollDataPage} from '../entities/payroll';

@Injectable({
  providedIn: 'root'
})
export class PayrollService {

  constructor(private http: HttpClient) { }

  async getAll(pageRequest: PageRequest): Promise<PayrollDataPage>{
    const url = pageRequest.getPageRequestURL('payrolls');
    const payrollDataPage = await this.http.get<PayrollDataPage>(ApiManager.getURL(url)).toPromise();
    payrollDataPage.content = payrollDataPage.content.map((payroll) => Object.assign(new Payroll(), payroll));
    return payrollDataPage;
  }

  async getAllBasic(pageRequest: PageRequest): Promise<PayrollDataPage>{
    const url = pageRequest.getPageRequestURL('payrolls/basic');
    const payrollDataPage = await this.http.get<PayrollDataPage>(ApiManager.getURL(url)).toPromise();
    payrollDataPage.content = payrollDataPage.content.map((payroll) => Object.assign(new Payroll(), payroll));
    return payrollDataPage;
  }

  async get(id: number): Promise<Payroll>{
    const payroll: Payroll = await this.http.get<Payroll>(ApiManager.getURL(`payrolls/${id}`)).toPromise();
    return Object.assign(new Payroll(), payroll);
  }

  async delete(id: number): Promise<void>{
    return this.http.delete<void>(ApiManager.getURL(`payrolls/${id}`)).toPromise();
  }

  async add(payroll: Payroll): Promise<ResourceLink>{
    return this.http.post<ResourceLink>(ApiManager.getURL(`payrolls`), payroll).toPromise();
  }

  async update(id: number, payroll: Payroll): Promise<ResourceLink>{
    return this.http.put<ResourceLink>(ApiManager.getURL(`payrolls/${id}`), payroll).toPromise();
  }

}
