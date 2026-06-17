import { HttpHeaders } from '@angular/common/http';

export const USER_KEY = 'auth-user';
export const AUTH_API = 'http://localhost:5000/api';
export const AUTH_HTTP_OPTIONS = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
};
