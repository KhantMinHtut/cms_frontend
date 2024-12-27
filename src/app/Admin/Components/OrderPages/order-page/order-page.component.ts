import { Component, EventEmitter, Output, OnInit } from '@angular/core';

@Component({
  selector: 'app-order-page',
  templateUrl: './order-page.component.html',
  styleUrl: './order-page.component.css',
})
export class OrderPageComponent implements OnInit {
  currentPage: String = 'view-page';
  currentOrderId: String = '';

  ngOnInit(): void {}

  onCurrentPage(event: any) {
    this.currentPage = event.page;
    this.currentOrderId = event.orderId;
  }
}
