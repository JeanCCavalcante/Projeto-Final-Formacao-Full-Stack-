import { ComponentType } from '@angular/cdk/overlay';
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';

import { catchError, map, Observable, switchMap, take, tap, throwError } from 'rxjs';

import { MatDialog, MatDialogRef } from '@angular/material/dialog';

import { Login } from '../auth/login/login';
import { AUTH_API, AUTH_HTTP_OPTIONS } from '../constants/auth';
import { MODAL_OPTIONS } from '../constants/modal';
import {
  AuthLoginResponse,
  AuthRegisterResponse,
  DecodedUser,
  LoggedUser,
  UserRegistration,
} from '../models/users';
import { AuthStateService } from './auth-state';
import { MappingService } from './mapping';
import { StorageService } from './storage';
import { UsersService } from './users';

type CustomJwtPayload = { id: string; exp: number };

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly authStateService = inject(AuthStateService);
  private readonly http = inject(HttpClient);
  private readonly mappingService = inject(MappingService);
  private readonly router = inject(Router);
  private readonly storageService = inject(StorageService);
  private readonly usersService = inject(UsersService);

  private readonly dialog = inject(MatDialog);

  init(): void {
    try {
      if (this.authStateService.isLoggedIn()) {
        this.refreshUserProfile().pipe(take(1)).subscribe();
      } else this.logout();
    } catch (error) {
      console.error(error);
    }
  }

  openAuthModal(targetModal: ComponentType<any>, currentModal?: MatDialogRef<any>): void {
    if (currentModal) currentModal.close();
    this.dialog.open(targetModal, MODAL_OPTIONS);
  }

  login(email: string, password: string): Observable<AuthLoginResponse> {
    return this.http
      .post<AuthLoginResponse>(`${AUTH_API}/auth/login`, { email, password }, AUTH_HTTP_OPTIONS)
      .pipe(
        switchMap((authResponse) => {
          const decodedToken = jwtDecode<CustomJwtPayload>(authResponse.token);
          const userId = authResponse.user.user_id ?? decodedToken.id;

          if (!userId) {
            return throwError(() => new Error('Missing user id after login'));
          }

          this.setSession(authResponse, decodedToken, userId);
          return this.refreshUserProfile(userId).pipe(map(() => authResponse));
        }),
        catchError((error) => {
          console.error('Login failed:' + error);
          return throwError(() => error);
        }),
      );
  }

  register(registerForm: UserRegistration): Observable<AuthLoginResponse> {
    const apiFriendlyUser = this.mappingService.toApiFriendlyFormat(registerForm);
    return this.http
      .post<AuthRegisterResponse>(`${AUTH_API}/auth/register`, apiFriendlyUser, AUTH_HTTP_OPTIONS)
      .pipe(
        switchMap(() => this.login(registerForm.email, registerForm.password)),
        catchError((error) => {
          console.error('Registration failed:' + error);
          return throwError(() => error);
        }),
      );
  }

  refreshUserProfile(userId?: string): Observable<LoggedUser> {
    const loggedUserId =
      userId ?? this.authStateService.loggedUser()?._id ?? this.storageService.getLoggedUser()?._id;

    if (!loggedUserId) {
      return throwError(() => new Error('No user ID available'));
    }

    return this.usersService.getUserData(loggedUserId).pipe(
      map((backendUser) => this.mappingService.toUserModel(backendUser)),
      tap((fullProfile) => this.authStateService.setUser(fullProfile)),
      catchError((error) => {
        console.error('Failed to refresh user profile', error);
        this.logout();
        return throwError(() => error);
      }),
    );
  }

  logout(): void {
    this.router.navigateByUrl('/');
    this.authStateService.clearUser();
    this.openAuthModal(Login);
  }

  private setSession(
    authResult: AuthLoginResponse,
    decodedToken: CustomJwtPayload,
    fallbackId: string,
  ): void {
    try {
      if (!decodedToken.exp) {
        throw new Error('Invalid token (no expiration)');
      }

      const sessionInfo: DecodedUser = {
        _id: decodedToken.id,
        token: authResult.token,
        expiresIn: decodedToken.exp * 1000,
        user: {
          user_id: fallbackId,
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
