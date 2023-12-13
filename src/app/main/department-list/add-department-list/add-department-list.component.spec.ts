import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddDepartmentListComponent } from './add-department-list.component';

describe('AddDepartmentListComponent', () => {
  let component: AddDepartmentListComponent;
  let fixture: ComponentFixture<AddDepartmentListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddDepartmentListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddDepartmentListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
