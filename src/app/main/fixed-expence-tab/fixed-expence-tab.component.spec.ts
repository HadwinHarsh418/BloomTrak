import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FixedExpenceTabComponent } from './fixed-expence-tab.component';

describe('FixedExpenceTabComponent', () => {
  let component: FixedExpenceTabComponent;
  let fixture: ComponentFixture<FixedExpenceTabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FixedExpenceTabComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FixedExpenceTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
