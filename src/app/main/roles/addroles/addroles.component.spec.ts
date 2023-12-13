import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddrolesComponent } from './addroles.component';

describe('AddrolesComponent', () => {
  let component: AddrolesComponent;
  let fixture: ComponentFixture<AddrolesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddrolesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddrolesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
