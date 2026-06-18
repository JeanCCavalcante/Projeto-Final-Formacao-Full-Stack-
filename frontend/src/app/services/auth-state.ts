import { Injectable, signal, WritableSignal, computed, inject } from '@angular/core';

import { StorageService } from './storage';
import { LoggedUser, UserProfileUpdate } from '../models/users';
import { RoleEnum } from '../enums/select-mapping';

@Injectable({ providedIn: 'root' })
export class AuthStateService {
  private readonly storageService = inject(StorageService);

  private readonly userSignal: WritableSignal<LoggedUser | null> = signal(null);

  public readonly loggedUser = this.userSignal.asReadonly();
  public readonly isLoggedIn = computed(() => {
    const expiration = this.storageService.getExpiration();
    return expiration ? Date.now() < expiration : false;
  });

  public readonly isMentor = computed(() => this.loggedUser()?.role === RoleEnum.MENTOR);

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
