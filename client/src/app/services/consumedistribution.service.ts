import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ApiManager} from '../shared/api-manager';
import {PageRequest} from '../shared/page-request';
import {ResourceLink} from '../shared/resource-link';
import {Consumedistribution, ConsumedistributionDataPage} from '../entities/consumedistribution';

@Injectable({
  providedIn: 'root'
})
export class ConsumedistributionService {

  constructor(private http: HttpClient) { }

  async getAll(pageRequest: PageRequest): Promise<ConsumedistributionDataPage>{
    const url = pageRequest.getPageRequestURL('consumedistributions');
    const consumedistributionDataPage = await this.http.get<ConsumedistributionDataPage>(ApiManager.getURL(url)).toPromise();
    consumedistributionDataPage.content = consumedistributionDataPage.content.map((consumedistribution) => Object.assign(new Consumedistribution(), consumedistribution));
    return consumedistributionDataPage;
  }

  async getAllBasic(pageRequest: PageRequest): Promise<ConsumedistributionDataPage>{
    const url = pageRequest.getPageRequestURL('consumedistributions/basic');
    const consumedistributionDataPage = await this.http.get<ConsumedistributionDataPage>(ApiManager.getURL(url)).toPromise();
    consumedistributionDataPage.content = consumedistributionDataPage.content.map((consumedistribution) => Object.assign(new Consumedistribution(), consumedistribution));
    return consumedistributionDataPage;
  }

  async get(id: number): Promise<Consumedistribution>{
    const consumedistribution: Consumedistribution = await this.http.get<Consumedistribution>(ApiManager.getURL(`consumedistributions/${id}`)).toPromise();
    return Object.assign(new Consumedistribution(), consumedistribution);
  }

  async delete(id: number): Promise<void>{
    return this.http.delete<void>(ApiManager.getURL(`consumedistributions/${id}`)).toPromise();
  }

  async add(consumedistribution: Consumedistribution): Promise<ResourceLink>{
    return this.http.post<ResourceLink>(ApiManager.getURL(`consumedistributions`), consumedistribution).toPromise();
  }

  async update(id: number, consumedistribution: Consumedistribution): Promise<ResourceLink>{
    return this.http.put<ResourceLink>(ApiManager.getURL(`consumedistributions/${id}`), consumedistribution).toPromise();
  }

}
