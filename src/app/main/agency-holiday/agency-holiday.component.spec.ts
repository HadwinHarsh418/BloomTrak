import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgencyHolidayComponent } from './agency-holiday.component';

describe('AgencyHolidayComponent', () => {
  let component: AgencyHolidayComponent;
  let fixture: ComponentFixture<AgencyHolidayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AgencyHolidayComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AgencyHolidayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
