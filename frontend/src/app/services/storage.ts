import { Injectable } from '@angular/core';

import { USER_KEY } from '../constants/auth';
import { DecodedUser } from '../models/users';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  saveLoggedUser(userInfo: DecodedUser) {
    localStorage.setItem(USER_KEY, JSON.stringify(userInfo));
  }

  getLoggedUser(): DecodedUser | null {
    const loggedUser = localStorage.getItem(USER_KEY);
    if (!loggedUser) return null;

    return JSON.parse(loggedUser);
  }

  clearUser(): void {
    localStorage.removeItem(USER_KEY);
  }

  getExpiration(): number | undefined {
    const loggedUser = localStorage.getItem(USER_KEY);
    if (!loggedUser) return undefined;

    const expiresIn = JSON.parse(loggedUser).expiresIn;
    return expiresIn;
  }
}
