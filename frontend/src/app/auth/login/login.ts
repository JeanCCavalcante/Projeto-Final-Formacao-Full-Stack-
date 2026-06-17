import { Component, inject, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { MatDialogRef } from '@angular/material/dialog';

import { Subject, takeUntil } from 'rxjs';

import { AuthService } from '../../services/auth';
import { Register } from '../register/register';
import { UserFormType, UserLogin } from '../../models/users';
import { NotificationService } from '../../services/notification';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login implements OnDestroy {
  private readonly destroy$ = new Subject<void>();

  private readonly authService = inject(AuthService);
  private readonly formBuilder = inject(FormBuilder);
  private readonly notificationService = inject(NotificationService);
  private readonly router = inject(Router);

  private readonly dialogRef = inject(MatDialogRef<Login>);

  protected loginForm: FormGroup = this.formBuilder.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]],
  });

  protected typeGuard(event: UserFormType): void {
    if (event.type === 'login') {
      this.onLogin(event.formValue);
    }
  }

  onLogin(loginData: UserLogin): void {
    if (loginData) {
      this.authService
        .login(loginData.email, loginData.password)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            this.notificationService.showSuccess('Login realizado com sucesso!');
            this.router.navigateByUrl('/tasks');
            this.dialogRef.close();
          },
          error: (error) => {
            const message = this.notificationService.extractErrorMessage(error);
            this.notificationService.showError(message);
          },
        });
    }
  }

  switchAuth(): void {
    this.authService.openAuthModal(Register, this.dialogRef);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
