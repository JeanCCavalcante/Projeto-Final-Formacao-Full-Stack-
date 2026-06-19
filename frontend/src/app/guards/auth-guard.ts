import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { AuthStateService } from '../services/auth-state';

export const authGuard: CanActivateFn = (route, state) => {
  const isLoggedIn = inject(AuthStateService).isLoggedIn;

  if (!isLoggedIn()) {
    return false;
  }

  return true;
};
