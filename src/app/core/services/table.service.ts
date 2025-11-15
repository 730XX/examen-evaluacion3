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

  getTableeByLoungeId(loungeId: number, esGestion: number = 1): Observable<any> {
    return this.http.get<any>(`${this.url}/getTableeByLoungeId/${loungeId}/${esGestion}`);
  }

  getTableById(tableId: number): Observable<any> {
    return this.http.get<any>(`${this.url}/tablee/${tableId}`);
  }

  getAllTables(): Observable<any> {
    return this.http.get<any>(`${this.url}/getTables`);
  }

  updateTable(data: any): Observable<any> {
    return this.http.put(`${this.url}/tablee`, data);
  }
}
