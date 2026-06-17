import { Component, inject, OnDestroy } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';

import { Subject, takeUntil } from 'rxjs';

import { AuthService } from '../../services/auth';
import { UserFormType, UserRegistration } from '../../models/users';
import { Login } from '../login/login';
import { NotificationService } from '../../services/notification';

@Component({
  selector: 'app-register',
  standalone: false,
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register implements OnDestroy {
  private readonly destroy$ = new Subject<void>();

  private readonly authService = inject(AuthService);
  private readonly notificationService = inject(NotificationService);
  private readonly router = inject(Router);

  private readonly dialogRef = inject(MatDialogRef<Register>);

  protected typeGuard(event: UserFormType): void {
    if (event.type === 'register') {
      this.onRegister(event.formValue);
    }
  }

  onRegister(registerData: UserRegistration) {
    if (registerData) {
      this.authService
        .register(registerData)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            this.notificationService.showSuccess('Cadastro realizado com sucesso!');
            this.router.navigateByUrl('/account');
            this.dialogRef.close(true);
          },
          error: (error) => {
            const message = this.notificationService.extractErrorMessage(error);
            this.notificationService.showError(message);
          },
        });
    }
  }

  switchAuth(): void {
    this.authService.openAuthModal(Login, this.dialogRef);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
