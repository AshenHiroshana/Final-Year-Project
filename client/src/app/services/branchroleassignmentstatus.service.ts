import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ApiManager} from '../shared/api-manager';
import {Branchroleassignmentstatus} from '../entities/branchroleassignmentstatus';

@Injectable({
  providedIn: 'root'
})
export class BranchroleassignmentstatusService {

  constructor(private http: HttpClient) { }

  async getAll(): Promise<Branchroleassignmentstatus[]>{
    const branchroleassignmentstatuses = await this.http.get<Branchroleassignmentstatus[]>(ApiManager.getURL('branchroleassignmentstatuses')).toPromise();
    return branchroleassignmentstatuses.map((branchroleassignmentstatus) => Object.assign(new Branchroleassignmentstatus(), branchroleassignmentstatus));
  }

}
