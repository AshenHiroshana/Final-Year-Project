import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ApiManager} from '../shared/api-manager';
import {PageRequest} from '../shared/page-request';
import {ResourceLink} from '../shared/resource-link';
import {Consumeitempurchase, ConsumeitempurchaseDataPage} from '../entities/consumeitempurchase';
import {Procurementitempurchase} from "../entities/procurementitempurchase";

@Injectable({
  providedIn: 'root'
})
export class ConsumeitempurchaseService {

  constructor(private http: HttpClient) { }

  async getAll(pageRequest: PageRequest): Promise<ConsumeitempurchaseDataPage>{
    const url = pageRequest.getPageRequestURL('consumeitempurchases');
    const consumeitempurchaseDataPage = await this.http.get<ConsumeitempurchaseDataPage>(ApiManager.getURL(url)).toPromise();
    consumeitempurchaseDataPage.content = consumeitempurchaseDataPage.content.map((consumeitempurchase) => Object.assign(new Consumeitempurchase(), consumeitempurchase));
    return consumeitempurchaseDataPage;
  }

  async getAllBasic(pageRequest: PageRequest): Promise<ConsumeitempurchaseDataPage>{
    const url = pageRequest.getPageRequestURL('consumeitempurchases/basic');
    const consumeitempurchaseDataPage = await this.http.get<ConsumeitempurchaseDataPage>(ApiManager.getURL(url)).toPromise();
    consumeitempurchaseDataPage.content = consumeitempurchaseDataPage.content.map((consumeitempurchase) => Object.assign(new Consumeitempurchase(), consumeitempurchase));
    return consumeitempurchaseDataPage;
  }

  async get(id: number): Promise<Consumeitempurchase>{
    const consumeitempurchase: Consumeitempurchase = await this.http.get<Consumeitempurchase>(ApiManager.getURL(`consumeitempurchases/${id}`)).toPromise();
    return Object.assign(new Consumeitempurchase(), consumeitempurchase);
  }

  async delete(id: number): Promise<void>{
    return this.http.delete<void>(ApiManager.getURL(`consumeitempurchases/${id}`)).toPromise();
  }

  async add(consumeitempurchase: Consumeitempurchase): Promise<ResourceLink>{
    return this.http.post<ResourceLink>(ApiManager.getURL(`consumeitempurchases`), consumeitempurchase).toPromise();
  }

  async update(id: number, consumeitempurchase: Consumeitempurchase): Promise<ResourceLink>{
    return this.http.put<ResourceLink>(ApiManager.getURL(`consumeitempurchases/${id}`), consumeitempurchase).toPromise();
  }

  async getAllNonePayed(): Promise<Consumeitempurchase[]>{
    let consumeitempurchaseDataPage = await this.http.get<Consumeitempurchase[]>(ApiManager.getURL(`consumeitempurchases/nonepayed`)).toPromise();
    consumeitempurchaseDataPage = consumeitempurchaseDataPage.map((consumeitempurchase) => Object.assign(new Consumeitempurchase(), consumeitempurchase));
    return consumeitempurchaseDataPage;
  }

}
