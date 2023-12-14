import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NeedsComponent } from './needs.component';

describe('NeedsComponent', () => {
  let component: NeedsComponent;
  let fixture: ComponentFixture<NeedsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NeedsComponent]
    });
    fixture = TestBed.createComponent(NeedsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
