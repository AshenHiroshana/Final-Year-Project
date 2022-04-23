import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ApiManager} from '../shared/api-manager';
import {PageRequest} from '../shared/page-request';
import {ResourceLink} from '../shared/resource-link';
import {Service, ServiceDataPage} from '../entities/service';

@Injectable({
  providedIn: 'root'
})
export class ServiceService {

  constructor(private http: HttpClient) { }

  async getAll(pageRequest: PageRequest): Promise<ServiceDataPage>{
    const url = pageRequest.getPageRequestURL('services');
    const serviceDataPage = await this.http.get<ServiceDataPage>(ApiManager.getURL(url)).toPromise();
    serviceDataPage.content = serviceDataPage.content.map((service) => Object.assign(new Service(), service));
    return serviceDataPage;
  }

  async getAllBasic(pageRequest: PageRequest): Promise<ServiceDataPage>{
    const url = pageRequest.getPageRequestURL('services/basic');
    const serviceDataPage = await this.http.get<ServiceDataPage>(ApiManager.getURL(url)).toPromise();
    serviceDataPage.content = serviceDataPage.content.map((service) => Object.assign(new Service(), service));
    return serviceDataPage;
  }

  async get(id: number): Promise<Service>{
    const service: Service = await this.http.get<Service>(ApiManager.getURL(`services/${id}`)).toPromise();
    return Object.assign(new Service(), service);
  }

  async delete(id: number): Promise<void>{
    return this.http.delete<void>(ApiManager.getURL(`services/${id}`)).toPromise();
  }

  async add(service: Service): Promise<ResourceLink>{
    return this.http.post<ResourceLink>(ApiManager.getURL(`services`), service).toPromise();
  }

  async update(id: number, service: Service): Promise<ResourceLink>{
    return this.http.put<ResourceLink>(ApiManager.getURL(`services/${id}`), service).toPromise();
  }

  async getAllNonePayed(): Promise<Service[]>{
    let serviceDataPage = await this.http.get<Service[]>(ApiManager.getURL(`services/nonepayed`)).toPromise();
    serviceDataPage = serviceDataPage.map((service) => Object.assign(new Service(), service));
    return serviceDataPage;
  }

  async getAllNoneRefunded(): Promise<Service[]>{
    let serviceDataPage = await this.http.get<Service[]>(ApiManager.getURL(`services/nonerefunded`)).toPromise();
    serviceDataPage = serviceDataPage.map((service) => Object.assign(new Service(), service));
    return serviceDataPage;
  }

  async getAllInProgress(): Promise<Service[]>{
    let serviceDataPage = await this.http.get<Service[]>(ApiManager.getURL(`services/inprogress`)).toPromise();
    serviceDataPage = serviceDataPage.map((service) => Object.assign(new Service(), service));
    return serviceDataPage;
  }

}
