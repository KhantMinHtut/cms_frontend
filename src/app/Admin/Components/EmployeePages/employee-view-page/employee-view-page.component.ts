import { Component, EventEmitter, OnInit, Output } from '@angular/core';

import { EmployeeService } from '../../../../Services/employee.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-employee-view-page',
  templateUrl: './employee-view-page.component.html',
  styleUrl: './employee-view-page.component.css',
})
export class EmployeeViewPageComponent implements OnInit {
  employees: any[] = [];
  managers: any[] = [];
  baristas: any[] = [];
  cashiers: any[] = [];
  waiters: any[] = [];
  departments: any[] = [];
  paginatedEmployees: any[] = [];

  employeeCount!: number;

  searchIcon: String = 'd-inline-block';
  searchInput: String = 'd-none';

  pageSize = 8;
  pages: any[] = [];
  currentPage: number = 1;

  @Output() changePage = new EventEmitter();

  constructor(
    private employeeService: EmployeeService,
    private toastr: ToastrService
  ) {}

  employeeInfo = {
    image_url: '../../../../../assets/images/image-upload2.png',
    email: '',
    phone: '',
    password: '',
    position: '',
    salary: 0,
    hire_date: '',
    location: '',
    role: '0',
  };

  ngOnInit(): void {
    this.fetchEmployeesData();
  }

  pagination() {
    this.pages = [];
    for (let i = 1; i < this.employeeCount; i++) {
      if (this.pageSize * i < this.employeeCount + this.pageSize) {
        this.pages.push(i);
        console.log(this.pages);
      }
    }
  }

  fetchEmployeesData() {
    this.employeeService.getAllEmployees().subscribe(async (response) => {
      this.employees = await response.employees;
      this.managers = await response.managers;
      this.baristas = await response.baristas;
      this.cashiers = await response.cashiers;
      this.waiters = await response.waiters;
      this.employeeCount = await response.employeeCount;

      this.employees.forEach((employee: any) => {
        if (!this.departments.includes(employee.position)) {
          this.departments.push(employee.position);
        }
      });

      this.employeeService
        .getPaginatedEmployees(this.currentPage, this.pageSize)
        .subscribe((response) => {
          this.paginatedEmployees = response.paginatedEmployees;
        });

      this.pagination();
    });
  }

  fetchPaginatedData(currentPage: number) {
    this.currentPage = currentPage;
    this.employeeService
      .getPaginatedEmployees(currentPage, this.pageSize)
      .subscribe((response) => {
        this.paginatedEmployees = response.paginatedEmployees;
        console.log(currentPage, this.pageSize);
        console.log(response);
      });
  }

  onChangePage(
    page: String = 'add-page',
    employeeData: any = this.employeeInfo,
    clickBtn: String = 'create'
  ) {
    this.changePage.emit({
      page: page,
      data: employeeData,
      clickBtn: clickBtn,
    });
  }

  searchBox(value: String) {
    if (value == 'open') {
      this.searchIcon = 'd-none';
      this.searchInput = 'd-inline-block';
    } else {
      setTimeout(() => {
        this.searchIcon = 'd-inline-block';
        this.searchInput = 'd-none';
      }, 1000);
    }
  }

  onSearch(event: Event) {
    const inputValue = (event.target as HTMLInputElement).value;

    const filterId = this.employees.filter((employee) => {
      return employee.employee_id.toString().startsWith(inputValue);
    });

    const filterName = this.employees.filter((employee) => {
      return employee.name
        .toLocaleLowerCase()
        .includes(inputValue.toLocaleLowerCase());
    });

    const filterPosition = this.employees.filter((employee) => {
      return employee.position
        .toLocaleLowerCase()
        .includes(inputValue.toLocaleLowerCase());
    });

    const filterEmail = this.employees.filter((employee) => {
      return employee.email.includes(inputValue.toLocaleLowerCase());
    });

    const filterPhone = this.employees.filter((employee) => {
      return employee.phone.startsWith(inputValue);
    });

    const filterActive = this.employees.filter((employee) => {
      let status = 0;
      if (inputValue.toLocaleLowerCase() == 'active') {
        status = 1;
      } else if (inputValue.toLocaleLowerCase() == 'inactive') {
        status = 0;
      }
      return employee.is_active == status;
    });

    const filterSalary = this.employees.filter((employee) => {
      return employee.salary.toString().startsWith(inputValue);
    });

    if (filterId.length > 0) {
      this.paginatedEmployees = filterId;
    } else if (filterName.length > 0) {
      this.paginatedEmployees = filterName;
    } else if (filterPosition.length > 0) {
      this.paginatedEmployees = filterPosition;
    } else if (filterEmail.length > 0) {
      this.paginatedEmployees = filterEmail;
    } else if (filterPhone.length > 0) {
      this.paginatedEmployees = filterPhone;
    } else if (filterActive.length > 0) {
      this.paginatedEmployees = filterActive;
    } else if (filterSalary.length > 0) {
      this.paginatedEmployees = filterSalary;
    }
  }

  onDeleteEmployee(id: String) {
    this.employeeService.deletedEmployee(id).subscribe((response) => {
      console.log(response);
      this.toastr.success('Successfully Deleted Employee!', 'Success', {
        closeButton: true,
        timeOut: 3000,
      });
      this.fetchEmployeesData();
    });
  }
}
