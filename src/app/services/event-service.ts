import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ApiResponse, EditEventDTO, Event, EventDTO} from './models';
import {Observable} from 'rxjs';
import {environment} from '../config/environment';

@Injectable({
  providedIn: 'root'
})
export class EventService {
  constructor(private http: HttpClient) {}

  getAllEvents(userEmail: string): Observable<ApiResponse>{
    return this.http.get<ApiResponse>(environment.apiBaseUrl + '/event/getallevents?id=' + userEmail,{withCredentials: true});
  }

  addEvent(event: EventDTO): Observable<ApiResponse>{
    return this.http.post<ApiResponse>(environment.apiBaseUrl + '/event/addevent',event,{withCredentials: true});
  }

  getCompanyUsers(userEmail: string): Observable<ApiResponse>{
    return this.http.get<ApiResponse>(environment.apiBaseUrl + '/event/getcompanyusers?id=' + userEmail,{withCredentials: true});
  }

  editEvent(editEventDTO: EditEventDTO): Observable<ApiResponse>{
    return this.http.post<ApiResponse>(environment.apiBaseUrl + '/event/editEvent', editEventDTO ,{withCredentials: true});
  }
}
