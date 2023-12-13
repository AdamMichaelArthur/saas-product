import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PermissionsCellComponent } from './permissions-cell.component';

describe('PermissionsCellComponent', () => {
  let component: PermissionsCellComponent;
  let fixture: ComponentFixture<PermissionsCellComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PermissionsCellComponent]
    });
    fixture = TestBed.createComponent(PermissionsCellComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
