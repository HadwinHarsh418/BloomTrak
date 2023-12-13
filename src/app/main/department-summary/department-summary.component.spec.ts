import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DepartmentSummaryComponent } from './department-summary.component';

describe('DepartmentSummaryComponent', () => {
  let component: DepartmentSummaryComponent;
  let fixture: ComponentFixture<DepartmentSummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DepartmentSummaryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DepartmentSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
