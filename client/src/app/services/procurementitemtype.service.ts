import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ApiManager} from '../shared/api-manager';
import {PageRequest} from '../shared/page-request';
import {ResourceLink} from '../shared/resource-link';
import {Procurementitemtype, ProcurementitemtypeDataPage} from '../entities/procurementitemtype';

@Injectable({
  providedIn: 'root'
})
export class ProcurementitemtypeService {

  constructor(private http: HttpClient) { }

  async getAll(pageRequest: PageRequest): Promise<ProcurementitemtypeDataPage>{
    const url = pageRequest.getPageRequestURL('procurementitemtypes');
    const procurementitemtypeDataPage = await this.http.get<ProcurementitemtypeDataPage>(ApiManager.getURL(url)).toPromise();
    procurementitemtypeDataPage.content = procurementitemtypeDataPage.content.map((procurementitemtype) => Object.assign(new Procurementitemtype(), procurementitemtype));
    return procurementitemtypeDataPage;
  }

  async getAllBasic(pageRequest: PageRequest): Promise<ProcurementitemtypeDataPage>{
    const url = pageRequest.getPageRequestURL('procurementitemtypes/basic');
    const procurementitemtypeDataPage = await this.http.get<ProcurementitemtypeDataPage>(ApiManager.getURL(url)).toPromise();
    procurementitemtypeDataPage.content = procurementitemtypeDataPage.content.map((procurementitemtype) => Object.assign(new Procurementitemtype(), procurementitemtype));
    return procurementitemtypeDataPage;
  }

  async get(id: number): Promise<Procurementitemtype>{
    const procurementitemtype: Procurementitemtype = await this.http.get<Procurementitemtype>(ApiManager.getURL(`procurementitemtypes/${id}`)).toPromise();
    return Object.assign(new Procurementitemtype(), procurementitemtype);
  }

  async delete(id: number): Promise<void>{
    return this.http.delete<void>(ApiManager.getURL(`procurementitemtypes/${id}`)).toPromise();
  }

  async add(procurementitemtype: Procurementitemtype): Promise<ResourceLink>{
    return this.http.post<ResourceLink>(ApiManager.getURL(`procurementitemtypes`), procurementitemtype).toPromise();
  }

  async update(id: number, procurementitemtype: Procurementitemtype): Promise<ResourceLink>{
    return this.http.put<ResourceLink>(ApiManager.getURL(`procurementitemtypes/${id}`), procurementitemtype).toPromise();
  }

  async getAllByVendor(id: number): Promise<Procurementitemtype[]>{
    let procurementitemtypes = await this.http.get<Procurementitemtype[]>(ApiManager.getURL(`procurementitemtypes/byvendor/${id}`)).toPromise();
    procurementitemtypes = procurementitemtypes.map((procurementitemtype) => Object.assign(new Procurementitemtype(), procurementitemtype));
    return procurementitemtypes;
  }

}
