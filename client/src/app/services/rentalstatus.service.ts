import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ApiManager} from '../shared/api-manager';
import {Rentalstatus} from '../entities/rentalstatus';

@Injectable({
  providedIn: 'root'
})
export class RentalstatusService {

  constructor(private http: HttpClient) { }

  async getAll(): Promise<Rentalstatus[]>{
    const rentalstatuses = await this.http.get<Rentalstatus[]>(ApiManager.getURL('rentalstatuses')).toPromise();
    return rentalstatuses.map((rentalstatus) => Object.assign(new Rentalstatus(), rentalstatus));
  }

}
