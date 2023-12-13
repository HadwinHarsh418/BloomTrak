import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComunityBudgetComponent } from './comunity-budget.component';

describe('ComunityBudgetComponent', () => {
  let component: ComunityBudgetComponent;
  let fixture: ComponentFixture<ComunityBudgetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ComunityBudgetComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ComunityBudgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
