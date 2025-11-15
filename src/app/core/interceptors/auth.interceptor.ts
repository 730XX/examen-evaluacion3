import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class AuthInterceptor  implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = localStorage.getItem('token');

    console.log('Interceptor - Token:', token);
    console.log('Interceptor - URL:', req.url);

    if (token) {
      const clonedRequest = req.clone({
        setHeaders: {
          Authorization: token, // Enviar solo el token sin "Bearer"
          'Content-Type': 'application/json',
        },
      });
      console.log('Interceptor - Headers agregados:', clonedRequest.headers.get('Authorization'));
      return next.handle(clonedRequest);
    }

    console.log('Interceptor - No hay token, petición sin autorización');
    return next.handle(req);
  }
}
