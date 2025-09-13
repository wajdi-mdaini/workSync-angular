import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from './auth-service';
import { catchError, map, of } from 'rxjs';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.loginCheck().pipe(
    map(() => true),
    catchError(() => {
      router.navigate(['/auth/login']);
      return of(false);
    })
  );
};
