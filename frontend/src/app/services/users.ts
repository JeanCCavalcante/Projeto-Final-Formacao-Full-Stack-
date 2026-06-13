import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

import { AUTH_API, AUTH_HTTP_OPTIONS } from '../constants/auth';
import { UserRegister } from '../models/users';
import { Observable, tap } from 'rxjs';
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

  getUserData(id: string | undefined): Observable<UserRegister> {
    return this.http.get<UserRegister>(`${AUTH_API}/users/${id}`, AUTH_HTTP_OPTIONS);
  }

  updateUserData(
    id: string | undefined,
    updatedData: UserRegister
  ): Observable<Partial<UserRegister>> {
    const apiFriendlyUpdate = this.mappingService.toApiFriendlyFormat(updatedData);

    return this.http
      .put<UserRegister>(`${AUTH_API}/users/${id}`, apiFriendlyUpdate, AUTH_HTTP_OPTIONS)
      .pipe(tap({ next: () => this.authStateService.updateUserProfile(updatedData) }));
  }
}
