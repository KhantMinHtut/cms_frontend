import { Component, EventEmitter, Output } from '@angular/core';
import { OrderService } from '../../../../Services/order.service';
import { DatePipe } from '@angular/common';
import { FormControl, FormGroup } from '@angular/forms';

import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import html2canvas from 'html2canvas';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-order-view-page',
  templateUrl: './order-view-page.component.html',
  styleUrl: './order-view-page.component.css',
})
export class OrderViewPageComponent {
  @Output() changePage = new EventEmitter();

  orders: any[] = [];
  paginationOrders: any[] = [];
  orderCount!: number;
  completedOrder!: number;
  pendingOrder!: number;
  cancelledOrder!: number;

  searchIcon: String = 'd-inline-block';
  searchInput: String = 'd-none';

  pageSize = 8;
  pages: any[] = [];
  currentPage: number = 1;

  selectedDate: Date | null = null;
  minDate = new Date(2021, 6, 1);
  maxDate = new Date();

  constructor(
    private os: OrderService,
    private datePipe: DatePipe,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.fetchInitData();
  }

  fetchInitData() {
    this.os.getOrders().subscribe((response) => {
      this.orderCount = response.count;
      this.completedOrder = response.completedCount;
      this.pendingOrder = response.pendingCount;
      this.cancelledOrder = response.cancelledCount;
      this.orders = response.orders;

      this.os
        .getPaginateOrders(this.currentPage, this.pageSize)
        .subscribe((response) => {
          console.log(response.orders);
          this.paginationOrders = response.orders;
        });

      this.pagination();
    });
  }

  pagination() {
    this.pages = [];
    for (let i = 1; i < this.orderCount; i++) {
      if (this.pageSize * i < this.orderCount + this.pageSize) {
        this.pages.push(i);
        console.log(this.pages);
      }
    }
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

    const filterName = this.orders.filter((order: any) => {
      return order.customer_id.name
        .toLocaleLowerCase()
        .includes(inputValue.toLocaleLowerCase());
    });

    const filterEmail = this.orders.filter((order: any) => {
      return order.customer_id.email
        .toLocaleLowerCase()
        .includes(inputValue.toLocaleLowerCase());
    });

    const filterStatus = this.orders.filter((order: any) => {
      return order.orderStatus
        .toLocaleLowerCase()
        .includes(inputValue.toLocaleLowerCase());
    });

    const filterAmount = this.orders.filter((order: any) => {
      return order.totalAmount.toString().startsWith(inputValue);
    });

    if (filterName.length > 0) {
      this.paginationOrders = filterName;
    } else if (filterEmail.length > 0) {
      this.paginationOrders = filterEmail;
    } else if (filterStatus.length > 0) {
      this.paginationOrders = filterStatus;
    } else if (filterAmount.length > 0) {
      this.paginationOrders = filterAmount;
    }
  }

  fetchData(currentPage: number) {
    this.currentPage = currentPage;

    this.os
      .getPaginateOrders(this.currentPage, this.pageSize)
      .subscribe((response) => {
        this.paginationOrders = response.orders;
      });
  }

  onSelectedDate(event: any) {
    const selected = this.datePipe.transform(event, 'MM/dd/yyyy');

    this.os.getOrders().subscribe((response) => {
      this.paginationOrders = response.orders.filter(
        (order: any) =>
          this.datePipe.transform(order.orderDate, 'MM/dd/yyyy') == selected
      );
    });
  }

  onChangePage(orderId: String) {
    this.changePage.emit({ page: 'details-page', orderId });
  }

  readonly range = new FormGroup({
    start: new FormControl<Date | null>(null),
    end: new FormControl<Date | null>(null),
  });

  // downloadPDF() {
  //   var doc = new jsPDF();
  //   autoTable(doc, { html: '#tablepdf', theme: 'grid' });

  //   doc.save('testpdf');
  // }

  onDeletedOrder(id: String) {
    this.os.deletedOrder(id).subscribe((response) => {
      console.log(response);

      this.os.getOneOrderDetail(id).subscribe((response) => {
        this.os
          .deletedOrderDetails(response.orderDetail._id)
          .subscribe((response) => {
            console.log(response);

            this.toastr.error('Deleted Order', 'Delete', {
              closeButton: true,
              timeOut: 3000,
            });
          });
      });
    });
    this.fetchInitData();
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'pending':
        return 'status-pending';
      case 'completed':
        return 'status-completed';
      case 'cancelled':
        return 'status-cancelled';
      default:
        return '';
    }
  }
}
