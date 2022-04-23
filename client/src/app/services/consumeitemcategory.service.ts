import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ApiManager} from '../shared/api-manager';
import {Consumeitemcategory} from '../entities/consumeitemcategory';

@Injectable({
  providedIn: 'root'
})
export class ConsumeitemcategoryService {

  constructor(private http: HttpClient) { }

  async getAll(): Promise<Consumeitemcategory[]>{
    const consumeitemcategories = await this.http.get<Consumeitemcategory[]>(ApiManager.getURL('consumeitemcategories')).toPromise();
    return consumeitemcategories.map((consumeitemcategory) => Object.assign(new Consumeitemcategory(), consumeitemcategory));
  }

}
