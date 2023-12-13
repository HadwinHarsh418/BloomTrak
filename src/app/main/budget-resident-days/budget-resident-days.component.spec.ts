import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BudgetResidentDaysComponent } from './budget-resident-days.component';

describe('BudgetResidentDaysComponent', () => {
  let component: BudgetResidentDaysComponent;
  let fixture: ComponentFixture<BudgetResidentDaysComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BudgetResidentDaysComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BudgetResidentDaysComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
