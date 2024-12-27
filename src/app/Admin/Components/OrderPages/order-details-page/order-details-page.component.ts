import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  output,
} from '@angular/core';
import { OrderService } from '../../../../Services/order.service';

import { CustomerService } from '../../../../Services/customer.service';
import { PaymentService } from '../../../../Services/payment.service';

@Component({
  selector: 'app-order-details-page',
  templateUrl: './order-details-page.component.html',
  styleUrl: './order-details-page.component.css',
})
export class OrderDetailsPageComponent implements OnInit {
  @Input() orderId: String = '';
  @Output() changePage = new EventEmitter();

  orderDetails: any = {};
  customOrderId: String = '';
  orderStatus: String = '';
  productCollection: any[] = [];
  products: any[] = [];
  customerInfo: any = {};
  payment: any = {};
  status: String = 'completed';

  constructor(
    private os: OrderService,
    private cs: CustomerService,
    private paymentService: PaymentService
  ) {}

  ngOnInit(): void {
    if (this.orderId) {
      this.fetchData(this.orderId);
    }
  }

  fetchData(id: any) {
    console.log(id);
    this.os.getOneOrderDetail(id).subscribe(async (response) => {
      console.log(response.orderDetail);
      this.orderDetails = await response.orderDetail;
      this.productCollection = await response.orderDetail.product_id;
      const productName: any[] = [];

      this.productCollection.forEach((product: any) => {
        if (!productName.includes(product.name)) {
          this.products.push(product);
          productName.push(product.name);
          console.log(this.products);
        }
      });

      this.customOrderId = this.orderDetails.order_id.order_id;
      this.orderStatus = this.orderDetails.order_id.orderStatus;

      this.cs
        .getOneCustomer(this.orderDetails.order_id.customer_id)
        .subscribe(async (response) => {
          this.customerInfo = await response.customer;

          console.log(this.customerInfo);
        });
    });

    this.paymentService.getOnePayment(id).subscribe(async (response) => {
      this.payment = await response.payment;
    });
  }

  ProductCounts(currentProduct: String) {
    return this.productCollection.filter(
      (product: any) => product._id === currentProduct
    ).length;
  }

  onChangePage() {
    this.changePage.emit({ page: 'view-page', orderId: '' });
  }

  print() {
    window.print();
  }
}
