import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from './auth-service';
import { catchError, map, of } from 'rxjs';
import {ApiResponse, Role} from './models';
import {Shared} from './shared';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const sharedService = inject(Shared);
  let x = authService.loginCheck()

  return authService.loginCheck().pipe(
    map((apiResponse: ApiResponse) => {
      sharedService.principal = apiResponse.data.user;
      sharedService.company = apiResponse.data.company;
      router.url
      if( (sharedService.principal.firstLogin && !state.url.endsWith('firstlogin')) ||
        (!sharedService.principal.firstLogin && state.url.endsWith('firstlogin')) ) {
        sharedService.logout();
        return false;
      }else{
        if( ((sharedService.principal.role == Role.ADMIN || sharedService.principal.role == Role.MANAGER) && !state.url.includes('dashboard') )||
          ((sharedService.principal.role == Role.ADMIN || sharedService.principal.role == Role.MANAGER) && state.url.includes('home')) ){
          sharedService.logout();
          return false;
        }else if( (sharedService.principal.role == Role.EMPLOYEE && !state.url.includes('home')) ||
          (sharedService.principal.role == Role.EMPLOYEE && state.url.includes('dashboard')) ){
          sharedService.logout();
          return false;
        }
      }
      // if(sharedService.principal.firstLogin)
      //   // sharedService.customNavigation('/auth/firstlogin','navbar_screen_title_dashboard');
      // else {
      //   if(sharedService.principal.role == Role.ADMIN || sharedService.principal.role == Role.MANAGER){
      //     sharedService.customNavigation('dashboard', 'navbar_screen_title_dashboard');
      //   }else
      //     sharedService.customNavigation('home', 'navbar_screen_title_home');
      // }
      return true;
    }),
    catchError((err) => {
      sharedService.logout();
      return of(false);
    })
  );
};
