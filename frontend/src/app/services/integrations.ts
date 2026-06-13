import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

import { Application } from '../models/users';

@Injectable({
  providedIn: 'root',
})
export class IntegrationsService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'http://localhost:9000';

  fetchIntegrations() {
    return this.http.get<Application[]>(`${this.apiUrl}/integrations`);
  }

  fetchIntegrationsByUser(id: number) {
    return this.http.get<number[]>(`${this.apiUrl}/users/${id}/integrations`);
  }
}
