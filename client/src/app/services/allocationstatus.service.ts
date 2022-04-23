import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ApiManager} from '../shared/api-manager';
import {Allocationstatus} from '../entities/allocationstatus';

@Injectable({
  providedIn: 'root'
})
export class AllocationstatusService {

  constructor(private http: HttpClient) { }

  async getAll(): Promise<Allocationstatus[]>{
    const allocationstatuses = await this.http.get<Allocationstatus[]>(ApiManager.getURL('allocationstatuses')).toPromise();
    return allocationstatuses.map((allocationstatus) => Object.assign(new Allocationstatus(), allocationstatus));
  }

}
