import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ApiManager} from '../shared/api-manager';
import {PageRequest} from '../shared/page-request';
import {ResourceLink} from '../shared/resource-link';
import {Consumeitem, ConsumeitemDataPage} from '../entities/consumeitem';

@Injectable({
  providedIn: 'root'
})
export class ConsumeitemService {

  constructor(private http: HttpClient) { }

  async getAll(pageRequest: PageRequest): Promise<ConsumeitemDataPage>{
    const url = pageRequest.getPageRequestURL('consumeitems');
    const consumeitemDataPage = await this.http.get<ConsumeitemDataPage>(ApiManager.getURL(url)).toPromise();
    consumeitemDataPage.content = consumeitemDataPage.content.map((consumeitem) => Object.assign(new Consumeitem(), consumeitem));
    return consumeitemDataPage;
  }

  async getAllBasic(pageRequest: PageRequest): Promise<ConsumeitemDataPage>{
    const url = pageRequest.getPageRequestURL('consumeitems/basic');
    const consumeitemDataPage = await this.http.get<ConsumeitemDataPage>(ApiManager.getURL(url)).toPromise();
    consumeitemDataPage.content = consumeitemDataPage.content.map((consumeitem) => Object.assign(new Consumeitem(), consumeitem));
    return consumeitemDataPage;
  }

  async get(id: number): Promise<Consumeitem>{
    const consumeitem: Consumeitem = await this.http.get<Consumeitem>(ApiManager.getURL(`consumeitems/${id}`)).toPromise();
    return Object.assign(new Consumeitem(), consumeitem);
  }

  async delete(id: number): Promise<void>{
    return this.http.delete<void>(ApiManager.getURL(`consumeitems/${id}`)).toPromise();
  }

  async add(consumeitem: Consumeitem): Promise<ResourceLink>{
    return this.http.post<ResourceLink>(ApiManager.getURL(`consumeitems`), consumeitem).toPromise();
  }

  async update(id: number, consumeitem: Consumeitem): Promise<ResourceLink>{
    return this.http.put<ResourceLink>(ApiManager.getURL(`consumeitems/${id}`), consumeitem).toPromise();
  }

  async getAllByVendor(id: number): Promise<Consumeitem[]>{
    let consumeitemDataPage = await this.http.get<Consumeitem[]>(ApiManager.getURL(`consumeitems/byvendor/${id}`)).toPromise();
    consumeitemDataPage = consumeitemDataPage.map((consumeitem) => Object.assign(new Consumeitem(), consumeitem));
    return consumeitemDataPage;
  }

  async getPhoto(id: number): Promise<any>{
    return await this.http.get<any>(ApiManager.getURL(`consumeitems/${id}/photo`)).toPromise();
  }
}
