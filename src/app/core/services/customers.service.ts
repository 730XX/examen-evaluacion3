import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Customer } from '../interfaces/customer.interface';

@Injectable({
  providedIn: 'root'
})
export class CustomersService {

  private API_URL = 'http://localhost/restaurante-api/customers';

  constructor(private http: HttpClient) {}

  // Obtener todos los clientes (POST)
  getCustomers(): Observable<Customer[]> {
    return this.http.post<Customer[]>(`${this.API_URL}`, {});
  }

  // Agregar un cliente (POST)
  addCustomer(customer: Customer): Observable<any> {
    return this.http.post(`${this.API_URL}/add`, customer);
  }

  // Actualizar cliente (PUT)
  updateCustomer(id: string | number, customer: Partial<Customer>): Observable<any> {
    return this.http.put(`${this.API_URL}/update/${id}`, customer);
  }
}
