import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from './auth-service';
import { catchError, map, of } from 'rxjs';
import {ApiResponse} from './models';
import {Shared} from './shared';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const sharedService = inject(Shared);

  return authService.loginCheck().pipe(
    map((apiResponse: ApiResponse) => {
      sharedService.principal = apiResponse.data.user;
      if(sharedService.principal?.firstLogin) {
        router.navigate(['/auth/firstlogin']);
      }
      return true;
    }),
    catchError((err) => {
      router.navigate(['/auth/login']);
      return of(false);
    })
  );
};
