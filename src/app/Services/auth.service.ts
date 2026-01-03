import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'https://cms-api-nk80.onrender.com/api/cms';
  // private apiUrl = 'http://localhost:8080/api/cms';

  constructor(
    private http: HttpClient,
    private cookieService: CookieService,
    private router: Router
  ) {}

  login(credentials: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/employee/login`, credentials);
  }

  renewToken(access_token: string, refresh_token: string): Observable<any> {
    const payload = {
      email: this.cookieService.get('email'),
      accessToken: access_token,
      refreshToken: refresh_token,
    };

    return this.http.post<any>(`${this.apiUrl}/renew-token`, payload);
  }

  logout() {
    this.cookieService.delete('email');
    this.cookieService.delete('access_token');
    this.cookieService.delete('refresh_token');
    this.router.navigate(['/login']);
  }
  register(customer: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/customer/register`, customer);
  }
}
