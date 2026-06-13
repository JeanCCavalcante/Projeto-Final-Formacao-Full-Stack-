import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth';
import { MatDialogRef } from '@angular/material/dialog';
import { Register } from '../register/register';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  private readonly dialogRef = inject(MatDialogRef<Login>);

  protected loginForm: FormGroup;

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly authService: AuthService,
    private readonly router: Router
  ) {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
    });
  }

  onLogin(form: FormGroup): void {
    if (form.valid) {
      this.authService.login(form.value.email, form.value.password).subscribe({
        next: () => {
          this.router.navigateByUrl('/overview');
          this.dialogRef.close();
        },
        error: (error) => console.error('Login failed'),
      });
    }
  }

  switchAuth(): void {
    this.authService.openAuthModal(Register, this.dialogRef);
  }
}
