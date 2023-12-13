import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddagencyHolidayComponent } from './addagency-holiday.component';

describe('AddagencyHolidayComponent', () => {
  let component: AddagencyHolidayComponent;
  let fixture: ComponentFixture<AddagencyHolidayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddagencyHolidayComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddagencyHolidayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
