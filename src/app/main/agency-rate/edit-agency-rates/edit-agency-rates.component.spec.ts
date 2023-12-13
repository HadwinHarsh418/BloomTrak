import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditAgencyRatesComponent } from './edit-agency-rates.component';

describe('EditAgencyRatesComponent', () => {
  let component: EditAgencyRatesComponent;
  let fixture: ComponentFixture<EditAgencyRatesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditAgencyRatesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditAgencyRatesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
