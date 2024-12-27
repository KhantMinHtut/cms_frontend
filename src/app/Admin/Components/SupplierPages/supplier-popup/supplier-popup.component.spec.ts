import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SupplierPopupComponent } from './supplier-popup.component';

describe('SupplierPopupComponent', () => {
  let component: SupplierPopupComponent;
  let fixture: ComponentFixture<SupplierPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SupplierPopupComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SupplierPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
