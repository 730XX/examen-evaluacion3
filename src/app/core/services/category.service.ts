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

  // Obtener categorías/subcategorías (POST con parámetros en URL)
  getCategories(
    category_name?: string,
    category_categoryid?: number,
    isGestion?: string,
    isPadre?: string
  ): Observable<any> {
    // El interceptor agregará el token automáticamente
    let params = new HttpParams();
    
    if (category_name) params = params.set('category_name', category_name);
    if (category_categoryid !== undefined) params = params.set('category_categoryid', category_categoryid.toString());
    if (isGestion) params = params.set('isGestion', isGestion);
    if (isPadre) params = params.set('isPadre', isPadre);

    return this.http.post<any>(`${this.apiUrl}/getCategories`, null, { params });
  }

  // Obtener categoría por ID (GET)
  getCategoryById(categoryId: number): Observable<any> {
    // El interceptor agregará el token automáticamente
    return this.http.get<any>(`${this.apiUrl}/category/${categoryId}`);
  }

  // Crear categoría/subcategoría (POST)
  createCategory(data: any): Observable<any> {
    // El interceptor agregará el token automáticamente
    return this.http.post(`${this.apiUrl}/category`, data);
  }

  // Actualizar categoría/subcategoría (PUT)
  updateCategory(data: any): Observable<any> {
    // El interceptor agregará el token automáticamente
    return this.http.put(`${this.apiUrl}/category`, data);
  }
}
