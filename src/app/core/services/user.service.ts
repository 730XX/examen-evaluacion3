import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { User } from '../interfaces/user.interface';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private apiUrl = environment.apiUrl + '/api/rest/user';

  constructor(private http: HttpClient) {}

  /**
   * Obtiene la lista de usuarios con filtros opcionales
   */
  getUsers(
    page: string = '-1',
    perPage: string = '-1',
    user_name: string = '-1',
    user_email: string = '-1',
    user_state: string = '-1'
  ): Observable<any> {
    let params = new HttpParams()
      .set('page', page)
      .set('perPage', perPage)
      .set('user_name', user_name)
      .set('user_email', user_email)
      .set('user_state', user_state);

    return this.http.post(`${this.apiUrl}/listByFilters`, null, { 
      params, 
      responseType: 'text' 
    }).pipe(
      map((response: string) => {
        // Limpiar el HTML/warning de PHP que viene en la respuesta
        const jsonStart = response.indexOf('{');
        const jsonEnd = response.lastIndexOf('}') + 1;
        
        if (jsonStart !== -1 && jsonEnd > jsonStart) {
          const cleanJson = response.substring(jsonStart, jsonEnd);
          return JSON.parse(cleanJson);
        }
        
        // Si no encontramos JSON válido, intentar parsear directamente
        return JSON.parse(response);
      })
    );
  }

  /**
   * Crea un nuevo usuario
   */
  createUser(user: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/user`, user);
  }

  /**
   * Actualiza un usuario existente
   */
  updateUser(user: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/user`, user);
  }
}
