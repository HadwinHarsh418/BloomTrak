import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddAgencyRateComponent } from './add-agency-rate.component';

describe('AddAgencyRateComponent', () => {
  let component: AddAgencyRateComponent;
  let fixture: ComponentFixture<AddAgencyRateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddAgencyRateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddAgencyRateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
