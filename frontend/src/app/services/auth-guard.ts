import { inject, Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthStateService } from './auth-state';

@Injectable({
  providedIn: 'root',
})
export class AuthGuardService implements CanActivate {
  protected loggedIn = inject(AuthStateService).isLoggedIn;
  protected loggedUser = inject(AuthStateService).loggedUser;

  canActivate() {
    if (!this.loggedIn()) {
      this.router.navigateByUrl('/');
      return false;
    }
    return true;
  }

  constructor(private readonly router: Router) {}
}
