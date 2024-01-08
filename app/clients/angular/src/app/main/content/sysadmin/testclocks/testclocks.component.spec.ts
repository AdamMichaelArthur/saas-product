import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestclocksComponent } from './testclocks.component';

describe('TestclocksComponent', () => {
  let component: TestclocksComponent;
  let fixture: ComponentFixture<TestclocksComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TestclocksComponent]
    });
    fixture = TestBed.createComponent(TestclocksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
