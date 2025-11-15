import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiUrl = environment.apiUrl + '/api/rest/product';

  constructor(private http: HttpClient) {}

  getProducts(
    product_name?: string,
    product_categoryid?: string,
    category_id?: string,
    category_name?: string,
    subcategory_id?: string,
    subcategory_name?: string
  ): Observable<any> {
    let params = new HttpParams();
    
    if (product_name) params = params.set('product_name', product_name);
    if (product_categoryid) params = params.set('product_categoryid', product_categoryid);
    if (category_id) params = params.set('category_id', category_id);
    if (category_name) params = params.set('category_name', category_name);
    if (subcategory_id) params = params.set('subcategory_id', subcategory_id);
    if (subcategory_name) params = params.set('subcategory_name', subcategory_name);

    return this.http.post<any>(`${this.apiUrl}/getProducts`, null, { params });
  }

  createProduct(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/product`, data);
  }

  updateProduct(data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/product`, data);
  }
}
