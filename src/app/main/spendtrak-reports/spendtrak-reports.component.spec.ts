import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpendtrakReportsComponent } from './spendtrak-reports.component';

describe('SpendtrakReportsComponent', () => {
  let component: SpendtrakReportsComponent;
  let fixture: ComponentFixture<SpendtrakReportsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SpendtrakReportsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SpendtrakReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
