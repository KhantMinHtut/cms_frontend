import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, retry } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class CoffeeService {
  private apiUrl = 'https://cms-api-nk80.onrender.com/api/cms';

  // public userEditPage: Boolean = false;

  constructor(
    private http: HttpClient,
    private cookieService: CookieService,
    private router: Router
  ) {}
  private getHeaders(): HttpHeaders {
    const token = this.cookieService.get('access_token') || '';
    return new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    });
  }

  backBtn() {
    this.router.navigate(['/login']);
  }

  login(credentials: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/employee/login`, credentials);
  }
  logout() {
    this.cookieService.delete('email');
    this.cookieService.delete('access_token');
    this.router.navigate(['/login']);
  }
  register(customer: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/customer/register`, customer);
  }

  //======================================Suppliers============================

  getSuppliers(): Observable<any> {
    return this.http.get(`${this.apiUrl}/supplier/all-suppliers`);
  }

  getPaginatedSuppliers(page: number, pageSize: number): Observable<any> {
    return this.http.get(
      `${this.apiUrl}/supplier/pagination-suppliers?page=${page}&pageSize=${pageSize}`
    );
  }

  getSupplier(id: any): Observable<any> {
    return this.http.get(`${this.apiUrl}/supplier/${id}`);
  }

  createdSupplier(data: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/supplier/create`, data);
  }

  updatedSupplier(id: String, data: any): Observable<any> {
    return this.http.patch<any>(
      `${this.apiUrl}/supplier/updated-supplier/${id}`,
      data
    );
  }

  deletedSupplier(id: String): Observable<any> {
    return this.http.delete<any>(
      `${this.apiUrl}/supplier/deleted-supplier/${id}`
    );
  }

  //========================================Products===================================

  getProducts(): Observable<any> {
    return this.http.get(`${this.apiUrl}/product/all-products`);
  }

  getPaginationProducts(page: number, pageSize: number): Observable<any> {
    return this.http.get(
      `${this.apiUrl}/product?page=${page}&pageSize=${pageSize}`
    );
  }

  createProduct(product: any): Observable<any> {
    const suppliesId: String[] = [];

    product.suppliers.forEach((supplier: any) => {
      suppliesId.push(supplier.item_id);
    });
    console.log(suppliesId.join(','));

    const data = new FormData();
    data.append('name', product.name);
    data.append('description', product.description);
    data.append('price', product.price);
    data.append('stock_quantity', product.quantity);
    data.append('discount', product.discount);
    data.append('reorderlevel', product.reorderlevel);
    data.append('origin', product.origin);
    data.append('category', product.category);
    data.append('ingredients', product.ingredients);
    data.append('suppliers', suppliesId.join(','));
    data.append('image', product.image_url, product.image_url.name);

    return this.http.post(`${this.apiUrl}/product/create`, data);
  }

  updateProduct(id: any, product: any) {
    const suppliesId: String[] = [];

    product.suppliers.forEach((supplier: any) => {
      suppliesId.push(supplier.item_id);
    });
    console.log(suppliesId.join(','));
    console.log(product);
    const data = new FormData();
    data.append('name', product.name);
    data.append('description', product.description);
    data.append('price', product.price);
    data.append('stock_quantity', product.quantity);
    data.append('discount', product.discount);
    data.append('reorderlevel', product.reorderlevel);
    data.append('origin', product.origin);
    data.append('category', product.category);
    data.append('ingredients', product.ingredients);
    data.append('suppliers', suppliesId.join(','));
    // data.append('image', product.image_url, product.image_url.name);

    if (typeof product.image_url == 'string') {
      console.log(product.image_url);
      data.append('url', product.image_url);
    } else {
      data.append('image', product.image_url, product.image_url.name);
    }
    console.log(`FormDAta is ${data.get('stock_quantity')}`);
    return this.http.patch(`${this.apiUrl}/product/update-product/${id}`, data);
  }

  deleteOneProduct(id: String): Observable<any> {
    return this.http.delete(`${this.apiUrl}/product/delete-one-product/${id}`);
  }
}
