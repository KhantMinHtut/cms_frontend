import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root',
})
export class PaymentService {
  private apiUrl = 'https://cms-api-nk80.onrender.com/api/cms';
  // private apiUrl = 'http://localhost:8080/api/cms';

  constructor(private http: HttpClient, private api: ApiService) {}

  createPayment(paymentReq: any): Observable<any> {
    // return this.http.post(`${this.apiUrl}/payment/create-payment`, paymentReq);
    return this.api.post(`${this.apiUrl}/payment/create-payment`, paymentReq);
  }

  getPaymentByDate(startDate: String, endDate: String): Observable<any> {
    // return this.http.get(
    //   `${this.apiUrl}/payment/getpaymentbydate?startDate=${startDate}&endDate=${endDate}`
    // );
    return this.api.get(
      `${this.apiUrl}/payment/getpaymentbydate?startDate=${startDate}&endDate=${endDate}`
    );
  }

  getOnePayment(id: String): Observable<any> {
    // return this.http.get(`${this.apiUrl}/payment/get-one-payment/${id}`);
    return this.api.get(`${this.apiUrl}/payment/get-one-payment/${id}`);
  }
}
