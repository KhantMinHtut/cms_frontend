import { Component, OnInit } from '@angular/core';
import { CoffeeService } from '../coffee.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {
  productsByCategory: { [category: string]: any[] } = {};

  constructor(
    private coffeeService: CoffeeService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.coffeeService.getProducts().subscribe((response: any) => {
      const categorizedProducts: { [category: string]: any[] } = {};

      response.products.forEach((product: any) => {
        const category = product.category || 'Uncategorized';
        product.isExpanded = false; // Initialize isExpanded for each product

        if (!categorizedProducts[category]) {
          categorizedProducts[category] = [];
        }
        categorizedProducts[category].push(product);
      });

      this.productsByCategory = categorizedProducts; // Assign the categorized products to the component property
    }, (error) => {
      console.error('Error fetching products:', error);
    });
  }

  toggleDescription(product: any): void {
    product.isExpanded = !product.isExpanded; // Toggle the description visibility
  }

  BackBtn() {
    this.coffeeService.backBtn()
  }
  
}
