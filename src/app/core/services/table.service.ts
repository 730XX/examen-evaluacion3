import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { TableModel } from '../../core/interfaces/table.interface';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class TableService {
  private url = environment.apiUrl + '/api/rest/tablee';

  constructor(private http: HttpClient, private authService: AuthService) {}

  // Obtener mesas por salón
  getTableeByLoungeId(loungeId: number, esGestion: number = 1): Observable<any> {
    // El interceptor agregará el token automáticamente
    return this.http.get<any>(`${this.url}/getTableeByLoungeId/${loungeId}/${esGestion}`);
  }

  // Obtener mesa por ID
  getTableById(tableId: number): Observable<any> {
    // El interceptor agregará el token automáticamente
    return this.http.get<any>(`${this.url}/tablee/${tableId}`);
  }

  // Obtener todas las mesas
  getAllTables(): Observable<any> {
    // El interceptor agregará el token automáticamente
    return this.http.get<any>(`${this.url}/getTables`);
  }

  // Actualizar/Editar mesa
  updateTable(data: any): Observable<any> {
    // El interceptor agregará el token automáticamente
    return this.http.put(`${this.url}/tablee`, data);
  }
}
