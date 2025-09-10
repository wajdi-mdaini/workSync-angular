import { HttpInterceptorFn } from '@angular/common/http';
import {inject} from '@angular/core';
import {Router} from '@angular/router';
import {catchError, throwError} from 'rxjs';
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

  return next(req).pipe(
    catchError((error) => {
      if (error.status === 0 || error.status === 500 || error.status === 403) {
        sharedHelper.setErrorCode(error.status)
        sharedHelper.setForceLogout(true)
      }

      return throwError(() => error);
    })
  )
};
