import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HowtouseComponent } from './howtouse.component';

describe('HowtouseComponent', () => {
  let component: HowtouseComponent;
  let fixture: ComponentFixture<HowtouseComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [HowtouseComponent]
    });
    fixture = TestBed.createComponent(HowtouseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
