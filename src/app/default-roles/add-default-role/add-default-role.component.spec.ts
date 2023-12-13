import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddDefaultRoleComponent } from './add-default-role.component';

describe('AddDefaultRoleComponent', () => {
  let component: AddDefaultRoleComponent;
  let fixture: ComponentFixture<AddDefaultRoleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddDefaultRoleComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddDefaultRoleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
