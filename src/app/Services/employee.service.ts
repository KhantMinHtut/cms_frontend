import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class EmployeeService {
  private apiUrl = 'https://cms-api-nk80.onrender.com/api/cms';

  constructor(private http: HttpClient) {}

  createEmployee(employeeData: any): Observable<any> {
    const data = new FormData();

    data.append('name', employeeData.name);
    data.append('email', employeeData.email);
    data.append('phone', employeeData.phone);
    data.append('password', employeeData.password);
    data.append('position', employeeData.position);
    data.append('salary', employeeData.salary);
    data.append('hire_date', employeeData.hire_date);
    data.append('location', employeeData.location);
    data.append('role', employeeData.role);
    // data.append('image', employeeData.image_url, employeeData.image_url.name);

    if (typeof employeeData.image_url == 'string') {
      console.log(employeeData.image_url);
      data.append('url', employeeData.image_url);
    } else {
      data.append('image', employeeData.image_url, employeeData.image_url.name);
    }

    return this.http.post<any>(`${this.apiUrl}/employee/register`, data);
  }

  updatedEmployee(id: String, employeeData: any): Observable<any> {
    const data = new FormData();

    data.append('name', employeeData.name);
    data.append('email', employeeData.email);
    data.append('phone', employeeData.phone);
    data.append('password', employeeData.password);
    data.append('position', employeeData.position);
    data.append('salary', employeeData.salary);
    data.append('hire_date', employeeData.hire_date);
    data.append('location', employeeData.location);
    data.append('role', employeeData.role);
    // data.append('image', employeeData.image_url, employeeData.image_url.name);

    if (typeof employeeData.image_url == 'string') {
      console.log(employeeData.image_url);
      data.append('url', employeeData.image_url);
    } else {
      data.append('image', employeeData.image_url, employeeData.image_url.name);
    }

    return this.http.patch<any>(
      `${this.apiUrl}/employee/update-employee/${id}`,
      data
    );
  }

  getAllEmployees(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/employee/all-employees`);
  }

  getOneEmployee(email: String): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}/employee/one-employee?email=${email}`
    );
  }

  getEmployeesByDate(startDate: String, endDate: String): Observable<any> {
    return this.http.get(
      `${this.apiUrl}/employee/getemployeesbydate?startDate=${startDate}&endDate=${endDate}`
    );
  }

  getPaginatedEmployees(
    currentPage: number,
    pageSize: number
  ): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}/employee/paginatedEmployees?page=${currentPage}&pageSize=${pageSize}`
    );
  }

  getEmployeeShifts(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/employee/get-shifts`);
  }

  getOneEmployeeShift(id: any): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}/employee/get-oneEmployeeShift/${id}`
    );
  }

  createEmployeeShift(shift: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/employee/create-shift`, shift);
  }

  updatedEmployeeShift(id: String, shift: any): Observable<any> {
    return this.http.patch(`${this.apiUrl}/employee/update-shift/${id}`, shift);
  }

  deletedEmployee(id: String): Observable<any> {
    return this.http.delete(
      `${this.apiUrl}/employee/delete-one-employee/${id}`
    );
  }
}
