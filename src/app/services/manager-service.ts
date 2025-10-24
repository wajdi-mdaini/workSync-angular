import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ApiResponse, Company, EditTeamRequest} from './models';
import {Observable} from 'rxjs';
import {environment} from '../config/environment';

@Injectable({
  providedIn: 'root'
})
export class ManagerService {
  constructor(private http: HttpClient) {}

  getAllEmployees(): Observable<ApiResponse>{
    return this.http.get<ApiResponse>(environment.apiBaseUrl + '/management/getallemployees',{withCredentials: true});
  }

  getCompanyTeams(company: Company): Observable<ApiResponse>{
    return this.http.post<ApiResponse>(environment.apiBaseUrl + '/management/getteams',company,{withCredentials: true});
  }

  editTeam(editTeamRequest: EditTeamRequest): Observable<ApiResponse>{
    return this.http.put<ApiResponse>(environment.apiBaseUrl + '/management/editteam',editTeamRequest,{withCredentials: true});
  }
}
