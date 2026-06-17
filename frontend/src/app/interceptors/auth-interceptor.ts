import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { StorageService } from '../services/storage';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const loggedUser = inject(StorageService).getLoggedUser();
  const token = loggedUser?.token;

  if (token && req.url.includes('/api/')) {
    const authReq = req.clone({
      setHeaders: { Authorization: `Bearer ${token}` },
    });
    return next(authReq).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 0) {
          console.error('Backend unreachable or timed out');
        }
        return throwError(() => error);
      })
    );
  } else {
    return next(req);
  }
};
