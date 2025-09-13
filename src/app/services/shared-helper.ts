import {inject, Injectable} from '@angular/core';
import {Shared} from './shared';
import {Subject} from 'rxjs';
import {ApiResponse} from './models';

@Injectable({
  providedIn: 'root'
})
export class SharedHelper {
  private httpStatus = new Subject<ApiResponse>();
  httpStatus$ = this.httpStatus.asObservable();

  spinner: boolean = false;
  setHttpStatus(value: any) {
    this.httpStatus.next(value);
  }

  spinnerShow(){
    this.spinner = true;
  }

  spinnerHide(){
    this.spinner = false;
  }
}
