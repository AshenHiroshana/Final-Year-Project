import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ApiManager} from '../shared/api-manager';
import {PageRequest} from '../shared/page-request';
import {ResourceLink} from '../shared/resource-link';
import {Procurementrefund, ProcurementrefundDataPage} from '../entities/procurementrefund';

@Injectable({
  providedIn: 'root'
})
export class ProcurementrefundService {

  constructor(private http: HttpClient) { }

  async getAll(pageRequest: PageRequest): Promise<ProcurementrefundDataPage>{
    const url = pageRequest.getPageRequestURL('procurementrefunds');
    const procurementrefundDataPage = await this.http.get<ProcurementrefundDataPage>(ApiManager.getURL(url)).toPromise();
    procurementrefundDataPage.content = procurementrefundDataPage.content.map((procurementrefund) => Object.assign(new Procurementrefund(), procurementrefund));
    return procurementrefundDataPage;
  }

  async getAllBasic(pageRequest: PageRequest): Promise<ProcurementrefundDataPage>{
    const url = pageRequest.getPageRequestURL('procurementrefunds/basic');
    const procurementrefundDataPage = await this.http.get<ProcurementrefundDataPage>(ApiManager.getURL(url)).toPromise();
    procurementrefundDataPage.content = procurementrefundDataPage.content.map((procurementrefund) => Object.assign(new Procurementrefund(), procurementrefund));
    return procurementrefundDataPage;
  }

  async get(id: number): Promise<Procurementrefund>{
    const procurementrefund: Procurementrefund = await this.http.get<Procurementrefund>(ApiManager.getURL(`procurementrefunds/${id}`)).toPromise();
    return Object.assign(new Procurementrefund(), procurementrefund);
  }

  async delete(id: number): Promise<void>{
    return this.http.delete<void>(ApiManager.getURL(`procurementrefunds/${id}`)).toPromise();
  }

  async add(procurementrefund: Procurementrefund): Promise<ResourceLink>{
    return this.http.post<ResourceLink>(ApiManager.getURL(`procurementrefunds`), procurementrefund).toPromise();
  }

  async update(id: number, procurementrefund: Procurementrefund): Promise<ResourceLink>{
    return this.http.put<ResourceLink>(ApiManager.getURL(`procurementrefunds/${id}`), procurementrefund).toPromise();
  }

}
