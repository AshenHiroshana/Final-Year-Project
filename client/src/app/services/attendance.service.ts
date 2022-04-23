import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ApiManager} from '../shared/api-manager';
import {PageRequest} from '../shared/page-request';
import {ResourceLink} from '../shared/resource-link';
import {Attendance, AttendanceDataPage} from '../entities/attendance';

@Injectable({
  providedIn: 'root'
})
export class AttendanceService {

  constructor(private http: HttpClient) { }

  async getAll(pageRequest: PageRequest): Promise<AttendanceDataPage>{
    const url = pageRequest.getPageRequestURL('attendances');
    const attendanceDataPage = await this.http.get<AttendanceDataPage>(ApiManager.getURL(url)).toPromise();
    attendanceDataPage.content = attendanceDataPage.content.map((attendance) => Object.assign(new Attendance(), attendance));
    return attendanceDataPage;
  }

  async getAllBasic(pageRequest: PageRequest): Promise<AttendanceDataPage>{
    const url = pageRequest.getPageRequestURL('attendances/basic');
    const attendanceDataPage = await this.http.get<AttendanceDataPage>(ApiManager.getURL(url)).toPromise();
    attendanceDataPage.content = attendanceDataPage.content.map((attendance) => Object.assign(new Attendance(), attendance));
    return attendanceDataPage;
  }

  async get(id: number): Promise<Attendance>{
    const attendance: Attendance = await this.http.get<Attendance>(ApiManager.getURL(`attendances/${id}`)).toPromise();
    return Object.assign(new Attendance(), attendance);
  }

  async delete(id: number): Promise<void>{
    return this.http.delete<void>(ApiManager.getURL(`attendances/${id}`)).toPromise();
  }

  async add(attendance: Attendance): Promise<ResourceLink>{
    return this.http.post<ResourceLink>(ApiManager.getURL(`attendances`), attendance).toPromise();
  }

  async update(id: number, attendance: Attendance): Promise<ResourceLink>{
    return this.http.put<ResourceLink>(ApiManager.getURL(`attendances/${id}`), attendance).toPromise();
  }

  async getAllByEmployeeMonth(id: number): Promise<Attendance[]>{
    let attendanceDataPage = await this.http.get<Attendance[]>(ApiManager.getURL(`attendances/byemployeeandmonth/${id}`)).toPromise();
    attendanceDataPage = attendanceDataPage.map((attendance) => Object.assign(new Attendance(), attendance));
    return attendanceDataPage;
  }

}
