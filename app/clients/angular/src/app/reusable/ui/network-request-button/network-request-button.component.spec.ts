import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NetworkRequestButtonComponent } from './network-request-button.component';

describe('NetworkRequestButtonComponent', () => {
  let component: NetworkRequestButtonComponent;
  let fixture: ComponentFixture<NetworkRequestButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NetworkRequestButtonComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NetworkRequestButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
