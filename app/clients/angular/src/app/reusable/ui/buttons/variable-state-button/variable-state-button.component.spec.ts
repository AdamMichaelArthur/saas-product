import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VariableStateButtonComponent } from './variable-state-button.component';

describe('VariableStateButtonComponent', () => {
  let component: VariableStateButtonComponent;
  let fixture: ComponentFixture<VariableStateButtonComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [VariableStateButtonComponent]
    });
    fixture = TestBed.createComponent(VariableStateButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
