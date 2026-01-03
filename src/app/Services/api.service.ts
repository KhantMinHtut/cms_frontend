import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
  HttpParams,
} from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, filter, switchMap, take } from 'rxjs/operators';
import { Router } from '@angular/router';
import { CoffeeService } from '../coffee.service';
import { CookieService } from 'ngx-cookie-service';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private isRefreshing = false;
  private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(
    null
  );

  constructor(
    private http: HttpClient,
    private router: Router,
    private authService: AuthService,
    private cookieService: CookieService
  ) {}

  get<T>(
    url: string,
    params: HttpParams = new HttpParams(),
    requiresAuth = true
  ): Observable<T> {
    return this.request<T>('GET', url, null, params, requiresAuth);
  }

  post<T>(url: string, body: any, requiresAuth = true): Observable<T> {
    return this.request<T>('POST', url, body, new HttpParams(), requiresAuth);
  }

  put<T>(url: string, body: any, requiresAuth = true): Observable<T> {
    return this.request<T>('PUT', url, body, new HttpParams(), requiresAuth);
  }

  patch<T>(url: string, body: any, requiresAuth = true): Observable<T> {
    return this.request<T>('PATCH', url, body, new HttpParams(), requiresAuth);
  }

  delete<T>(url: string, requiresAuth = true): Observable<T> {
    return this.request<T>('DELETE', url, null, new HttpParams(), requiresAuth);
  }

  private request<T>(
    method: string,
    url: string,
    body: any | null,
    params: HttpParams,
    requiresAuth: boolean
  ): Observable<T> {
    let headers = new HttpHeaders();
    if (requiresAuth) {
      const token = this.cookieService.get('access_token');

      if (token) {
        headers = headers.set('authorization', `Bearer ${token}`);
      }
    }

    const req = this.http.request<T>(method, url, {
      body,
      headers,
      params,
    });

    return req.pipe(
      catchError((error) => {
        if (
          error instanceof HttpErrorResponse &&
          error.status === 401 &&
          requiresAuth
        ) {
          return this.handle401Error<T>(
            method,
            url,
            body,
            params,
            requiresAuth
          );
        }
        return throwError(() => error);
      })
    );
  }

  private handle401Error<T>(
    method: string,
    url: string,
    body: any | null,
    params: HttpParams,
    requiresAuth: boolean
  ): Observable<T> {
    if (!this.isRefreshing) {
      this.isRefreshing = true;
      this.refreshTokenSubject.next(null);

      const access_token = this.cookieService.get('access_token');
      const refresh_token = this.cookieService.get('refresh_token');

      return this.authService.renewToken(access_token, refresh_token).pipe(
        switchMap((tokenResponse: any) => {
          // console.log("refresh token in api service");

          // alert('refresh token in api service');

          this.isRefreshing = false;
          if (
            tokenResponse &&
            tokenResponse.data &&
            tokenResponse.data.access_token
          ) {
            const newToken = tokenResponse.data.access_token;
            this.cookieService.set('access_token', newToken);
            this.refreshTokenSubject.next(newToken);
            return this.request<T>(method, url, body, params, requiresAuth);
          } else {
            this.authService.logout();
            return throwError(() => 'Could not refresh token.');
          }
        }),
        catchError((err) => {
          this.isRefreshing = false;
          this.authService.logout();
          return throwError(() => err);
        })
      );
    } else {
      // console.log("refresh token run");

      return this.refreshTokenSubject.pipe(
        filter((token) => !!token),
        take(1),
        switchMap(() =>
          this.request<T>(method, url, body, params, requiresAuth)
        )
      );
    }
  }
}
