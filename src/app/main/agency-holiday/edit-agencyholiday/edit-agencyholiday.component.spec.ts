import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditAgencyholidayComponent } from './edit-agencyholiday.component';

describe('EditAgencyholidayComponent', () => {
  let component: EditAgencyholidayComponent;
  let fixture: ComponentFixture<EditAgencyholidayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditAgencyholidayComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditAgencyholidayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
