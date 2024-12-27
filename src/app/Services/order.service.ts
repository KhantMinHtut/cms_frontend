import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  private apiUrl = 'https://cms-api-nk80.onrender.com/api/cms';

  constructor(private http: HttpClient) {}

  getOrders(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/order/get-all-orders `);
  }

  getSortDate(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/order/get-sort-dates`);
  }

  getOrdersByDate(startDate: any, endDate: any): Observable<any> {
    return this.http.get(
      `${this.apiUrl}/order/getordersbydate?startDate=${startDate}&endDate=${endDate}`
    );
  }

  getPaginateOrders(page: number, pageSize: number): Observable<any> {
    return this.http.get(
      `${this.apiUrl}/order/paginate-orders?page=${page}&pageSize=${pageSize}`
    );
  }

  getOrderDetails(startDate: any, endDate: any): Observable<any> {
    return this.http.get(
      `${this.apiUrl}/order/orderDetails/get-orderDetails?startDate=${startDate}&endDate=${endDate}`
    );
  }

  getOneOrderDetail(id: any): Observable<any> {
    return this.http.get(
      `${this.apiUrl}/order/orderDetails/orderDetailPopulate/${id}`
    );
  }

  deletedOrder(id: String): Observable<any> {
    return this.http.delete(`${this.apiUrl}/order/deleted-order/${id}`);
  }

  deletedOrderDetails(id: String): Observable<any> {
    return this.http.delete(
      `${this.apiUrl}/order/orderDetails/deleted-orderDetails/${id}`
    );
  }
}
