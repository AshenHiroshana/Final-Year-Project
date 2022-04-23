import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ApiManager} from '../shared/api-manager';
import {PageRequest} from '../shared/page-request';
import {ResourceLink} from '../shared/resource-link';
import {Procurementallocation, ProcurementallocationDataPage} from '../entities/procurementallocation';

@Injectable({
  providedIn: 'root'
})
export class ProcurementallocationService {

  constructor(private http: HttpClient) { }

  async getAll(pageRequest: PageRequest): Promise<ProcurementallocationDataPage>{
    const url = pageRequest.getPageRequestURL('procurementallocations');
    const procurementallocationDataPage = await this.http.get<ProcurementallocationDataPage>(ApiManager.getURL(url)).toPromise();
    procurementallocationDataPage.content = procurementallocationDataPage.content.map((procurementallocation) => Object.assign(new Procurementallocation(), procurementallocation));
    return procurementallocationDataPage;
  }

  async getAllBasic(pageRequest: PageRequest): Promise<ProcurementallocationDataPage>{
    const url = pageRequest.getPageRequestURL('procurementallocations/basic');
    const procurementallocationDataPage = await this.http.get<ProcurementallocationDataPage>(ApiManager.getURL(url)).toPromise();
    procurementallocationDataPage.content = procurementallocationDataPage.content.map((procurementallocation) => Object.assign(new Procurementallocation(), procurementallocation));
    return procurementallocationDataPage;
  }

  async get(id: number): Promise<Procurementallocation>{
    const procurementallocation: Procurementallocation = await this.http.get<Procurementallocation>(ApiManager.getURL(`procurementallocations/${id}`)).toPromise();
    return Object.assign(new Procurementallocation(), procurementallocation);
  }

  async delete(id: number): Promise<void>{
    return this.http.delete<void>(ApiManager.getURL(`procurementallocations/${id}`)).toPromise();
  }

  async add(procurementallocation: Procurementallocation): Promise<ResourceLink>{
    return this.http.post<ResourceLink>(ApiManager.getURL(`procurementallocations`), procurementallocation).toPromise();
  }

  async update(id: number, procurementallocation: Procurementallocation): Promise<ResourceLink>{
    return this.http.put<ResourceLink>(ApiManager.getURL(`procurementallocations/${id}`), procurementallocation).toPromise();
  }

}
