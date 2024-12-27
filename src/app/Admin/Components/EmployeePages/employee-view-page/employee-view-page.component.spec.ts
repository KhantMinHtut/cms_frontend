import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeViewPageComponent } from './employee-view-page.component';

describe('EmployeeViewPageComponent', () => {
  let component: EmployeeViewPageComponent;
  let fixture: ComponentFixture<EmployeeViewPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EmployeeViewPageComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EmployeeViewPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
