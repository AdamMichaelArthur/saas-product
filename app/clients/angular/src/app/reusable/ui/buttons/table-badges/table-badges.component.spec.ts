import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TableBadgesComponent } from './table-badges.component';

describe('TableBadgesComponent', () => {
  let component: TableBadgesComponent;
  let fixture: ComponentFixture<TableBadgesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TableBadgesComponent]
    });
    fixture = TestBed.createComponent(TableBadgesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
