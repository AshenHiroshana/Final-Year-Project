import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ApiManager} from '../shared/api-manager';
import {PageRequest} from '../shared/page-request';
import {ResourceLink} from '../shared/resource-link';
import {Print, PrintDataPage} from '../entities/print';

@Injectable({
  providedIn: 'root'
})
export class PrintService {

  constructor(private http: HttpClient) { }

  async getAll(pageRequest: PageRequest): Promise<PrintDataPage>{
    const url = pageRequest.getPageRequestURL('prints');
    const printDataPage = await this.http.get<PrintDataPage>(ApiManager.getURL(url)).toPromise();
    printDataPage.content = printDataPage.content.map((print) => Object.assign(new Print(), print));
    return printDataPage;
  }

  async getAllBasic(pageRequest: PageRequest): Promise<PrintDataPage>{
    const url = pageRequest.getPageRequestURL('prints/basic');
    const printDataPage = await this.http.get<PrintDataPage>(ApiManager.getURL(url)).toPromise();
    printDataPage.content = printDataPage.content.map((print) => Object.assign(new Print(), print));
    return printDataPage;
  }

  async get(id: number): Promise<Print>{
    const print: Print = await this.http.get<Print>(ApiManager.getURL(`prints/${id}`)).toPromise();
    return Object.assign(new Print(), print);
  }

  async delete(id: number): Promise<void>{
    return this.http.delete<void>(ApiManager.getURL(`prints/${id}`)).toPromise();
  }

  async add(print: Print): Promise<ResourceLink>{
    return this.http.post<ResourceLink>(ApiManager.getURL(`prints`), print).toPromise();
  }

  async update(id: number, print: Print): Promise<ResourceLink>{
    return this.http.put<ResourceLink>(ApiManager.getURL(`prints/${id}`), print).toPromise();
  }

}
