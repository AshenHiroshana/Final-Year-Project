import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ApiManager} from '../shared/api-manager';
import {Branchsectiontype} from '../entities/branchsectiontype';

@Injectable({
  providedIn: 'root'
})
export class BranchsectiontypeService {

  constructor(private http: HttpClient) { }

  async getAll(): Promise<Branchsectiontype[]>{
    const branchsectiontypes = await this.http.get<Branchsectiontype[]>(ApiManager.getURL('branchsectiontypes')).toPromise();
    return branchsectiontypes.map((branchsectiontype) => Object.assign(new Branchsectiontype(), branchsectiontype));
  }

}
