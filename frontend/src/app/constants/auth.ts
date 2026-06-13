import { HttpHeaders } from '@angular/common/http';

export const USER_KEY = 'auth-user';
export const AUTH_API = 'http://localhost:5000';
export const AUTH_HTTP_OPTIONS = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
};
export const AUTH_MODAL_OPTIONS = {
  backdropClass: 'auth-modal',
  disableClose: true,
  height: '90vh',
  width: '60vw',
};
