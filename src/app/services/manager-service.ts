import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {AddTeamRequest, ApiResponse, Company, EditTeamRequest, Team} from './models';
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

  getTeamMembers(idTeam: any): Observable<ApiResponse>{
    return this.http.get<ApiResponse>(environment.apiBaseUrl + '/management/teammembers?id='+idTeam,{withCredentials: true});
  }

  addTeam(addTeamRequest: AddTeamRequest): Observable<ApiResponse>{
    return this.http.put<ApiResponse>(environment.apiBaseUrl + '/management/addteam',addTeamRequest,{withCredentials: true});
  }

  deleteTeam(teamId: number): Observable<ApiResponse>{
    return this.http.delete<ApiResponse>(environment.apiBaseUrl + '/management/deleteteam?id='+ teamId,{withCredentials: true});
  }
}
