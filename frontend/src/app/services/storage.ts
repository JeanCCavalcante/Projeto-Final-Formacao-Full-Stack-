import { Injectable } from '@angular/core';
import moment from 'moment';

import { USER_KEY } from '../constants/auth';
import { UserInfo } from '../models/users';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  saveLoggedUser(userInfo: UserInfo) {
    localStorage.setItem(USER_KEY, JSON.stringify(userInfo));
  }

  getLoggedUser(): UserInfo | null {
    const loggedUser = localStorage.getItem(USER_KEY);
    if (!loggedUser) return null;
    return JSON.parse(loggedUser);
  }

  clearUser(): void {
    localStorage.removeItem(USER_KEY);
  }

  getExpiration(): moment.Moment | undefined {
    const loggedUser = localStorage.getItem(USER_KEY);

    if (!loggedUser) return;

    const expiresIn = JSON.parse(loggedUser).expiresIn;
    return moment(expiresIn);
  }
}
