import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderViewPageComponent } from './order-view-page.component';

describe('OrderViewPageComponent', () => {
  let component: OrderViewPageComponent;
  let fixture: ComponentFixture<OrderViewPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [OrderViewPageComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(OrderViewPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
