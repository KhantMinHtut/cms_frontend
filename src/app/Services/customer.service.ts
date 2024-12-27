import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CustomerService {
  private apiUrl = 'https://cms-api-nk80.onrender.com/api/cms';

  constructor(private http: HttpClient) {}

  createCustomer(customer: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/customer/register`, customer);
  }

  getAllCutomers(): Observable<any> {
    return this.http.get(`${this.apiUrl}/customer/all-customer`);
  }

  getCustomersByDate(startDate: String, endDate: String): Observable<any> {
    return this.http.get(
      `${this.apiUrl}/customer/getcustomersbydate?startDate=${startDate}&endDate=${endDate}`
    );
  }

  getOneCustomer(id: String): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/customer/info/${id}`);
  }

  getPaginatedCustomers(
    currentPage: number,
    pageSize: number
  ): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}/customer/paginated-customers?page=${currentPage}&pageSize=${pageSize}`
    );
  }

  updatedCustomer(id: any, data: any): Observable<any> {
    return this.http.patch(
      `${this.apiUrl}/customer/update-customer/${id}`,
      data
    );
  }

  deleteOneCustomer(id: any): Observable<any> {
    return this.http.delete(
      `${this.apiUrl}/customer/delete-one-customer/${id}`
    );
  }
}
