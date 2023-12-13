import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { FlexMenuComponent } from './view-dropdown.component';

describe('FlexMenuComponent', () => {
  let component: FlexMenuComponent;
  let fixture: ComponentFixture<FlexMenuComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ FlexMenuComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FlexMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
