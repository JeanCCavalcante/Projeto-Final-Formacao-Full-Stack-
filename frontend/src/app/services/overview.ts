import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

import { OverviewInfo, SalesInfo, LatestOrder, LatestProduct } from '../models/users';

@Injectable({
  providedIn: 'root',
})
export class OverviewService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'http://localhost:9000';

  fetchOverviewInfo() {
    return this.http.get<OverviewInfo>(`${this.apiUrl}/overview`);
  }

  fetchSalesInfo() {
    return this.http.get<SalesInfo>(`${this.apiUrl}/sales`);
  }

  fetchOrders(limit: number) {
    return this.http.get<LatestOrder[]>(`${this.apiUrl}/orders?limit=${limit}`);
  }

  fetchProducts(limit: number) {
    return this.http.get<LatestProduct[]>(`${this.apiUrl}/products?limit=${limit}`);
  }
}
