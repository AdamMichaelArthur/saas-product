import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { DynamicPriceComponent } from './dynamic-price.component';

describe('DynamicPriceComponent', () => {
  let component: DynamicPriceComponent;
  let fixture: ComponentFixture<DynamicPriceComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ DynamicPriceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DynamicPriceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
