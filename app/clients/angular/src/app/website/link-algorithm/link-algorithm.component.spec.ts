import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LinkAlgorithmComponent } from './link-algorithm.component';

describe('LinkAlgorithmComponent', () => {
  let component: LinkAlgorithmComponent;
  let fixture: ComponentFixture<LinkAlgorithmComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LinkAlgorithmComponent]
    });
    fixture = TestBed.createComponent(LinkAlgorithmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
