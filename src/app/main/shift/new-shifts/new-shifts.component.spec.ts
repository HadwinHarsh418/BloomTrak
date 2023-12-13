import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewShiftsComponent } from './new-shifts.component';

describe('NewShiftsComponent', () => {
  let component: NewShiftsComponent;
  let fixture: ComponentFixture<NewShiftsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewShiftsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NewShiftsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
