import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreregisterComponent } from './preregister.component';

describe('PreregisterComponent', () => {
  let component: PreregisterComponent;
  let fixture: ComponentFixture<PreregisterComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PreregisterComponent]
    });
    fixture = TestBed.createComponent(PreregisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
