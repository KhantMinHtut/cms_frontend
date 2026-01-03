import { Component, OnInit } from '@angular/core';
import { CoffeeService } from '../coffee.service';
import { MatDialog } from '@angular/material/dialog';
import { CustomerPopupComponent } from '../Admin/Components/CustomerPages/customer-popup/customer-popup.component';
import { firstValueFrom, forkJoin } from 'rxjs';
import { CustomerService } from '../Services/customer.service';
import { OrderService } from '../Services/order.service';
import { PaymentService } from '../Services/payment.service';
import { ToastrService } from 'ngx-toastr';

export interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  discount: number;
  reorderlevel: number;
  origin: string;
  ingredients: string;
  category: string;
  stock_quantity: number;
  supplier_id: string[];
  image_url: string;
  createdAt: string;
  updatedAt: string;
  product_id: number;
  __v: number;
}

interface SelectedProducts {
  product: Product;
  count: number;
}

interface CustomerInfo {
  name: string;
  email: string;
  phone: string;
  loyalty_points: number;
}

@Component({
  selector: 'app-pos-terminal',
  templateUrl: './pos-terminal.component.html',
  styleUrl: './pos-terminal.component.css',
})
export class POSTerminalComponent implements OnInit {
  products: Product[] = [];
  filterProducts: Product[] = [];
  selectedMenuItems: SelectedProducts[] = [];
  productCount: number = 0;

  searchText: string = '';
  category_status: string = 'all';
  isLoading: boolean = false;
  isOrder: boolean = false;

  all_product_count: number = 0;
  hot_product_count: number = 0;
  cold_product_count: number = 0;
  desert_product_count: number = 0;

  totalProduct: number = 0;
  subTotalPrice: number = 0;
  discountAmount: number = 0;
  totalPrice: number = 0;
  paymentMethod: 'cash' | 'Kpay' | 'Wavepay' = 'cash';

  newCustomer: CustomerInfo = {
    name: '',
    email: '',
    phone: '',
    loyalty_points: 0,
  };

  customerInfo: CustomerInfo = {
    name: 'Default Name',
    email: 'default@example.com',
    phone: '000-000-0000',
    loyalty_points: 0,
  };

  constructor(
    private coffee: CoffeeService,
    private dialog: MatDialog,
    private customerService: CustomerService,
    private orderService: OrderService,
    private paymentService: PaymentService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.fetchProducts();
  }

  fetchProducts() {
    this.isLoading = true;
    this.coffee.getProducts().subscribe({
      next: async (response) => {
        // console.log(response);
        this.products = await response.products;
        this.filterProducts = this.products;
        this.all_product_count = response.count;
        this.hot_product_count = this.products.filter(
          (p) => p.category === 'hot'
        ).length;
        this.cold_product_count = this.products.filter(
          (p) => p.category === 'cold'
        ).length;
        this.desert_product_count = this.products.filter(
          (p) => p.category === 'deserts'
        ).length;

        setTimeout(() => {
          this.isLoading = false;
        }, 1000);
      },
      error: (error) => {
        setTimeout(() => {
          this.isLoading = false;
        }, 5000);
      },
    });
  }

  onSearchProduct() {
    this.category_status = 'all';
    const searchProducts = this.products.filter((p) =>
      (p.name as string).toLowerCase().includes(this.searchText.toLowerCase())
    );
    this.filterProducts = searchProducts;
  }

  onCategorySelect(status: string) {
    if (status === 'all') {
      this.category_status = 'all';
      this.filterProducts = this.products;
    } else if (status === 'hot') {
      this.category_status = 'hot';
      this.filterProducts = this.products.filter((p) => p.category === 'hot');
    } else if (status === 'cold') {
      this.category_status = 'cold';
      this.filterProducts = this.products.filter((p) => p.category === 'cold');
    } else if (status === 'deserts') {
      this.category_status = 'deserts';
      this.filterProducts = this.products.filter(
        (p) => p.category === 'deserts'
      );
    }
  }

  onSelectedMenu(product: Product) {
    if (window.innerWidth > 885) {
      this.isOrder = true;
    } else {
      this.isOrder = false;
    }

    // Decreased stock_quantity when product added
    const selectedProduct = this.products.find((p) => p._id == product._id);
    if (selectedProduct) {
      selectedProduct.stock_quantity--;
    }
    // product.stock_quantity--;

    if (this.selectedMenuItems.length > 0) {
      const sameProductIndex = this.selectedMenuItems.findIndex(
        (item) => item.product.name === product.name
      );

      if (sameProductIndex != -1) {
        this.selectedMenuItems[sameProductIndex].count++;
      } else {
        this.selectedMenuItems.push({ product, count: 1 });
      }
    } else {
      this.selectedMenuItems.push({ product, count: 1 });
    }
    this.getSubTotalPrice();
  }

  setCount(status: 'increase' | 'decrease', index: number, productId: string) {
    if (status === 'decrease') {
      const selectedProduct = this.products.find((p) => p._id === productId);
      if (selectedProduct) selectedProduct.stock_quantity++;
      // const selectedProductInFilter = this.filterProducts.find(
      //   (p) => p._id === productId
      // );
      // if (selectedProductInFilter) selectedProductInFilter.stock_quantity++;

      this.selectedMenuItems[index].count--;
    } else {
      const selectedProduct = this.products.find((p) => p._id === productId);
      if (selectedProduct) selectedProduct.stock_quantity--;
      // const selectedProductInFilter = this.filterProducts.find(
      //   (p) => p._id === productId
      // );
      // if (selectedProductInFilter) selectedProductInFilter.stock_quantity--;

      this.selectedMenuItems[index].count++;
    }
    this.getSubTotalPrice();
  }

  getSubTotalPrice() {
    this.subTotalPrice = 0;
    this.discountAmount = 0;
    this.totalPrice = 0;
    this.totalProduct = 0;
    this.selectedMenuItems.forEach((item) => {
      this.subTotalPrice += item.product.price * item.count;
      if (item.product.discount) {
        this.discountAmount +=
          (item.product.price * item.count * item.product.discount) / 100;
      }
      this.totalProduct += item.count;
    });

    this.totalPrice = this.getTotalPrice(
      this.subTotalPrice,
      this.discountAmount
    );
  }

  getTotalPrice(price: number, discountAmount: number) {
    return price - discountAmount;
  }

  onRemoveMenu(index: number, product: SelectedProducts) {
    const findProduct = this.products.find(
      (p) => p._id === product.product._id
    );
    if (findProduct) findProduct.stock_quantity += product.count;

    // const findFilterProduct = this.filterProducts.find(
    //   (p) => p._id === product.product._id
    // );
    // if (findFilterProduct) findFilterProduct.stock_quantity += product.count;

    this.selectedMenuItems.splice(index, 1);
    this.getSubTotalPrice();
  }

  async onCheckout() {
    const customer = await firstValueFrom(
      this.customerService.createCustomer(this.customerInfo)
    );

    const order = await firstValueFrom(
      this.orderService.createOrder({
        customerId: customer.newCustomer._id,
        totalAmount: this.totalPrice,
        orderStatus: 'completed',
      })
    );

    const product_syskey_list: string[] = [];
    this.selectedMenuItems.forEach((item) => {
      for (let i = 0; i < item.count; i++) {
        product_syskey_list.push(item.product._id);
      }
    });

    await Promise.all([
      firstValueFrom(
        this.orderService.createOrderDetail({
          orderId: order.newOrder._id,
          productId: product_syskey_list,
          price: this.totalPrice,
          quantity: this.totalProduct,
        })
      ),
      firstValueFrom(
        this.paymentService.createPayment({
          order_id: order.newOrder._id,
          amount: this.totalPrice,
          payment_method: this.paymentMethod,
        })
      ),
    ]);

    // console.log(this.selectedMenuItems);

    // this.selectedMenuItems.forEach((item) => {
    //   console.log(item);
    //   this.coffee.updatedProductOuantity(
    //     item.product._id,
    //     item.product.stock_quantity,
    //     item.count
    //   );
    // });

    const updates = this.selectedMenuItems.map((item) =>
      this.coffee.updatedProductOuantity(
        item.product._id,
        item.product.stock_quantity
      )
    );

    forkJoin(updates).subscribe({
      next: () => console.log('All quantities updated'),
      error: (err) => console.error('Some updates failed', err),
    });

    this.toastr.success('Successfully Checkout!', 'Success', {
      closeButton: true,
      timeOut: 3000,
    });

    setTimeout(() => {
      this.selectedMenuItems = [];
    }, 100);
  }

  openPopup(title: String, info: any) {
    const _popup = this.dialog.open(CustomerPopupComponent, {
      width: '60%',

      data: {
        title: title,
        info: info,
      },
    });

    _popup.afterClosed().subscribe((item) => {
      // console.log(item);
      this.customerInfo = item;
    });
  }
}
