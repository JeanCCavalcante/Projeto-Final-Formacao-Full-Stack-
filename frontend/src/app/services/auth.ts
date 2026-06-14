import { ComponentType } from '@angular/cdk/overlay';
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { jwtDecode } from 'jwt-decode';
import moment from 'moment';
import { catchError, map, Observable, switchMap, take, tap, throwError } from 'rxjs';

import { AUTH_API, AUTH_MODAL_OPTIONS, AUTH_HTTP_OPTIONS } from '../constants/auth';
import {
  AuthLoginResponse,
  AuthRegisterResponse,
  LoggedUser,
  UserInfo,
  UserRegistration,
} from '../models/users';
import { MappingService } from './mapping';
import { StorageService } from './storage';
import { AuthStateService } from './auth-state';
import { UsersService } from './users';
import { Login } from '../auth/login/login';

type CustomJwtPayload = { id: string; exp: number };

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly dialog = inject(MatDialog);

  constructor(
    private readonly authStateService: AuthStateService,
    private readonly mappingService: MappingService,
    private readonly storageService: StorageService,
    private readonly usersService: UsersService
  ) {}

  init(): void {
    if (this.authStateService.isLoggedIn()) {
      this.refreshUserProfile().pipe(take(1)).subscribe();
    } else this.logout();
  }

  openAuthModal(targetModal: ComponentType<any>, currentModal?: MatDialogRef<any>): void {
    if (currentModal) currentModal.close();
    this.dialog.open(targetModal, AUTH_MODAL_OPTIONS);
  }

  login(email: string, password: string): Observable<AuthLoginResponse> {
    return this.http
      .post<AuthLoginResponse>(`${AUTH_API}/auth/login`, { email, password }, AUTH_HTTP_OPTIONS)
      .pipe(
        switchMap((authResponse) => {
          const decodedToken = jwtDecode<CustomJwtPayload>(authResponse.token);
          this.setSession(authResponse, decodedToken);
          return this.refreshUserProfile(decodedToken.id).pipe(map(() => authResponse));
        }),
        catchError((error) => {
          console.error('Login failed:' + error);
          return throwError(() => error);
        })
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
        })
      );
  }

  refreshUserProfile(userId?: string): Observable<LoggedUser> {
    const loggedUserId = userId ?? this.storageService.getLoggedUser()?._id;
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
      })
    );
  }

  logout(): void {
    this.authStateService.clearUser();
    this.openAuthModal(Login);
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
