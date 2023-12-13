import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClockStepperComponent } from './clock-stepper.component';

describe('ClockStepperComponent', () => {
  let component: ClockStepperComponent;
  let fixture: ComponentFixture<ClockStepperComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ClockStepperComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ClockStepperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
