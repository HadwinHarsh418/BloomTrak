import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Add2ManagementComponent } from './add2-management.component';

describe('Add2ManagementComponent', () => {
  let component: Add2ManagementComponent;
  let fixture: ComponentFixture<Add2ManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Add2ManagementComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Add2ManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
