import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LinkGuidelinesComponent } from './link-guidelines.component';

describe('LinkGuidelinesComponent', () => {
  let component: LinkGuidelinesComponent;
  let fixture: ComponentFixture<LinkGuidelinesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LinkGuidelinesComponent]
    });
    fixture = TestBed.createComponent(LinkGuidelinesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
