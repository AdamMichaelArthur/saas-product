import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RowbuttonComponent } from './rowbutton.component';

describe('RowbuttonComponent', () => {
  let component: RowbuttonComponent;
  let fixture: ComponentFixture<RowbuttonComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RowbuttonComponent]
    });
    fixture = TestBed.createComponent(RowbuttonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
