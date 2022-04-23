import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Gender} from "../entities/gender";
import {ApiManager} from "../shared/api-manager";

@Injectable({
  providedIn: 'root'
})
export class FileService {

  constructor(private http: HttpClient) { }

  async getFile(id: string): Promise<any>{
    return await this.http.get<any>(ApiManager.getURL(`files/file/${id}`)).toPromise();
  }

}
