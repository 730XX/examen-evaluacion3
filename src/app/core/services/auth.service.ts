import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { LoginRequest, LoginResponse } from '../../core/interfaces/auth.ointerface';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = environment.apiUrl + '/public/rest/common/login';

  constructor(private http: HttpClient, private router: Router) {}

  login(credentials: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(this.apiUrl, credentials).pipe(
      tap((response) => {
        if (response.tipo === '1' && response.data && response.data.token) {
          localStorage.setItem('token', response.data.token);
          localStorage.setItem('user_name', response.data.user_name);
          localStorage.setItem('user_rol', response.data.user_rol);
          localStorage.setItem('user_id', response.data.user_id);
          localStorage.setItem('store_id', response.data.user_uid);
        }
      })
    );
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user_name');
    localStorage.removeItem('user_rol');
    localStorage.removeItem('store_id');
    this.router.navigate(['/login']);
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('token');
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  getUserName(): string | null {
    return localStorage.getItem('user_name');
  }

  getUserRole(): string | null {
    return localStorage.getItem('user_rol');
  }

  getStoreId(): number | null {
    const storeId = localStorage.getItem('store_id');
    return storeId ? parseInt(storeId, 10) : null;
  }
}