import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PaymentService {
  private apiUrl = 'https://cms-api-nk80.onrender.com/api/cms';

  constructor(private http: HttpClient) {}

  getPaymentByDate(startDate: String, endDate: String): Observable<any> {
    return this.http.get(
      `${this.apiUrl}/payment/getpaymentbydate?startDate=${startDate}&endDate=${endDate}`
    );
  }

  getOnePayment(id: String): Observable<any> {
    return this.http.get(`${this.apiUrl}/payment/get-one-payment/${id}`);
  }
}
