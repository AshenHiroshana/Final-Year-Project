import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ApiManager} from '../shared/api-manager';
import {Branchrolestatus} from '../entities/branchrolestatus';

@Injectable({
  providedIn: 'root'
})
export class BranchrolestatusService {

  constructor(private http: HttpClient) { }

  async getAll(): Promise<Branchrolestatus[]>{
    const branchrolestatuses = await this.http.get<Branchrolestatus[]>(ApiManager.getURL('branchrolestatuses')).toPromise();
    return branchrolestatuses.map((branchrolestatus) => Object.assign(new Branchrolestatus(), branchrolestatus));
  }

}
