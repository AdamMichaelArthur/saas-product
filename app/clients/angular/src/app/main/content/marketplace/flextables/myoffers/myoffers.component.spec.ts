import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyoffersComponent } from './myoffers.component';

describe('MyoffersComponent', () => {
  let component: MyoffersComponent;
  let fixture: ComponentFixture<MyoffersComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MyoffersComponent]
    });
    fixture = TestBed.createComponent(MyoffersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
