import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GetpaidComponent } from './getpaid.component';

describe('GetpaidComponent', () => {
  let component: GetpaidComponent;
  let fixture: ComponentFixture<GetpaidComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GetpaidComponent]
    });
    fixture = TestBed.createComponent(GetpaidComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
