import { Injectable } from '@angular/core';
import {Observable} from 'rxjs';
import {
  ApiResponse,
  ChangePasswordRequest,
  LoginRequest,
  SignUpRequest
} from './models';
import {environment} from '../config/environment';
import {HttpClient} from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) {
  }

  login(body: LoginRequest): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(environment.apiBaseUrl+'/auth/login',body,{ withCredentials: true })
  }
  logout(): Observable<any> {
    return this.http.post(environment.apiBaseUrl+'/auth/logout',{},{ withCredentials: true,responseType: 'text' })
  }
  loginCheck(): Observable<any> {
    return this.http.get(environment.apiBaseUrl+'/auth/login/check',{ withCredentials: true });
  }
  getSharedSettings(): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(environment.apiBaseUrl+'/auth/settings')
  }
  getVerificationCode(email: string): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(environment.apiBaseUrl+'/auth/resetpasswordconfirmation?email=' + email,{})
  }
  checkVerificationCode(code: string,email: string): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(environment.apiBaseUrl+'/auth/resetpasswordcodecheck?code=' + code + '&email=' + email,{ withCredentials: true })
  }
  changePassword(changePasswordRequest: ChangePasswordRequest): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(environment.apiBaseUrl+'/auth/changepassword',changePasswordRequest,{ withCredentials: true })
  }
  signUp(signUpRequest: SignUpRequest): Observable<ApiResponse> {
    return this.http.put<ApiResponse>(environment.apiBaseUrl+'/auth/signup',signUpRequest)
  }

}
