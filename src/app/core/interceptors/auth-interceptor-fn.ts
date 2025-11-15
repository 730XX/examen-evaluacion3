import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptorFn: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('token');

  // No agregar token a las peticiones de login
  if (req.url.includes('/login')) {
    return next(req);
  }

  if (token) {
    // Agregar token como parámetro en la URL
    const clonedRequest = req.clone({
      setParams: {
        token: token,
      },
    });
    console.log('Token agregado a URL:', clonedRequest.urlWithParams);
    return next(clonedRequest);
  }

  return next(req);
};