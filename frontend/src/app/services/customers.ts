import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

import { CustomersInfo } from '../models/users';

@Injectable({
  providedIn: 'root',
})
export class CustomersService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'http://localhost:9000';

  fetchCustomers() {
    return this.http.get<CustomersInfo[]>(`${this.apiUrl}/customers`);
  }
}
