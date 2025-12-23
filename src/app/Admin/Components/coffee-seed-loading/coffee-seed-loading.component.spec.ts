import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CoffeeSeedLoadingComponent } from './coffee-seed-loading.component';

describe('CoffeeSeedLoadingComponent', () => {
  let component: CoffeeSeedLoadingComponent;
  let fixture: ComponentFixture<CoffeeSeedLoadingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CoffeeSeedLoadingComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CoffeeSeedLoadingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
