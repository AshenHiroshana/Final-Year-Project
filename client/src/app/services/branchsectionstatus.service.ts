import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ApiManager} from '../shared/api-manager';
import {Branchsectionstatus} from '../entities/branchsectionstatus';

@Injectable({
  providedIn: 'root'
})
export class BranchsectionstatusService {

  constructor(private http: HttpClient) { }

  async getAll(): Promise<Branchsectionstatus[]>{
    const branchsectionstatuses = await this.http.get<Branchsectionstatus[]>(ApiManager.getURL('branchsectionstatuses')).toPromise();
    return branchsectionstatuses.map((branchsectionstatus) => Object.assign(new Branchsectionstatus(), branchsectionstatus));
  }

}
