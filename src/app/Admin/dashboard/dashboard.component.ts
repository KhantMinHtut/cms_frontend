import { Component, OnInit } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';

import { EmployeeService } from '../../Services/employee.service';
import { Route, Router } from '@angular/router';
import { CoffeeService } from '../../coffee.service';
import { Employee } from '../models/employee';
import { EmployeeAddPageComponent } from '../Components/EmployeePages/employee-add-page/employee-add-page.component';
import { AuthService } from '../../Services/auth.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent implements OnInit {
  currentIndex: number = 0;
  currentUser!: Employee;
  role: number = 0;
  isAdmin: boolean = false;
  isUserEditPage!: Boolean;

  userEditPage = false;

  constructor(
    private cookieService: CookieService,
    private employeeService: EmployeeService,
    private router: Router,
    private coffee: CoffeeService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    const currentEmail = this.cookieService.get('email');

    if (
      currentEmail &&
      this.cookieService.check('access_token') &&
      this.cookieService.check('refresh_token')
    ) {
      this.employeeService
        .getOneEmployee(currentEmail)
        .subscribe((response) => {
          // console.log(response);
          this.currentUser = response.employee;
          this.role = response.employee.role;
          // if (response.employee.role == 0) {
          //   // this.router.navigate(['/menu']);
          // } else if (response.employee.role == 1) {
          //   this.isAdmin = true;
          // }
          if (response.employee.role == 0) {
            this.currentIndex = 1;
          }
        });
    } else {
      this.router.navigate(['/login']);
    }
  }

  navItems = [
    { icon: 'bi bi-house-fill', content: 'Home', permission: [1] },
    { icon: 'bi bi-grid-fill', content: 'Sales', permission: [1, 0] },
    { icon: 'bi bi-box-seam-fill', content: 'Product', permission: [1] },
    { icon: 'bi bi-journal-check', content: 'Order', permission: [1] },

    { icon: 'bi bi-person-fill', content: 'Employee', permission: [1] },
    { icon: 'bi bi-person-fill', content: 'Customer', permission: [1] },
    { icon: 'bi bi-person-fill', content: 'Supplier', permission: [1] },
  ];

  changePage(index: any, isUserEdit: boolean) {
    this.currentIndex = index;
    this.userEditPage = isUserEdit;
  }

  showUserEditPage(value: boolean) {
    this.userEditPage = value;
    // console.log(value);
  }

  onHideEditUser(value: any) {
    this.userEditPage = !value;
  }

  logOut() {
    this.authService.logout();
  }
}
