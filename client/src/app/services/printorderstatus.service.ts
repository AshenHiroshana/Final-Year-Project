import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ApiManager} from '../shared/api-manager';
import {Printorderstatus} from '../entities/printorderstatus';

@Injectable({
  providedIn: 'root'
})
export class PrintorderstatusService {

  constructor(private http: HttpClient) { }

  async getAll(): Promise<Printorderstatus[]>{
    const printorderstatuses = await this.http.get<Printorderstatus[]>(ApiManager.getURL('printorderstatuses')).toPromise();
    return printorderstatuses.map((printorderstatus) => Object.assign(new Printorderstatus(), printorderstatus));
  }

}
