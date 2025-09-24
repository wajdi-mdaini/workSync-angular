import {HttpEvent, HttpInterceptorFn} from '@angular/common/http';
import {inject} from '@angular/core';
import {catchError, finalize, tap, throwError} from 'rxjs';
import {SharedHelper} from './shared-helper';
export const jwtInterceptor: HttpInterceptorFn = (req, next) => {
  const sharedHelper = inject(SharedHelper);
  if(!sharedHelper.isApisWithNoSpinner(req.url))
    sharedHelper.spinnerShow()
  return next(req).pipe(
    tap((event: any) => {
      if(event.status == 200)
        sharedHelper.setHttpStatus(event?.body)
    }),
    catchError((error) => {
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


