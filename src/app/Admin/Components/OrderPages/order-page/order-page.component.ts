import { Component, EventEmitter, Output, OnInit } from '@angular/core';

@Component({
  selector: 'app-order-page',
  templateUrl: './order-page.component.html',
  styleUrl: './order-page.component.css',
})
export class OrderPageComponent implements OnInit {
  currentPage: string = 'view-page';
  currentOrderId: string = '';

  ngOnInit(): void {}

  onCurrentPage(event: any) {
    this.currentPage = event.page;
    this.currentOrderId = event.orderId;
  }
}
