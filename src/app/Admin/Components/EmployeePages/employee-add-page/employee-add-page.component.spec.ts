import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeAddPageComponent } from './employee-add-page.component';

describe('EmployeeAddPageComponent', () => {
  let component: EmployeeAddPageComponent;
  let fixture: ComponentFixture<EmployeeAddPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EmployeeAddPageComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EmployeeAddPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
