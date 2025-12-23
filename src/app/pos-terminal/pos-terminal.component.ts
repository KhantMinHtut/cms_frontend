import { Component, OnInit } from '@angular/core';
import { CoffeeService } from '../coffee.service';

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

@Component({
  selector: 'app-pos-terminal',
  templateUrl: './pos-terminal.component.html',
  styleUrl: './pos-terminal.component.css',
})
export class POSTerminalComponent implements OnInit {
  products: Product[] = [];
  filterProducts: Product[] = [];
  selectedMenuItems: SelectedProducts[] = [];

  searchText: string = '';
  category_status: string = 'all';
  isLoading: boolean = false;

  all_product_count: number = 0;
  hot_product_count: number = 0;
  cold_product_count: number = 0;
  desert_product_count: number = 0;

  subTotalPrice: number = 0;
  totalPrice: number = 0;
  paymentMethod: 'cash' | 'k-pay' | 'wave-pay' = 'cash';

  constructor(private coffee: CoffeeService) {}

  ngOnInit(): void {
    this.fetchProducts();
  }

  fetchProducts() {
    this.isLoading = true;
    this.coffee.getProducts().subscribe({
      next: async (response) => {
        console.log(response);
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
        }, 2000);
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

  setCount(status: 'increase' | 'decrease', index: number) {
    if (status === 'decrease') {
      this.selectedMenuItems[index].count--;
    } else {
      this.selectedMenuItems[index].count++;
    }
    this.getSubTotalPrice();
  }

  getSubTotalPrice() {
    this.subTotalPrice = 0;
    this.totalPrice = 0;
    this.selectedMenuItems.forEach((item) => {
      this.subTotalPrice += item.product.price * item.count;
    });

    this.totalPrice = this.getTotalPrice(this.subTotalPrice, 0).finalPrice;
  }

  getTotalPrice(price: number, discountPercent: number) {
    const discount = price * (discountPercent / 100);
    return {
      discountAmount: discount,
      finalPrice: price - discount,
    };
  }
}
