import { ComponentType } from '@angular/cdk/overlay';
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { jwtDecode } from 'jwt-decode';
import moment from 'moment';
import { catchError, map, Observable, switchMap, tap, throwError } from 'rxjs';

import { AUTH_API, AUTH_MODAL_OPTIONS, AUTH_HTTP_OPTIONS } from '../constants/auth';
import { AuthLoginResponse, AuthRegisterResponse, UserInfo, UserRegister } from '../models/users';
import { MappingService } from './mapping';
import { StorageService } from './storage';
import { AuthStateService } from './auth-state';
import { UsersService } from './users';

type CustomJwtPayload = { id: string; exp: number };

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly dialog = inject(MatDialog);

  constructor(
    private readonly mappingService: MappingService,
    private readonly storageService: StorageService,
    private readonly authStateService: AuthStateService,
    private readonly usersService: UsersService
  ) {}

  login(email: string, password: string): Observable<AuthLoginResponse> {
    return this.http
      .post<AuthLoginResponse>(`${AUTH_API}/api/auth/login`, { email, password }, AUTH_HTTP_OPTIONS)
      .pipe(
        switchMap((authResponse) => {
          const decodedToken = jwtDecode<CustomJwtPayload>(authResponse.token);
          this.setSession(authResponse, decodedToken);

          return this.usersService.getUserData(decodedToken.id).pipe(
            tap((fullProfile) => {
              const userProfile = this.mappingService.toUserModel(fullProfile);
              this.authStateService.setUser(userProfile);
            }),
            map(() => authResponse)
          );
        }),
        catchError((error) => {
          console.error('Login failed:', error);
          return throwError(() => error);
        })
      );
  }

  register(registerForm: UserRegister): Observable<AuthLoginResponse> {
    const apiFriendlyUser = this.mappingService.toApiFriendlyFormat(registerForm);
    return this.http
      .post<AuthRegisterResponse>(
        `${AUTH_API}/api/auth/register`,
        apiFriendlyUser,
        AUTH_HTTP_OPTIONS
      )
      .pipe(
        switchMap(() => this.login(registerForm.email, registerForm.password)),
        catchError((error) => {
          console.error('Registration failed');
          return throwError(() => error);
        })
      );
  }

  logout(): void {
    this.authStateService.clearUser();
  }

  isLoggedIn(): boolean {
    return this.authStateService.isLoggedIn();
  }

  openAuthModal(targetModal: ComponentType<any>, currentModal?: MatDialogRef<any>): void {
    if (currentModal) currentModal.close();
    this.dialog.open(targetModal, AUTH_MODAL_OPTIONS);
  }

  private setSession(authResult: AuthLoginResponse, decodedToken: CustomJwtPayload): void {
    try {
      if (!decodedToken.exp) {
        throw new Error('Invalid token (no expiration)');
      }

      const sessionInfo: UserInfo = {
        _id: decodedToken.id,
        token: authResult.token,
        expiresIn: moment.unix(decodedToken.exp).valueOf(),
        user: {
          name: authResult.user.name,
          email: authResult.user.email,
          papel: authResult.user.papel,
        },
      };

      this.storageService.saveLoggedUser(sessionInfo);
    } catch (error) {
      console.error(error);
    }
  }
}
