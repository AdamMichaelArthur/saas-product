import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TableLoadingButtonComponent } from './table-loading-button.component';

describe('TableLoadingButtonComponent', () => {
  let component: TableLoadingButtonComponent;
  let fixture: ComponentFixture<TableLoadingButtonComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TableLoadingButtonComponent]
    });
    fixture = TestBed.createComponent(TableLoadingButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
