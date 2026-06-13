import { Injectable, signal, WritableSignal, computed } from '@angular/core';
import moment from 'moment';

import { StorageService } from './storage';
import { UserRegister } from '../models/users';
import { UsersService } from './users';

type UserRegisterWithId = Partial<UserRegister> & { _id?: string };

@Injectable({
  providedIn: 'root',
})
export class AuthStateService {
  private readonly userSignal: WritableSignal<UserRegisterWithId | null> = signal(null);
  public readonly loggedUser = this.userSignal.asReadonly();

  public readonly isLoggedIn = computed(() => {
    const loggedUser = this.userSignal();
    if (!loggedUser) return false;
    const expiration = this.storageService.getExpiration();
    return expiration ? moment().isBefore(expiration) : false;
  });

  constructor(
    private readonly storageService: StorageService,
    private readonly usersService: UsersService
  ) {
    this.initFromStorage();
  }

  private initFromStorage(): void {
    const storedUser = this.storageService.getLoggedUser();
    if (storedUser && this.storageService.getExpiration()?.isAfter(moment())) {
      this.loadFullProfile(storedUser._id);
      this.userSignal.update((currentProperties) => ({
        ...currentProperties,
        _id: storedUser._id,
      }));
    }
  }

  private loadFullProfile(userId: string): void {
    this.usersService.getUserData(userId).subscribe({
      next: (profile) => this.userSignal.set(profile),
      error: () => {
        console.error('Failed to load user profile');
        this.userSignal.set(null);
      },
    });
  }

  public setUser(profile: UserRegister): void {
    this.userSignal.set(profile);
  }

  public updateUserProfile(updatedProfile: UserRegister): void {
    this.userSignal.set(updatedProfile);
  }

  public clearUser(): void {
    this.userSignal.set(null);
    this.storageService.clearUser();
  }
}
