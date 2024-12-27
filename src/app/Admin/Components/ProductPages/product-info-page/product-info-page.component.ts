import {
  Component,
  EventEmitter,
  OnInit,
  Output,
  ChangeDetectorRef,
  Input,
} from '@angular/core';
import { CoffeeService } from '../../../../coffee.service';
import { Product } from '../../../models/product';

@Component({
  selector: 'app-product-info-page',
  templateUrl: './product-info-page.component.html',
  styleUrl: './product-info-page.component.css',
})
export class ProductInfoPageComponent implements OnInit {
  products: any[] = [];
  productFiler: any[] = [];
  productCount!: number;
  categoryList: String[] = [];
  reorderList: any[] = [];
  searchIcon: String = 'd-inline-block';
  searchInput: String = 'd-none';

  pageSize = 8;
  pages: any[] = [];
  currentPage: number = 1;

  @Input() currentBtn: String = '';
  @Output() changePage = new EventEmitter();

  product: Product = {
    image_url: '',
    ingredients: '',
    name: '',

    origin: '',
    category: '',
    supplier_id: [],
    description: '',
  };

  constructor(
    private coffee: CoffeeService,
    private changeDetectorRef: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.fetchProductsData();
  }

  // ngOnChanges() {
  //   this.fetchProductsData();
  // }

  pagination() {
    this.pages = [];
    for (let i = 1; i < this.productCount; i++) {
      if (this.pageSize * i < this.productCount + this.pageSize) {
        this.pages.push(i);
        console.log(this.pages);
      }
    }
  }

  fetchProductsData() {
    this.productFiler = [];
    this.coffee.getProducts().subscribe(async (response) => {
      this.productCount = await response.count;

      console.log(this.productCount);
      response.products.forEach((product: any) => {
        this.productFiler.push(product);
      });

      this.productFiler.forEach((product: any) => {
        if (!this.categoryList.includes(product.category)) {
          this.categoryList.push(product.category);
        }
      });
      console.log(this.categoryList);

      this.reorderList = [];

      this.reorderList = this.productFiler.filter(
        (product: any) => product.stock_quantity < product.reorderlevel
      );

      this.coffee
        .getPaginationProducts(this.currentPage, this.pageSize)
        .subscribe((response) => {
          this.products = response.products;
        });

      this.pagination();
    });
  }

  fetchData(currentPage: number) {
    this.currentPage = currentPage;
    this.coffee
      .getPaginationProducts(currentPage, this.pageSize)
      .subscribe((response) => {
        this.products = response.products;
      });
    this.fetchProductsData();
  }

  onChangePage(product: Product = this.product, clickBtn: String = 'create') {
    this.changePage.emit({
      page: 'add-page',
      data: product,
      clickBtn,
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
    const filterName = this.productFiler.filter((product) =>
      product.name.toLocaleLowerCase().includes(inputValue.toLocaleLowerCase())
    );

    const filerPrice = this.productFiler.filter((product) =>
      product.price.toString().startsWith(inputValue)
    );

    const filterCategory = this.productFiler.filter((product) => {
      product.category
        .toLocaleLowerCase()
        .includes(inputValue.toLocaleLowerCase());
    });

    const filterStock = this.productFiler.filter((product) => {
      product.stock_quantity.toString().startsWith(inputValue);
    });

    if (filterName.length > 0) {
      this.products = filterName;
    } else if (filerPrice.length > 0) {
      this.products = filerPrice;
    } else if (filterCategory.length > 0) {
      this.products = filterCategory;
    } else if (filterStock.length > 0) {
      this.products = filterStock;
    }
  }

  onDeleteProduct(id: String) {
    this.coffee.deleteOneProduct(id).subscribe((response) => {
      this.fetchProductsData();
      this.currentPage--;
    });
  }
}
