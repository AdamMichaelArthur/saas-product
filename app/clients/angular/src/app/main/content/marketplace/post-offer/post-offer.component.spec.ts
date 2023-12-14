import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PostOfferComponent } from './post-offer.component';

describe('PostOfferComponent', () => {
  let component: PostOfferComponent;
  let fixture: ComponentFixture<PostOfferComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PostOfferComponent]
    });
    fixture = TestBed.createComponent(PostOfferComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
