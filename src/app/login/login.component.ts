import { Component, OnInit } from '@angular/core';
import { CoffeeService } from '../coffee.service';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';
import { AuthService } from '../Services/auth.service';
interface Customer {
  name: string;
  email: string;
  password: string;
  phone: string;
}
interface Credentials {
  email: string;
  password: string;
}
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'], // Changed from styleUrl to styleUrls for consistency
})
export class LoginComponent implements OnInit {
  isError: Boolean = false;

  isLoading: boolean = false;

  customer: Customer = {
    name: '',
    email: '',
    phone: '',
    password: '',
  };
  credentials: Credentials = {
    email: '',
    password: '',
  };
  isActive = false;
  hidePassword: boolean = true;
  constructor(
    private authService: AuthService,
    private cookieService: CookieService,
    private router: Router
  ) {}

  ngOnInit(): void {
    if (
      this.cookieService.check('email') &&
      this.cookieService.check('access_token') &&
      this.cookieService.check('refresh_token')
    ) {
      this.router.navigate(['/dashboard']);
    }
  }

  showRegister(): void {
    this.isActive = true;
  }
  showLogin(): void {
    this.isActive = false;
  }
  register(): void {
    this.authService.register(this.customer).subscribe(
      (response) => {
        alert('Registration successful');
        // console.log('Registration successful', response);
        this.customer = { name: '', email: '', password: '', phone: '' }; // Reset customer object
        this.router.navigate(['/login']);
      },
      (error) => {
        alert(error?.error?.message || 'Registration failed');
        console.error('Registration error', error);
      }
    );
  }
  login() {
    this.isLoading = true;
    this.authService.login(this.credentials).subscribe(
      (response) => {
        // console.log('Login successful', response);
        this.cookieService.set('email', response.email);
        this.cookieService.set('access_token', response.accessToken);
        this.cookieService.set('refresh_token', response.refreshToken);
        // this.router.navigate(['/menu']);

        setTimeout(() => {
          this.isLoading = false;

          // response.currentEmployee.role == 1
          //   ? this.router.navigate(['/dashboard'])
          //   : this.router.navigate(['/menu']);

          this.router.navigate(['/dashboard']);
        }, 2000);
      },
      (error) => {
        // alert(error?.message);
        console.error('Login error', error);

        this.isError = true;
        this.credentials = {
          email: '',
          password: '',
        };

        setTimeout(() => {
          this.isLoading = false;
        }, 2000);
      }
    );
  }

  goToMenu() {
    this.router.navigate(['/menu']);
  }
}
