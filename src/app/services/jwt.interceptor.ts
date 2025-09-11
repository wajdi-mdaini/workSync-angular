import { HttpInterceptorFn } from '@angular/common/http';
import {inject} from '@angular/core';
import {catchError, finalize, throwError} from 'rxjs';
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
    catchError((error) => {
      if(error.url.includes('auth/login') && error.status === 403) {
        sharedHelper.setErrorCode('non existing user')
      }else if (error.status === 0 || error.status === 500 || error.status === 403) {
        sharedHelper.setErrorCode(error.status)
        sharedHelper.setForceLogout(true)
      }

      return throwError(() => error);
    }),
    finalize(() => {
      sharedHelper.spinnerHide();
    })
  )
};
