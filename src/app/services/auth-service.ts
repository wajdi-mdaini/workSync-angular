import { Injectable } from '@angular/core';
import {Observable} from 'rxjs';
import {LoginRequest, LoginResponse, SharedSettings, User} from './models';
import {environment} from '../config/environment';
import {HttpClient} from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) {
  }

  login(body: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(environment.apiBaseUrl+'/auth/login',body)
  }
  getSharedSettings(): Observable<SharedSettings> {
    return this.http.get<SharedSettings>(environment.apiBaseUrl+'/auth/settings')
  }

}
