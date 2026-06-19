import { Component, inject, OnDestroy } from '@angular/core';

import { UserFormType, UserProfileUpdate } from '../../models/users';
import { UsersService } from '../../services/users';
import { AuthStateService } from '../../services/auth-state';
import { NotificationService } from '../../services/notification';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-account',
  standalone: false,
  templateUrl: './account.html',
  styleUrl: './account.css',
})
export class Account implements OnDestroy {
  private readonly destroy$ = new Subject<void>();

  protected loggedUserProfile = inject(AuthStateService).loggedUser;
  private readonly notificationService = inject(NotificationService);
  private readonly usersService = inject(UsersService);

  protected typeGuard(event: UserFormType): void {
    if (event.type === 'profile') {
      this.updateLoggedUserProfile(event.formValue);
    }
  }

  updateLoggedUserProfile(updateData: UserProfileUpdate): void {
    this.usersService
      .updateUserData(updateData)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.notificationService.showSuccess('Informações atualizadas com sucesso!');
        },
        error: (error) => {
          const message = this.notificationService.extractErrorMessage(error);
          this.notificationService.showError(message);
        },
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
