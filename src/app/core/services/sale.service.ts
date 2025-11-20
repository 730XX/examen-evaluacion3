import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Sale } from '../interfaces/sale.interface';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SaleService {

  private apiUrl = environment.apiUrl + '/api/rest/sale';

  constructor(private http: HttpClient) {}

  /**
   * Obtiene el informe de ventas
   */
  getSalesByInformes(): Observable<any> {
    return this.http.post(`${this.apiUrl}/getSalesByInformes`, null, {
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
}
