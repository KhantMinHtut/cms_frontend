import { Component, ElementRef, Input, ViewChild } from '@angular/core';

@Component({
  selector: 'app-nav-items',
  templateUrl: './nav-items.component.html',
  styleUrl: './nav-items.component.css',
})
export class NavItemsComponent {
  @Input()
  icon: String = '';

  @Input()
  content: String = '';

  @Input() isActive: String = '';
}
