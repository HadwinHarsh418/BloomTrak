import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditManagementUserComponent } from './edit-management-user.component';

describe('EditManagementUserComponent', () => {
  let component: EditManagementUserComponent;
  let fixture: ComponentFixture<EditManagementUserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditManagementUserComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditManagementUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
