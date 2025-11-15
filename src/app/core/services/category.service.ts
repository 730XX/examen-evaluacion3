import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private apiUrl = environment.apiUrl + '/api/rest/category';

  constructor(private http: HttpClient) {}

  getCategories(
    category_name?: string,
    category_categoryid?: number,
    isGestion?: string,
    isPadre?: string
  ): Observable<any> {
    let params = new HttpParams();
    
    if (category_name) params = params.set('category_name', category_name);
    if (category_categoryid !== undefined) params = params.set('category_categoryid', category_categoryid.toString());
    if (isGestion) params = params.set('isGestion', isGestion);
    if (isPadre) params = params.set('isPadre', isPadre);

    return this.http.post<any>(`${this.apiUrl}/getCategories`, null, { params });
  }

  getCategoryById(categoryId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/category/${categoryId}`);
  }

  createCategory(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/category`, data);
  }

  updateCategory(data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/category`, data);
  }
}
