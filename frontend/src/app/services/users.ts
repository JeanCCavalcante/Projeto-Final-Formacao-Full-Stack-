import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

import { AUTH_API, AUTH_HTTP_OPTIONS } from '../constants/auth';
import { BackendUser, LoggedUser, UserProfileUpdate } from '../models/users';
import { Observable, of, switchMap, throwError } from 'rxjs';
import { MappingService } from './mapping';
import { AuthStateService } from './auth-state';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  private readonly http = inject(HttpClient);

  constructor(
    private readonly authStateService: AuthStateService,
    private readonly mappingService: MappingService
  ) {}

  getUserData(id: string): Observable<BackendUser> {
    return this.http.get<BackendUser>(`${AUTH_API}/users/${id}`, AUTH_HTTP_OPTIONS);
  }

  updateUserData(updatedData: UserProfileUpdate): Observable<LoggedUser> {
    const currentUser = this.authStateService.loggedUser();
    const loggedId = currentUser?._id;
    if (!loggedId) {
      return throwError(() => new Error('No user id found'));
    }
    const apiFriendlyUpdate = this.mappingService.toApiFriendlyFormat(updatedData);
    return this.http
      .put<BackendUser>(`${AUTH_API}/users/${loggedId}`, apiFriendlyUpdate, AUTH_HTTP_OPTIONS)
      .pipe(
        switchMap((backendUser) => {
          const fullProfile = this.mappingService.toUserModel(backendUser);
          this.authStateService.updateUserProfile(fullProfile);
          return of(fullProfile);
        })
      );
  }
}
