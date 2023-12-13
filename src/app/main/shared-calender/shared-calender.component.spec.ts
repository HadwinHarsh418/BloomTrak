import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SharedCalenderComponent } from './shared-calender.component';

describe('SharedCalenderComponent', () => {
  let component: SharedCalenderComponent;
  let fixture: ComponentFixture<SharedCalenderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SharedCalenderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SharedCalenderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
