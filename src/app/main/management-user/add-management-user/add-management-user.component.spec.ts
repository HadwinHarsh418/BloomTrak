import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddManagementUserComponent } from './add-management-user.component';

describe('AddManagementUserComponent', () => {
  let component: AddManagementUserComponent;
  let fixture: ComponentFixture<AddManagementUserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddManagementUserComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddManagementUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
