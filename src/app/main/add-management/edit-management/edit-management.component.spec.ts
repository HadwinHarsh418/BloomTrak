import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditManagementComponent } from './edit-management.component';

describe('EditManagementComponent', () => {
  let component: EditManagementComponent;
  let fixture: ComponentFixture<EditManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditManagementComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
