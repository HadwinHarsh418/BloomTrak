import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScheduleTimerComponent } from './schedule-timer.component';

describe('ScheduleTimerComponent', () => {
  let component: ScheduleTimerComponent;
  let fixture: ComponentFixture<ScheduleTimerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ScheduleTimerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ScheduleTimerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
