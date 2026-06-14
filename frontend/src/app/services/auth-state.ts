import { Injectable, signal, WritableSignal, computed } from '@angular/core';
import moment from 'moment';

import { StorageService } from './storage';
import { LoggedUser, UserProfileUpdate } from '../models/users';

@Injectable({ providedIn: 'root' })
export class AuthStateService {
  private readonly userSignal: WritableSignal<LoggedUser | null> = signal(null);

  public readonly loggedUser = this.userSignal.asReadonly();
  public readonly isLoggedIn = computed(() => {
    const expiration = this.storageService.getExpiration();
    return expiration ? moment().isBefore(expiration) : false;
  });

  constructor(private readonly storageService: StorageService) {}

  public setUser(profile: LoggedUser): void {
    this.userSignal.set(profile);
  }

  public updateUserProfile(updatedProfile: UserProfileUpdate): void {
    const currentInfo = this.userSignal();
    if (currentInfo) {
      this.userSignal.set({ ...currentInfo, ...updatedProfile });
    }
  }

  public clearUser(): void {
    this.userSignal.set(null);
    this.storageService.clearUser();
  }
}
