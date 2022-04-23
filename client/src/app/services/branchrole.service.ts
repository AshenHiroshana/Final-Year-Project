import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ApiManager} from '../shared/api-manager';
import {PageRequest} from '../shared/page-request';
import {ResourceLink} from '../shared/resource-link';
import {Branchrole, BranchroleDataPage} from '../entities/branchrole';
import {Branchroleassignment} from "../entities/branchroleassignment";

@Injectable({
  providedIn: 'root'
})
export class BranchroleService {

  constructor(private http: HttpClient) { }

  async getAll(pageRequest: PageRequest): Promise<BranchroleDataPage>{
    const url = pageRequest.getPageRequestURL('branchroles');
    const branchroleDataPage = await this.http.get<BranchroleDataPage>(ApiManager.getURL(url)).toPromise();
    branchroleDataPage.content = branchroleDataPage.content.map((branchrole) => Object.assign(new Branchrole(), branchrole));
    return branchroleDataPage;
  }

  async getAllBasic(pageRequest: PageRequest): Promise<BranchroleDataPage>{
    const url = pageRequest.getPageRequestURL('branchroles/basic');
    const branchroleDataPage = await this.http.get<BranchroleDataPage>(ApiManager.getURL(url)).toPromise();
    branchroleDataPage.content = branchroleDataPage.content.map((branchrole) => Object.assign(new Branchrole(), branchrole));
    return branchroleDataPage;
  }

  async get(id: number): Promise<Branchrole>{
    const branchrole: Branchrole = await this.http.get<Branchrole>(ApiManager.getURL(`branchroles/${id}`)).toPromise();
    return Object.assign(new Branchrole(), branchrole);
  }

  async delete(id: number): Promise<void>{
    return this.http.delete<void>(ApiManager.getURL(`branchroles/${id}`)).toPromise();
  }

  async add(branchrole: Branchrole): Promise<ResourceLink>{
    return this.http.post<ResourceLink>(ApiManager.getURL(`branchroles`), branchrole).toPromise();
  }

  async update(id: number, branchrole: Branchrole): Promise<ResourceLink>{
    return this.http.put<ResourceLink>(ApiManager.getURL(`branchroles/${id}`), branchrole).toPromise();
  }

  async getAllByBranch(id: number): Promise<Branchrole[]>{
    let branchroleDataPage = await this.http.get<Branchrole[]>(ApiManager.getURL(`branchroles/bybranch/${id}`)).toPromise();
    branchroleDataPage = branchroleDataPage.map((branchrole) => Object.assign(new Branchrole(), branchrole));
    return branchroleDataPage;
  }


}
