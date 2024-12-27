import { Component, OnInit } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';

import { EmployeeService } from '../../Services/employee.service';
import { Route, Router } from '@angular/router';
import { CoffeeService } from '../../coffee.service';
import { Employee } from '../models/employee';
import { EmployeeAddPageComponent } from '../Components/EmployeePages/employee-add-page/employee-add-page.component';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent implements OnInit {
  currentIndex: number = 0;
  currentUser!: Employee;
  isAdmin: boolean = false;
  isUserEditPage!: Boolean;

  userEditPage = false;

  constructor(
    private cookieService: CookieService,
    private employeeService: EmployeeService,
    private router: Router,
    private coffee: CoffeeService
  ) {}

  ngOnInit(): void {
    const currentEmail = this.cookieService.get('email');

    if (currentEmail) {
      this.employeeService
        .getOneEmployee(currentEmail)
        .subscribe((response) => {
          console.log(response);
          this.currentUser = response.employee;
          if (response.employee.role == 0) {
            this.router.navigate(['/menu']);
          } else if (response.employee.role == 1) {
            this.isAdmin = true;
          }
        });
    } else {
      this.router.navigate(['/login']);
    }
  }

  navItems = [
    { icon: 'bi bi-house-fill', content: 'Home' },
    { icon: 'bi bi-basket-fill', content: 'Product' },
    { icon: 'bi bi-journal-check', content: 'Order' },

    { icon: 'bi bi-person-fill', content: 'Employee' },
    { icon: 'bi bi-person-fill', content: 'Customer' },
    { icon: 'bi bi-person-fill', content: 'Supplier' },
  ];

  changePage(index: any, isUserEdit: boolean) {
    this.currentIndex = index;
    this.userEditPage = isUserEdit;
  }

  showUserEditPage(value: boolean) {
    this.userEditPage = value;
    console.log(value);
  }

  onHideEditUser(value: any) {
    this.userEditPage = !value;
  }

  logOut() {
    this.coffee.logout();
  }
}
