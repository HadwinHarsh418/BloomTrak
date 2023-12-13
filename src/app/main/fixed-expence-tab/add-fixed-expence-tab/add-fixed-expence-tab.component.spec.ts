import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddFixedExpenceTabComponent } from './add-fixed-expence-tab.component';

describe('AddFixedExpenceTabComponent', () => {
  let component: AddFixedExpenceTabComponent;
  let fixture: ComponentFixture<AddFixedExpenceTabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddFixedExpenceTabComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddFixedExpenceTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
