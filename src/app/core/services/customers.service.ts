import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Customer } from '../interfaces/customer.interface';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CustomersService {

  private apiUrl = environment.apiUrl + '/api/rest/customer';

  constructor(private http: HttpClient) {}

  // Obtener todos los clientes (POST con parámetros en URL)
  getCustomers(
    page: string = '-1',
    perPage: string = '-1',
    customer_name: string = '-1',
    customer_typedocument: string = '-1',
    customer_state: string = '1'
  ): Observable<any> {
    // El interceptor agregará el token automáticamente
    let params = new HttpParams()
      .set('page', page)
      .set('perPage', perPage)
      .set('customer_name', customer_name)
      .set('customer_typedocument', customer_typedocument)
      .set('customer_state', customer_state);

    return this.http.post<any>(`${this.apiUrl}/getCustomers`, null, { params });
  }

  // Crear cliente (POST)
  createCustomer(customer: any): Observable<any> {
    // El interceptor agregará el token automáticamente
    return this.http.post(`${this.apiUrl}/customer`, customer);
  }

  // Actualizar cliente (PUT)
  updateCustomer(customer: any): Observable<any> {
    // El interceptor agregará el token automáticamente
    return this.http.put(`${this.apiUrl}/customer`, customer);
  }
}
