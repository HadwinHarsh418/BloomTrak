import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddSpendDownComponent } from './add-spend-down.component';

describe('AddSpendDownComponent', () => {
  let component: AddSpendDownComponent;
  let fixture: ComponentFixture<AddSpendDownComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddSpendDownComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddSpendDownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
