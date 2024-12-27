import { Component } from '@angular/core';
import { Product } from '../../../models/product';

@Component({
  selector: 'app-product-page',
  templateUrl: './product-page.component.html',
  styleUrl: './product-page.component.css',
})
export class ProductPageComponent {
  currentPage: String = 'info-page';

  product: Product = {};

  currentBtn: String = '';

  onCurrentPage(data: any) {
    this.currentPage = data.page;
    this.product = data.data;
    this.currentBtn = data.clickBtn;
  }
}
