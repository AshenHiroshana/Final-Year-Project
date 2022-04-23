import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ApiManager} from '../shared/api-manager';
import {PageRequest} from '../shared/page-request';
import {ResourceLink} from '../shared/resource-link';
import {Procurementitempurchase, ProcurementitempurchaseDataPage} from '../entities/procurementitempurchase';
import {Procurementitemtype} from "../entities/procurementitemtype";

@Injectable({
  providedIn: 'root'
})
export class ProcurementitempurchaseService {

  constructor(private http: HttpClient) { }

  async getAll(pageRequest: PageRequest): Promise<ProcurementitempurchaseDataPage>{
    const url = pageRequest.getPageRequestURL('procurementitempurchases');
    const procurementitempurchaseDataPage = await this.http.get<ProcurementitempurchaseDataPage>(ApiManager.getURL(url)).toPromise();
    procurementitempurchaseDataPage.content = procurementitempurchaseDataPage.content.map((procurementitempurchase) => Object.assign(new Procurementitempurchase(), procurementitempurchase));
    return procurementitempurchaseDataPage;
  }

  async getAllBasic(pageRequest: PageRequest): Promise<ProcurementitempurchaseDataPage>{
    const url = pageRequest.getPageRequestURL('procurementitempurchases/basic');
    const procurementitempurchaseDataPage = await this.http.get<ProcurementitempurchaseDataPage>(ApiManager.getURL(url)).toPromise();
    procurementitempurchaseDataPage.content = procurementitempurchaseDataPage.content.map((procurementitempurchase) => Object.assign(new Procurementitempurchase(), procurementitempurchase));
    return procurementitempurchaseDataPage;
  }

  async get(id: number): Promise<Procurementitempurchase>{
    const procurementitempurchase: Procurementitempurchase = await this.http.get<Procurementitempurchase>(ApiManager.getURL(`procurementitempurchases/${id}`)).toPromise();
    return Object.assign(new Procurementitempurchase(), procurementitempurchase);
  }

  async delete(id: number): Promise<void>{
    return this.http.delete<void>(ApiManager.getURL(`procurementitempurchases/${id}`)).toPromise();
  }

  async add(procurementitempurchase: Procurementitempurchase): Promise<ResourceLink>{
    return this.http.post<ResourceLink>(ApiManager.getURL(`procurementitempurchases`), procurementitempurchase).toPromise();
  }

  async update(id: number, procurementitempurchase: Procurementitempurchase): Promise<ResourceLink>{
    return this.http.put<ResourceLink>(ApiManager.getURL(`procurementitempurchases/${id}`), procurementitempurchase).toPromise();
  }

  async getAllByVendor(id: number): Promise<Procurementitempurchase[]>{
    let procurementitempurchases = await this.http.get<Procurementitempurchase[]>(ApiManager.getURL(`procurementitempurchases/byvendor/${id}`)).toPromise();
    procurementitempurchases = procurementitempurchases.map((procurementitempurchase) => Object.assign(new Procurementitempurchase(), procurementitempurchase));
    return procurementitempurchases;
  }
  async getAllNonePayed(): Promise<Procurementitempurchase[]>{
    let procurementitempurchases = await this.http.get<Procurementitempurchase[]>(ApiManager.getURL(`procurementitempurchases/nonepayed`)).toPromise();
    procurementitempurchases = procurementitempurchases.map((procurementitempurchase) => Object.assign(new Procurementitempurchase(), procurementitempurchase));
    return procurementitempurchases;
  }

  async getAllNoneRefunded(): Promise<Procurementitempurchase[]>{
    let procurementitempurchases = await this.http.get<Procurementitempurchase[]>(ApiManager.getURL(`procurementitempurchases/nonerefunded`)).toPromise();
    procurementitempurchases = procurementitempurchases.map((procurementitempurchase) => Object.assign(new Procurementitempurchase(), procurementitempurchase));
    return procurementitempurchases;
  }
}
