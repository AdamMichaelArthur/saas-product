import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProposeExchangeComponent } from './propose-exchange.component';

describe('ProposeExchangeComponent', () => {
  let component: ProposeExchangeComponent;
  let fixture: ComponentFixture<ProposeExchangeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ProposeExchangeComponent]
    });
    fixture = TestBed.createComponent(ProposeExchangeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
