import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { FlexDropdownComponent } from './flex-dropdown.component';

describe('FlexDropdownComponent', () => {
  let component: FlexDropdownComponent;
  let fixture: ComponentFixture<FlexDropdownComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ FlexDropdownComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FlexDropdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
