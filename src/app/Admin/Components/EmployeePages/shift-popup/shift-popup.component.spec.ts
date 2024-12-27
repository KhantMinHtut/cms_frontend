import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShiftPopupComponent } from './shift-popup.component';

describe('ShiftPopupComponent', () => {
  let component: ShiftPopupComponent;
  let fixture: ComponentFixture<ShiftPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ShiftPopupComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ShiftPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
