import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlanmanagementComponent } from './planmanagement.component';

describe('PlanmanagementComponent', () => {
  let component: PlanmanagementComponent;
  let fixture: ComponentFixture<PlanmanagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PlanmanagementComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PlanmanagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
