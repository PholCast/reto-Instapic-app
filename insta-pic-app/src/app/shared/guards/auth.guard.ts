import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { TokenService } from '../services/token.service';
import { URL_REDIRECT } from '../utils/constants';

export const authGuard: CanActivateFn = (route, state) => {

  const router = inject(Router);
  const authService = inject(AuthService);
  const tokenService = inject(TokenService);

  if(tokenService.isTokenExpired()){
    localStorage.setItem(URL_REDIRECT,state.url);
    tokenService.clearToken();
    authService.logout();
    router.navigateByUrl('');
    return false;
  }

  return true;
};
