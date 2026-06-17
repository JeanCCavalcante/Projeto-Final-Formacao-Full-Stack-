import { inject } from '@angular/core';
import { CanActivateFn, RedirectCommand, Router } from '@angular/router';
import { AuthStateService } from '../services/auth-state';

export const authGuard: CanActivateFn = (route, state) => {
  const isLoggedIn = inject(AuthStateService).isLoggedIn;
  const router = inject(Router);

  if (!isLoggedIn()) {
    const toLogin = router.parseUrl('/');
    return new RedirectCommand(toLogin, {
      onSameUrlNavigation: 'reload',
    });
  }
  return true;
};
