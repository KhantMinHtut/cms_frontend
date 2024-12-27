import { Component, OnInit } from '@angular/core';
import { CoffeeService } from '../coffee.service';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';
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
  constructor(
    private coffeeService: CoffeeService,
    private cookieService: CookieService,
    private router: Router
  ) {}
  ngOnInit(): void {}
  showRegister(): void {
    this.isActive = true;
  }
  showLogin(): void {
    this.isActive = false;
  }
  register(): void {
    this.coffeeService.register(this.customer).subscribe(
      (response) => {
        alert('Registration successful');
        console.log('Registration successful', response);
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
    this.coffeeService.login(this.credentials).subscribe(
      (response) => {
        console.log('Login successful', response);
        this.cookieService.set('email', response.currentEmployee.email);
        this.cookieService.set('access_token', response.accessToken);
        // this.router.navigate(['/menu']);
        response.currentEmployee.role == 1
          ? this.router.navigate(['/dashboard'])
          : this.router.navigate(['/menu']);
      },
      (error) => {
        // alert(error?.message);
        console.error('Login error', error);

        this.isError = true;
        this.credentials = {
          email: '',
          password: '',
        };
      }
    );
  }

  goToMenu() {
    this.router.navigate(['/menu']);
  }
}
