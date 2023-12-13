import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgencyRateComponent } from './agency-rate.component';

describe('AgencyRateComponent', () => {
  let component: AgencyRateComponent;
  let fixture: ComponentFixture<AgencyRateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AgencyRateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AgencyRateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
