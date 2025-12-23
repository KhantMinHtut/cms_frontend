import { ComponentFixture, TestBed } from '@angular/core/testing';

import { POSTerminalComponent } from './pos-terminal.component';

describe('POSTerminalComponent', () => {
  let component: POSTerminalComponent;
  let fixture: ComponentFixture<POSTerminalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [POSTerminalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(POSTerminalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
