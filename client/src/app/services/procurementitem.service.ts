import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ApiManager} from '../shared/api-manager';
import {PageRequest} from '../shared/page-request';
import {ResourceLink} from '../shared/resource-link';
import {Procurementitem, ProcurementitemDataPage} from '../entities/procurementitem';

@Injectable({
  providedIn: 'root'
})
export class ProcurementitemService {

  constructor(private http: HttpClient) { }

  async getAll(pageRequest: PageRequest): Promise<ProcurementitemDataPage>{
    const url = pageRequest.getPageRequestURL('procurementitems');
    const procurementitemDataPage = await this.http.get<ProcurementitemDataPage>(ApiManager.getURL(url)).toPromise();
    procurementitemDataPage.content = procurementitemDataPage.content.map((procurementitem) => Object.assign(new Procurementitem(), procurementitem));
    return procurementitemDataPage;
  }

  async getAllBasic(pageRequest: PageRequest): Promise<ProcurementitemDataPage>{
    const url = pageRequest.getPageRequestURL('procurementitems/basic');
    const procurementitemDataPage = await this.http.get<ProcurementitemDataPage>(ApiManager.getURL(url)).toPromise();
    procurementitemDataPage.content = procurementitemDataPage.content.map((procurementitem) => Object.assign(new Procurementitem(), procurementitem));
    return procurementitemDataPage;
  }

  async get(id: number): Promise<Procurementitem>{
    const procurementitem: Procurementitem = await this.http.get<Procurementitem>(ApiManager.getURL(`procurementitems/${id}`)).toPromise();
    return Object.assign(new Procurementitem(), procurementitem);
  }

  async delete(id: number): Promise<void>{
    return this.http.delete<void>(ApiManager.getURL(`procurementitems/${id}`)).toPromise();
  }

  async add(procurementitem: Procurementitem): Promise<ResourceLink>{
    return this.http.post<ResourceLink>(ApiManager.getURL(`procurementitems`), procurementitem).toPromise();
  }

  async update(id: number, procurementitem: Procurementitem): Promise<ResourceLink>{
    return this.http.put<ResourceLink>(ApiManager.getURL(`procurementitems/${id}`), procurementitem).toPromise();
  }

  async getAllItemByPurchase(id: number): Promise<Procurementitem[]>{
    let procurementitems = await this.http.get<Procurementitem[]>(ApiManager.getURL(`procurementitems/itembypurchase/${id}`)).toPromise();
    procurementitems = procurementitems.map((procurementitem) => Object.assign(new Procurementitem(), procurementitem));
    return procurementitems;
  }

  async getAllItemByPurchaseForRefund(id: number): Promise<Procurementitem[]>{
    let procurementitems = await this.http.get<Procurementitem[]>(ApiManager.getURL(`procurementitems/itembypurchaseforrefund/${id}`)).toPromise();
    procurementitems = procurementitems.map((procurementitem) => Object.assign(new Procurementitem(), procurementitem));
    return procurementitems;
  }

  async getAllItemForAllocation(): Promise<Procurementitem[]>{
    let procurementitems = await this.http.get<Procurementitem[]>(ApiManager.getURL(`procurementitems/itemforallocation`)).toPromise();
    procurementitems = procurementitems.map((procurementitem) => Object.assign(new Procurementitem(), procurementitem));
    return procurementitems;
  }

  async getAllByBranchSection(id: number): Promise<Procurementitem[]>{
    let procurementitems = await this.http.get<Procurementitem[]>(ApiManager.getURL(`procurementitems/itembybranchsection/${id}`)).toPromise();
    procurementitems = procurementitems.map((procurementitem) => Object.assign(new Procurementitem(), procurementitem));
    return procurementitems;
  }
  async getPhoto(id: number): Promise<any>{
    return await this.http.get<any>(ApiManager.getURL(`procurementitems/${id}/photo`)).toPromise();
  }

  async getInvoice(id: number): Promise<any>{
    return await this.http.get<any>(ApiManager.getURL(`procurementitems/${id}/invoice`)).toPromise();
  }

  async getWarrantyphoto(id: number): Promise<any>{
    return await this.http.get<any>(ApiManager.getURL(`procurementitems/${id}/warrantyphoto`)).toPromise();
  }
}
