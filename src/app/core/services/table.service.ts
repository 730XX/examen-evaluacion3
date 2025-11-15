import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { TableModel } from '../../core/interfaces/table.interface';

@Injectable({
  providedIn: 'root'
})
export class TableService {

  private url = environment.apiUrl + 'tables';

  constructor(private http: HttpClient) {}

  getTablesByLounge(storeId: number, loungeId: number): Observable<TableModel[]> {
    return this.http.get<TableModel[]>(`${this.url}/${storeId}/${loungeId}`);
  }
}
