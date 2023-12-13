import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GenericLoadingButtonComponent } from './generic-loading-button.component';

describe('GenericLoadingButtonComponent', () => {
  let component: GenericLoadingButtonComponent;
  let fixture: ComponentFixture<GenericLoadingButtonComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GenericLoadingButtonComponent]
    });
    fixture = TestBed.createComponent(GenericLoadingButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
