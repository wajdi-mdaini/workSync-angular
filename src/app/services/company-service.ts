import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ApiResponse, Branding, Company, CompanyDTO} from './models';
import {Observable} from 'rxjs';
import {environment} from '../config/environment';

@Injectable({
  providedIn: 'root'
})
export class CompanyService {
  constructor(private http: HttpClient) {}
  changeCompanyDetails(company: CompanyDTO): Observable<ApiResponse>{
    return this.http.post<ApiResponse>(environment.apiBaseUrl + '/company/setcompanydetails',company,{withCredentials: true});
  }
  resetBrandingList(companyId: number): Observable<ApiResponse>{
    return this.http.get<ApiResponse>(environment.apiBaseUrl + '/company/brandingreset?id=' + companyId,{withCredentials: true});
  }
  setUpBranding(companyId: number,brandingList: Branding[]): Observable<ApiResponse>{
    return this.http.put<ApiResponse>(environment.apiBaseUrl + '/company/brandingsetup?id=' + companyId, brandingList ,{withCredentials: true});
  }
}
