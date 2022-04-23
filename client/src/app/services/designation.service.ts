import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ApiManager} from '../shared/api-manager';
import {PageRequest} from '../shared/page-request';
import {ResourceLink} from '../shared/resource-link';
import {Designation, DesignationDataPage} from '../entities/designation';

@Injectable({
  providedIn: 'root'
})
export class DesignationService {

  constructor(private http: HttpClient) { }

  async getAll(pageRequest: PageRequest): Promise<DesignationDataPage>{
    const url = pageRequest.getPageRequestURL('designations');
    const designationDataPage = await this.http.get<DesignationDataPage>(ApiManager.getURL(url)).toPromise();
    designationDataPage.content = designationDataPage.content.map((designation) => Object.assign(new Designation(), designation));
    return designationDataPage;
  }

  async getAllBasic(pageRequest: PageRequest): Promise<DesignationDataPage>{
    const url = pageRequest.getPageRequestURL('designations/basic');
    const designationDataPage = await this.http.get<DesignationDataPage>(ApiManager.getURL(url)).toPromise();
    designationDataPage.content = designationDataPage.content.map((designation) => Object.assign(new Designation(), designation));
    return designationDataPage;
  }

  async get(id: number): Promise<Designation>{
    const designation: Designation = await this.http.get<Designation>(ApiManager.getURL(`designations/${id}`)).toPromise();
    return Object.assign(new Designation(), designation);
  }

  async delete(id: number): Promise<void>{
    return this.http.delete<void>(ApiManager.getURL(`designations/${id}`)).toPromise();
  }

  async add(designation: Designation): Promise<ResourceLink>{
    return this.http.post<ResourceLink>(ApiManager.getURL(`designations`), designation).toPromise();
  }

  async update(id: number, designation: Designation): Promise<ResourceLink>{
    return this.http.put<ResourceLink>(ApiManager.getURL(`designations/${id}`), designation).toPromise();
  }

}
