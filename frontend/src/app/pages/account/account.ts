import { Component, inject } from '@angular/core';

import { UserRegister } from '../../models/users';
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

  constructor(
    private readonly authStateService: AuthStateService,
    private readonly usersService: UsersService
  ) {}

  updateLoggedUserProfile(updatedData: UserRegister): void {
    const userId = this.authStateService.loggedUser()?._id;
    this.usersService.updateUserData(userId, updatedData).subscribe({
      error: (error) => console.error(error.error),
    });
  }
}
