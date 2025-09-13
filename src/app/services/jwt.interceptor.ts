import {HttpEvent, HttpInterceptorFn} from '@angular/common/http';
import {inject} from '@angular/core';
import {catchError, finalize, tap, throwError} from 'rxjs';
import {SharedHelper} from './shared-helper';
export const jwtInterceptor: HttpInterceptorFn = (req, next) => {
  const sharedHelper = inject(SharedHelper);
  let token: string | null = null;


  if (typeof window !== 'undefined' && window.localStorage) {
    token = localStorage.getItem('jwt');
  }

  if (token) {
    req = req.clone({
      setHeaders: {
        Authorization: `wmdaini ${token}`
      }
    });
  }
  sharedHelper.spinnerShow()
  return next(req).pipe(
    tap((event: any) => {
      if(event.status == 200)
        sharedHelper.setHttpStatus(event?.body)
    }),
    catchError((error) => {
      // if((error.url.includes('auth/login') || error.url.includes('/auth/resetpasswordconfirmation?')) &&
      //   error.status === 403) {
      //   sharedHelper.setErrorCode('non existing user')
      if (error.status === 0) {
        sharedHelper.setHttpStatus(error)
      }
      sharedHelper.setHttpStatus(error?.error)
      return throwError(() => error);
    }),
    finalize(() => {
      sharedHelper.spinnerHide();
    })
  )
};
