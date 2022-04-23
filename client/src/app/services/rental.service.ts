import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ApiManager} from '../shared/api-manager';
import {PageRequest} from '../shared/page-request';
import {ResourceLink} from '../shared/resource-link';
import {Rental, RentalDataPage} from '../entities/rental';

@Injectable({
  providedIn: 'root'
})
export class RentalService {

  constructor(private http: HttpClient) { }

  async getAll(pageRequest: PageRequest): Promise<RentalDataPage>{
    const url = pageRequest.getPageRequestURL('rentals');
    const rentalDataPage = await this.http.get<RentalDataPage>(ApiManager.getURL(url)).toPromise();
    rentalDataPage.content = rentalDataPage.content.map((rental) => Object.assign(new Rental(), rental));
    return rentalDataPage;
  }

  async getAllBasic(pageRequest: PageRequest): Promise<RentalDataPage>{
    const url = pageRequest.getPageRequestURL('rentals/basic');
    const rentalDataPage = await this.http.get<RentalDataPage>(ApiManager.getURL(url)).toPromise();
    rentalDataPage.content = rentalDataPage.content.map((rental) => Object.assign(new Rental(), rental));
    return rentalDataPage;
  }

  async get(id: number): Promise<Rental>{
    const rental: Rental = await this.http.get<Rental>(ApiManager.getURL(`rentals/${id}`)).toPromise();
    return Object.assign(new Rental(), rental);
  }

  async delete(id: number): Promise<void>{
    return this.http.delete<void>(ApiManager.getURL(`rentals/${id}`)).toPromise();
  }

  async add(rental: Rental): Promise<ResourceLink>{
    return this.http.post<ResourceLink>(ApiManager.getURL(`rentals`), rental).toPromise();
  }

  async update(id: number, rental: Rental): Promise<ResourceLink>{
    return this.http.put<ResourceLink>(ApiManager.getURL(`rentals/${id}`), rental).toPromise();
  }

  async getAllForPay(month: number): Promise<Rental[]>{
    let rentalDataPage = await this.http.get<Rental[]>(ApiManager.getURL(`rentals/forpay/${month}`)).toPromise();
    rentalDataPage = rentalDataPage.map((rental) => Object.assign(new Rental(), rental));
    return rentalDataPage;
  }

}
