import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestedShiftsComponent } from './requested-shifts.component';

describe('RequestedShiftsComponent', () => {
  let component: RequestedShiftsComponent;
  let fixture: ComponentFixture<RequestedShiftsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RequestedShiftsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RequestedShiftsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
