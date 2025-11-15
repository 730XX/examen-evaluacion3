import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Lounge } from '../../core/interfaces/lounge.interface';

@Injectable({
  providedIn: 'root'
})
export class LoungeService {

  private url = environment.apiUrl + 'lounges';

  constructor(private http: HttpClient) {}

  // Obtener todos los salones (POST sin body)
  getLounges(): Observable<Lounge[]> {
    return this.http.post<Lounge[]>(this.url, {});
  }

  // Registrar nuevo salón
  createLounge(data: Lounge): Observable<any> {
    return this.http.post(this.url + '/add', data);
  }

  // Modificar salón (PUT)
  updateLounge(loungeId: number, data: Lounge): Observable<any> {
    return this.http.put(`${this.url}/update/${loungeId}`, data);
  }
}
