import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SignupsComponent } from './signups.component';

describe('SignupsComponent', () => {
  let component: SignupsComponent;
  let fixture: ComponentFixture<SignupsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SignupsComponent]
    });
    fixture = TestBed.createComponent(SignupsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
