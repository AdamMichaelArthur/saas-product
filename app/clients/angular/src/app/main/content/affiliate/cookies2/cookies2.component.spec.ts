import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Cookies2Component } from './cookies2.component';

describe('Cookies2Component', () => {
  let component: Cookies2Component;
  let fixture: ComponentFixture<Cookies2Component>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [Cookies2Component]
    });
    fixture = TestBed.createComponent(Cookies2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
