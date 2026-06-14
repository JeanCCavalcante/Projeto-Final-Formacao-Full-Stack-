import { HttpInterceptorFn } from '@angular/common/http';
import { USER_KEY } from '../constants/auth';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const userData = localStorage.getItem(USER_KEY);
  let token = null;

  if (userData) {
    try {
      const parsedData = JSON.parse(userData);
      token = parsedData.token;
    } catch (error) {
      console.error('Failed to parse auth-user:' + error);
    }
  }

  if (token) {
    const cloned = req.clone({
      headers: req.headers.set('Authorization', 'Bearer ' + token),
      withCredentials: true,
    });
    return next(cloned);
  } else {
    return next(req);
  }
};
