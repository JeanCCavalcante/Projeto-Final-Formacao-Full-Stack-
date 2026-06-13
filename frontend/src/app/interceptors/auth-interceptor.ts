import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const idToken = localStorage.getItem('focus_id_token');

  if (idToken) {
    const cloned = req.clone({
      headers: req.headers.set('Authorization', 'Bearer ' + idToken),
      withCredentials: true,
    });

    return next(cloned);
  } else {
    return next(req);
  }
};
