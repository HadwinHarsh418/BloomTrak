import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddBudgetResidentComponent } from './add-budget-resident.component';

describe('AddBudgetResidentComponent', () => {
  let component: AddBudgetResidentComponent;
  let fixture: ComponentFixture<AddBudgetResidentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddBudgetResidentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddBudgetResidentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
