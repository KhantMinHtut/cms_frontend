import { Component } from '@angular/core';

@Component({
  selector: 'app-employee-page',
  templateUrl: './employee-page.component.html',
  styleUrl: './employee-page.component.css',
})
export class EmployeePageComponent {
  currentPage: String = 'view-page';
  currentData: any;
  clickedBtn: any;

  onChangePage(event: any) {
    this.currentPage = event.page;
    this.currentData = event.data;
    this.clickedBtn = event.clickBtn;
  }
}
