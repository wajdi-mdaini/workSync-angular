import {inject, Injectable} from '@angular/core';
import {Shared} from './shared';
import {Subject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SharedHelper {
  private errorCode = new Subject<number>();
  errors$ = this.errorCode.asObservable();

  private forceLogout = new Subject<boolean>();
  logout$ = this.forceLogout.asObservable();

  spinner: boolean = false;
  setErrorCode(value: any) {
    this.errorCode.next(value);
  }

  setForceLogout(value: boolean) {
    this.forceLogout.next(value);
  }

  spinnerShow(){
    this.spinner = true;
  }

  spinnerHide(){
    this.spinner = false;
  }
}
