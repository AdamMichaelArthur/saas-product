import { ComponentFixture, TestBed } from '@angular/core/testing';

import { YourfullschoolComponent } from './yourfullschool.component';

describe('YourfullschoolComponent', () => {
  let component: YourfullschoolComponent;
  let fixture: ComponentFixture<YourfullschoolComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [YourfullschoolComponent]
    });
    fixture = TestBed.createComponent(YourfullschoolComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
