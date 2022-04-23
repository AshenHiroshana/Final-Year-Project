import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ApiManager} from '../shared/api-manager';
import {PageRequest} from '../shared/page-request';
import {ResourceLink} from '../shared/resource-link';
import {Branchroleassignment, BranchroleassignmentDataPage} from '../entities/branchroleassignment';
import {Branch} from "../entities/branch";

@Injectable({
  providedIn: 'root'
})
export class BranchroleassignmentService {

  constructor(private http: HttpClient) { }

  async getAll(pageRequest: PageRequest): Promise<BranchroleassignmentDataPage>{
    const url = pageRequest.getPageRequestURL('branchroleassignments');
    const branchroleassignmentDataPage = await this.http.get<BranchroleassignmentDataPage>(ApiManager.getURL(url)).toPromise();
    branchroleassignmentDataPage.content = branchroleassignmentDataPage.content.map((branchroleassignment) => Object.assign(new Branchroleassignment(), branchroleassignment));
    return branchroleassignmentDataPage;
  }

  async getAllBasic(pageRequest: PageRequest): Promise<BranchroleassignmentDataPage>{
    const url = pageRequest.getPageRequestURL('branchroleassignments/basic');
    const branchroleassignmentDataPage = await this.http.get<BranchroleassignmentDataPage>(ApiManager.getURL(url)).toPromise();
    branchroleassignmentDataPage.content = branchroleassignmentDataPage.content.map((branchroleassignment) => Object.assign(new Branchroleassignment(), branchroleassignment));
    return branchroleassignmentDataPage;
  }

  async get(id: number): Promise<Branchroleassignment>{
    const branchroleassignment: Branchroleassignment = await this.http.get<Branchroleassignment>(ApiManager.getURL(`branchroleassignments/${id}`)).toPromise();
    return Object.assign(new Branchroleassignment(), branchroleassignment);
  }

  async delete(id: number): Promise<void>{
    return this.http.delete<void>(ApiManager.getURL(`branchroleassignments/${id}`)).toPromise();
  }

  async add(branchroleassignment: Branchroleassignment): Promise<ResourceLink>{
    return this.http.post<ResourceLink>(ApiManager.getURL(`branchroleassignments`), branchroleassignment).toPromise();
  }

  async update(id: number, branchroleassignment: Branchroleassignment): Promise<ResourceLink>{
    return this.http.put<ResourceLink>(ApiManager.getURL(`branchroleassignments/${id}`), branchroleassignment).toPromise();
  }

  async getAllForSalaryCalculation(id: number): Promise<Branchroleassignment[]>{
    let branchroleassignmentDataPage = await this.http.get<Branchroleassignment[]>(ApiManager.getURL(`branchroleassignments/forsalaycalculation/${id}`)).toPromise();
    branchroleassignmentDataPage = branchroleassignmentDataPage.map((branchroleassignment) => Object.assign(new Branchroleassignment(), branchroleassignment));
    return branchroleassignmentDataPage;
  }
}
