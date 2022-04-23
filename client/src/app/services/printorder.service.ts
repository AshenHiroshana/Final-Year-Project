import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ApiManager} from '../shared/api-manager';
import {PageRequest} from '../shared/page-request';
import {ResourceLink} from '../shared/resource-link';
import {Printorder, PrintorderDataPage} from '../entities/printorder';

@Injectable({
  providedIn: 'root'
})
export class PrintorderService {

  constructor(private http: HttpClient) { }

  async getAll(pageRequest: PageRequest): Promise<PrintorderDataPage>{
    const url = pageRequest.getPageRequestURL('printorders');
    const printorderDataPage = await this.http.get<PrintorderDataPage>(ApiManager.getURL(url)).toPromise();
    printorderDataPage.content = printorderDataPage.content.map((printorder) => Object.assign(new Printorder(), printorder));
    return printorderDataPage;
  }

  async getAllBasic(pageRequest: PageRequest): Promise<PrintorderDataPage>{
    const url = pageRequest.getPageRequestURL('printorders/basic');
    const printorderDataPage = await this.http.get<PrintorderDataPage>(ApiManager.getURL(url)).toPromise();
    printorderDataPage.content = printorderDataPage.content.map((printorder) => Object.assign(new Printorder(), printorder));
    return printorderDataPage;
  }

  async get(id: number): Promise<Printorder>{
    const printorder: Printorder = await this.http.get<Printorder>(ApiManager.getURL(`printorders/${id}`)).toPromise();
    return Object.assign(new Printorder(), printorder);
  }

  async delete(id: number): Promise<void>{
    return this.http.delete<void>(ApiManager.getURL(`printorders/${id}`)).toPromise();
  }

  async add(printorder: Printorder): Promise<ResourceLink>{
    return this.http.post<ResourceLink>(ApiManager.getURL(`printorders`), printorder).toPromise();
  }

  async update(id: number, printorder: Printorder): Promise<ResourceLink>{
    return this.http.put<ResourceLink>(ApiManager.getURL(`printorders/${id}`), printorder).toPromise();
  }

  async getAllOrdered(): Promise<Printorder[]>{
    let printorderDataPage = await this.http.get<Printorder[]>(ApiManager.getURL('printorders/ordered')).toPromise();
    printorderDataPage = printorderDataPage.map((printorder) => Object.assign(new Printorder(), printorder));
    return printorderDataPage;
  }

}
