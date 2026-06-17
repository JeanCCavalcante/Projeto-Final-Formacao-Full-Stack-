import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

import { Observable, of, switchMap } from 'rxjs';

import { AUTH_API, AUTH_HTTP_OPTIONS } from '../constants/auth';
import { BackendUser, LoggedUser, UserProfileUpdate } from '../models/users';
import { AuthStateService } from './auth-state';
import { MappingService } from './mapping';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  private readonly authStateService = inject(AuthStateService);
  private readonly http = inject(HttpClient);
  private readonly mappingService = inject(MappingService);

  getUserData(id: string): Observable<BackendUser> {
    return this.http.get<BackendUser>(`${AUTH_API}/users/${id}`, AUTH_HTTP_OPTIONS);
  }

  updateUserData(updatedData: UserProfileUpdate): Observable<LoggedUser> {
    const loggedId = this.authStateService.loggedUser()?._id;

    const apiFriendlyUpdate = this.mappingService.toApiFriendlyFormat(updatedData);
    return this.http
      .put<BackendUser>(`${AUTH_API}/users/${loggedId}`, apiFriendlyUpdate, AUTH_HTTP_OPTIONS)
      .pipe(
        switchMap((backendUser) => {
          const fullProfile = this.mappingService.toUserModel(backendUser);
          this.authStateService.updateUserProfile(fullProfile);
          return of(fullProfile);
        }),
      );
  }
}
