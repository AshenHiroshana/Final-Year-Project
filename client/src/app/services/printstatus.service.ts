import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ApiManager} from '../shared/api-manager';
import {Printstatus} from '../entities/printstatus';

@Injectable({
  providedIn: 'root'
})
export class PrintstatusService {

  constructor(private http: HttpClient) { }

  async getAll(): Promise<Printstatus[]>{
    const printstatuses = await this.http.get<Printstatus[]>(ApiManager.getURL('printstatuses')).toPromise();
    return printstatuses.map((printstatus) => Object.assign(new Printstatus(), printstatus));
  }

}
