import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PromptPlaygroundComponent } from './prompt-playground.component';

describe('PromptPlaygroundComponent', () => {
  let component: PromptPlaygroundComponent;
  let fixture: ComponentFixture<PromptPlaygroundComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PromptPlaygroundComponent]
    });
    fixture = TestBed.createComponent(PromptPlaygroundComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
