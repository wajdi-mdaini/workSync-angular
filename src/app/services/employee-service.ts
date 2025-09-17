import { Injectable } from '@angular/core';
import {environment} from '../config/environment';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {ApiResponse} from './models';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {

  constructor(private http: HttpClient) {}

  uploadPicture(email: string, file: File): Observable<ApiResponse> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('email', email);
    return this.http.post<ApiResponse>(environment.apiBaseUrl + '/employee/upload-profile', formData,{ withCredentials: true });
  }
}
