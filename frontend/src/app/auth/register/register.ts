import { Component, inject } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';

import { AuthService } from '../../services/auth';
import { UserRegister } from '../../models/users';
import { Login } from '../login/login';

@Component({
  selector: 'app-register',
  standalone: false,
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {
  private readonly dialogRef = inject(MatDialogRef<Register>);

  constructor(private readonly authService: AuthService, private readonly router: Router) {}

  onRegister(userData: UserRegister) {
    if (userData) {
      this.authService.register(userData).subscribe({
        next: () => {
          this.router.navigateByUrl('/account');
          this.dialogRef.close(true);
        },
        error: (error) => console.error('Registration failed', error),
      });
    }
  }

  switchAuth(): void {
    this.authService.openAuthModal(Login, this.dialogRef);
  }
}
