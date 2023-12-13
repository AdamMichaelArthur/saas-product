import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FlextableComponent } from './flextable.component';

describe('FlextableComponent', () => {
  let component: FlextableComponent;
  let fixture: ComponentFixture<FlextableComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FlextableComponent]
    });
    fixture = TestBed.createComponent(FlextableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
