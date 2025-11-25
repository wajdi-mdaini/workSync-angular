import {Inject, Injectable, PLATFORM_ID} from '@angular/core';
import {Subject} from 'rxjs';
import {ApiResponse} from './models';
import {isPlatformBrowser} from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class SharedHelper {
  private httpStatus = new Subject<ApiResponse>();
  httpStatus$ = this.httpStatus.asObservable();

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
  }

  spinner: boolean = false;
  setHttpStatus(value: any) {
    this.httpStatus.next(value);
  }

  spinnerShow(){
    if (isPlatformBrowser(this.platformId)) {
      let spinnerElement = document?.getElementById('spinner-overlay');
      if (spinnerElement)
        spinnerElement.style.display = 'flex';
    }
    this.spinner = true;
  }

  spinnerHide(){
    if (isPlatformBrowser(this.platformId)) {
      let spinnerElement = document?.getElementById('spinner-overlay');
      if (spinnerElement)
        spinnerElement.style.display = 'none';
    }
    this.spinner = false;
  }

  isApisWithNoSpinner(url: string): boolean{
    return url.includes("setnotificationsstatus") ||
            url.includes('public/upload-profile')
  }
}
