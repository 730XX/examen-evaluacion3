import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Lounge } from '../../core/interfaces/lounge.interface';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class LoungeService {
  private url = environment.apiUrl + '/api/rest/lounge';

  constructor(private http: HttpClient, private authService: AuthService) {}

  getLounges(lounge_name?: string, store_id?: number): Observable<any> {
    const storeId = store_id || this.authService.getStoreId() || 1;
    
    // El interceptor agregará el token automáticamente
    let params = new HttpParams().set('store_id', storeId.toString());
    
    if (lounge_name) {
      params = params.set('lounge_name', lounge_name);
    }
    
    console.log('getLounges - Params:', params.toString());
    
    // Usar POST con parámetros en la URL (el interceptor agregará el token)
    return this.http.post<any>(`${this.url}/getLounges`, null, { params });
  }
  
  // Crear nuevo salón (POST)
  createLounge(data: any): Observable<any> {
    
    return this.http.post(`${this.url}/lounge`, data);
  }

  // Actualizar salón (PUT)
  updateLounge(data: any): Observable<any> {
    
    return this.http.put(`${this.url}/lounge`, data);
  }
}
