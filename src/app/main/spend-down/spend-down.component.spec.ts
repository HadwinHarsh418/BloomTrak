import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpendDownComponent } from './spend-down.component';

describe('SpendDownComponent', () => {
  let component: SpendDownComponent;
  let fixture: ComponentFixture<SpendDownComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SpendDownComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SpendDownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
