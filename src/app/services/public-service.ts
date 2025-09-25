import { Injectable } from '@angular/core';
import {environment} from '../config/environment';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {ApiResponse, NotificationDTO} from './models';

@Injectable({
  providedIn: 'root'
})
export class PublicService {

  constructor(private http: HttpClient) {}

  uploadPicture(email: string, file: File): Observable<ApiResponse> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('email', email);
    return this.http.post<ApiResponse>(environment.apiBaseUrl + '/public/upload-profile', formData,{ withCredentials: true });
  }

  getNotifications(email: string | undefined,isAll: boolean): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(environment.apiBaseUrl + '/public/notifications?email=' + email + '&all=' + isAll,{ withCredentials: true });
  }

  setNotificationsReadStatus(notifications: any[]): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(environment.apiBaseUrl + '/public/setnotificationsstatus', notifications,{ withCredentials: true });
  }

  getNotificationDetails(id: number): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(environment.apiBaseUrl + '/public/getnotificationdetails?id=' + id,{ withCredentials: true });
  }

  setProfileDetails(body: any): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(environment.apiBaseUrl + '/public/editprofile', body ,{ withCredentials: true });
  }

  checkCurrentPassword(password: string, email: string | undefined): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(environment.apiBaseUrl + '/public/checkCurrentPassword?password=' + password + '&email=' + email,{ withCredentials: true });
  }

  getTeamMembers(): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(environment.apiBaseUrl + '/public/teammembers',{ withCredentials: true });
  }
}
