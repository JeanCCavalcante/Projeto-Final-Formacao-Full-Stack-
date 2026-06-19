// services/analytics.service.ts
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { AnalyticsResponse } from '../models/analytics';
import { METRICS_URI } from '../constants/auth';

@Injectable({ providedIn: 'root' })
export class AnalyticsService {
  private readonly http = inject(HttpClient);

  getAnalytics(): Observable<AnalyticsResponse> {
    return this.http.get<AnalyticsResponse>(`${METRICS_URI}/metrics`);
  }
}
