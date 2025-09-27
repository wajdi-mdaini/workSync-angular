import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ApiResponse, Company} from './models';
import {Observable} from 'rxjs';
import {environment} from '../config/environment';

@Injectable({
  providedIn: 'root'
})
export class CompanyService {
  constructor(private http: HttpClient) {}
  changeCompanyDetails(company: Company): Observable<ApiResponse>{
    return this.http.post<ApiResponse>(environment.apiBaseUrl + '/company/setcompanydetails',company,{withCredentials: true});
  }
}
