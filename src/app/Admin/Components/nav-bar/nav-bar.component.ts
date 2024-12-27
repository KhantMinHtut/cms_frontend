import {
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  Output,
  Renderer2,
  ViewChild,
} from '@angular/core';
import { Employee } from '../../models/employee';
import { CoffeeService } from '../../../coffee.service';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.css',
})
export class NavBarComponent {
  @ViewChild('userInfoBtn') userInfoBtn!: ElementRef;
  @ViewChild('userInfoCard') userInfoCard!: ElementRef;

  @Input() currentUser: Employee = {};
  @Output() onEditPage = new EventEmitter();

  click: Boolean = false;
  userEditPage: Boolean = false;

  constructor(private renderer: Renderer2, private coffee: CoffeeService) {}

  showUserInfo(): void {
    this.click = !this.click;
    this.onEditPage.emit(this.userEditPage);
  }

  @HostListener('document:click', ['$event'])
  clickOutside(event: Event) {
    if (
      this.click &&
      this.userInfoCard &&
      !this.userInfoCard.nativeElement.contains(event.target) &&
      !this.userInfoBtn.nativeElement.contains(event.target)
    ) {
      this.renderer.removeClass(this.userInfoCard.nativeElement, 'onOpen');
      this.renderer.addClass(this.userInfoCard.nativeElement, 'onClose');
      setTimeout(() => {
        this.click = false;
      }, 500);
    }
  }

  editUser() {
    this.onEditPage.emit(!this.userEditPage);
    this.click = false;
  }
}
