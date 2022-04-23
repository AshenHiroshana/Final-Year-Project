import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ApiManager} from '../shared/api-manager';
import {Department} from '../entities/department';

@Injectable({
  providedIn: 'root'
})
export class DepartmentService {

  constructor(private http: HttpClient) { }

  async getAll(): Promise<Department[]>{
    const departments = await this.http.get<Department[]>(ApiManager.getURL('departments')).toPromise();
    return departments.map((department) => Object.assign(new Department(), department));
  }

}
