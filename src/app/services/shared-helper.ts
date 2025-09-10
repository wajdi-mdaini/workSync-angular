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

  setErrorCode(value: number) {
    this.errorCode.next(value);
  }

  setForceLogout(value: boolean) {
    this.forceLogout.next(value);
  }
}
