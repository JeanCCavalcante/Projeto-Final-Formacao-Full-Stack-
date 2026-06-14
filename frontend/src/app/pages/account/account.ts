import { Component, inject } from '@angular/core';

import { UserProfileUpdate } from '../../models/users';
import { UsersService } from '../../services/users';
import { AuthStateService } from '../../services/auth-state';

@Component({
  selector: 'app-account',
  standalone: false,
  templateUrl: './account.html',
  styleUrl: './account.css',
})
export class Account {
  protected loggedUserProfile = inject(AuthStateService).loggedUser;

  constructor(private readonly usersService: UsersService) {}

  updateLoggedUserProfile(updatedData: UserProfileUpdate): void {
    this.usersService.updateUserData(updatedData).subscribe({
      error: (error) => console.error(error.error),
    });
  }
}
