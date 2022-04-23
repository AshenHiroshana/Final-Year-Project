import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ApiManager} from '../shared/api-manager';
import {PageRequest} from '../shared/page-request';
import {ResourceLink} from '../shared/resource-link';
import {Servicerefund, ServicerefundDataPage} from '../entities/servicerefund';

@Injectable({
  providedIn: 'root'
})
export class ServicerefundService {

  constructor(private http: HttpClient) { }

  async getAll(pageRequest: PageRequest): Promise<ServicerefundDataPage>{
    const url = pageRequest.getPageRequestURL('servicerefunds');
    const servicerefundDataPage = await this.http.get<ServicerefundDataPage>(ApiManager.getURL(url)).toPromise();
    servicerefundDataPage.content = servicerefundDataPage.content.map((servicerefund) => Object.assign(new Servicerefund(), servicerefund));
    return servicerefundDataPage;
  }

  async getAllBasic(pageRequest: PageRequest): Promise<ServicerefundDataPage>{
    const url = pageRequest.getPageRequestURL('servicerefunds/basic');
    const servicerefundDataPage = await this.http.get<ServicerefundDataPage>(ApiManager.getURL(url)).toPromise();
    servicerefundDataPage.content = servicerefundDataPage.content.map((servicerefund) => Object.assign(new Servicerefund(), servicerefund));
    return servicerefundDataPage;
  }

  async get(id: number): Promise<Servicerefund>{
    const servicerefund: Servicerefund = await this.http.get<Servicerefund>(ApiManager.getURL(`servicerefunds/${id}`)).toPromise();
    return Object.assign(new Servicerefund(), servicerefund);
  }

  async delete(id: number): Promise<void>{
    return this.http.delete<void>(ApiManager.getURL(`servicerefunds/${id}`)).toPromise();
  }

  async add(servicerefund: Servicerefund): Promise<ResourceLink>{
    return this.http.post<ResourceLink>(ApiManager.getURL(`servicerefunds`), servicerefund).toPromise();
  }

  async update(id: number, servicerefund: Servicerefund): Promise<ResourceLink>{
    return this.http.put<ResourceLink>(ApiManager.getURL(`servicerefunds/${id}`), servicerefund).toPromise();
  }

}
