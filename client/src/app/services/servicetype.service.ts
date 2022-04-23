import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ApiManager} from '../shared/api-manager';
import {PageRequest} from '../shared/page-request';
import {ResourceLink} from '../shared/resource-link';
import {Servicetype, ServicetypeDataPage} from '../entities/servicetype';

@Injectable({
  providedIn: 'root'
})
export class ServicetypeService {

  constructor(private http: HttpClient) { }

  async getAll(pageRequest: PageRequest): Promise<ServicetypeDataPage>{
    const url = pageRequest.getPageRequestURL('servicetypes');
    const servicetypeDataPage = await this.http.get<ServicetypeDataPage>(ApiManager.getURL(url)).toPromise();
    servicetypeDataPage.content = servicetypeDataPage.content.map((servicetype) => Object.assign(new Servicetype(), servicetype));
    return servicetypeDataPage;
  }

  async getAllBasic(pageRequest: PageRequest): Promise<ServicetypeDataPage>{
    const url = pageRequest.getPageRequestURL('servicetypes/basic');
    const servicetypeDataPage = await this.http.get<ServicetypeDataPage>(ApiManager.getURL(url)).toPromise();
    servicetypeDataPage.content = servicetypeDataPage.content.map((servicetype) => Object.assign(new Servicetype(), servicetype));
    return servicetypeDataPage;
  }

  async get(id: number): Promise<Servicetype>{
    const servicetype: Servicetype = await this.http.get<Servicetype>(ApiManager.getURL(`servicetypes/${id}`)).toPromise();
    return Object.assign(new Servicetype(), servicetype);
  }

  async delete(id: number): Promise<void>{
    return this.http.delete<void>(ApiManager.getURL(`servicetypes/${id}`)).toPromise();
  }

  async add(servicetype: Servicetype): Promise<ResourceLink>{
    return this.http.post<ResourceLink>(ApiManager.getURL(`servicetypes`), servicetype).toPromise();
  }

  async update(id: number, servicetype: Servicetype): Promise<ResourceLink>{
    return this.http.put<ResourceLink>(ApiManager.getURL(`servicetypes/${id}`), servicetype).toPromise();
  }

  async getAllByVendor(id: number): Promise<Servicetype[]>{
    let servicetypes = await this.http.get<Servicetype[]>(ApiManager.getURL(`servicetypes/byvendor/${id}`)).toPromise();
    servicetypes = servicetypes.map((servicetype) => Object.assign(new Servicetype(), servicetype));
    return servicetypes;
  }

}
