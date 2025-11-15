import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment'; 
interface LoginResponse {
  tipo: string;
  data: {
    user_id: number;
    user_email: string;
    user_name: string;
    user_rol: string;
    user_state: string;
    token: {
      token_value: string;
      token_expiration: string;
    };
    store_id: number;
  };
  mensajes: any[];
}


@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private apiUrl = `${environment.apiUrl}/public/rest/common/login`;

  constructor(private http: HttpClient) { }

  /**
   * Autenticar usuario y almacenar credenciales.
   * Lanza error si la respuesta no indica éxito.
   */
  login(email: string, password: string): Observable<LoginResponse> {
    const credentials = {
      user_email: email,
      user_password: password
    };

    return this.http.post<LoginResponse>(this.apiUrl, credentials).pipe(
      tap(response => {
        if (response && response.tipo === '1' && response.data) {
          this.saveAuthData(response.data);
        } else {
          throw new Error(response.mensajes[0] || 'Respuesta inesperada del servidor');
        }
      }),
      catchError(this.handleError)
    );
  }

  private saveAuthData(data: any): void {
    if (data.token) localStorage.setItem('token', data.token);
    if (data.user_name) localStorage.setItem('user_name', data.user_name);
    if (data.user_rol) localStorage.setItem('user_rol', data.user_rol);
    if (data.store_id) localStorage.setItem('store_id', data.store_id.toString());
    if (data.user_id) localStorage.setItem('user_id', data.user_id.toString());
    if (data.user_email) localStorage.setItem('user_email', data.user_email);
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user_name');
    localStorage.removeItem('user_rol');
    localStorage.removeItem('store_id');
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  private handleError(error: HttpErrorResponse) {
    return throwError(() => error);
  }
}