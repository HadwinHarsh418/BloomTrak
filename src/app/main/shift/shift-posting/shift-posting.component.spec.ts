import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShiftPostingComponent } from './shift-posting.component';

describe('ShiftPostingComponent', () => {
  let component: ShiftPostingComponent;
  let fixture: ComponentFixture<ShiftPostingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShiftPostingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShiftPostingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
