import { HttpInterceptorFn } from '@angular/common/http';

/**
 * Interceptor funcional que agrega el token como parámetro en la URL.
 * No aplica el token a las peticiones de login.
 */
export const authInterceptorFn: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('token');

  if (req.url.includes('/login')) {
    return next(req);
  }

  if (token) {
    const clonedRequest = req.clone({
      setParams: {
        token: token,
      },
    });
    return next(clonedRequest);
  }

  return next(req);
};