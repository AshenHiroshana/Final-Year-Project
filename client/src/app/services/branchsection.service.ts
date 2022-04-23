import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ApiManager} from '../shared/api-manager';
import {PageRequest} from '../shared/page-request';
import {ResourceLink} from '../shared/resource-link';
import {Branchsection, BranchsectionDataPage} from '../entities/branchsection';

@Injectable({
  providedIn: 'root'
})
export class BranchsectionService {

  constructor(private http: HttpClient) { }

  async getAll(pageRequest: PageRequest): Promise<BranchsectionDataPage>{
    const url = pageRequest.getPageRequestURL('branchsections');
    const branchsectionDataPage = await this.http.get<BranchsectionDataPage>(ApiManager.getURL(url)).toPromise();
    branchsectionDataPage.content = branchsectionDataPage.content.map((branchsection) => Object.assign(new Branchsection(), branchsection));
    return branchsectionDataPage;
  }

  async getAllBasic(pageRequest: PageRequest): Promise<BranchsectionDataPage>{
    const url = pageRequest.getPageRequestURL('branchsections/basic');
    const branchsectionDataPage = await this.http.get<BranchsectionDataPage>(ApiManager.getURL(url)).toPromise();
    branchsectionDataPage.content = branchsectionDataPage.content.map((branchsection) => Object.assign(new Branchsection(), branchsection));
    return branchsectionDataPage;
  }

  async get(id: number): Promise<Branchsection>{
    const branchsection: Branchsection = await this.http.get<Branchsection>(ApiManager.getURL(`branchsections/${id}`)).toPromise();
    return Object.assign(new Branchsection(), branchsection);
  }

  async delete(id: number): Promise<void>{
    return this.http.delete<void>(ApiManager.getURL(`branchsections/${id}`)).toPromise();
  }

  async add(branchsection: Branchsection): Promise<ResourceLink>{
    return this.http.post<ResourceLink>(ApiManager.getURL(`branchsections`), branchsection).toPromise();
  }

  async update(id: number, branchsection: Branchsection): Promise<ResourceLink>{
    return this.http.put<ResourceLink>(ApiManager.getURL(`branchsections/${id}`), branchsection).toPromise();
  }

  async getAllByBranch(id: number): Promise<Branchsection[]>{
    let branchsections = await this.http.get<Branchsection[]>(ApiManager.getURL(`branchsections/bybranch/${id}`)).toPromise();
    branchsections = branchsections.map((branchsection) => Object.assign(new Branchsection(), branchsection));
    return branchsections;
  }


  async getPhoto(id: number): Promise<any>{
    return await this.http.get<any>(ApiManager.getURL(`branchsections/${id}/photo`)).toPromise();
  }
}
