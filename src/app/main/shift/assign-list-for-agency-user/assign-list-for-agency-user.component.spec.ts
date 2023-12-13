import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignListForAgencyUserComponent } from './assign-list-for-agency-user.component';

describe('AssignListForAgencyUserComponent', () => {
  let component: AssignListForAgencyUserComponent;
  let fixture: ComponentFixture<AssignListForAgencyUserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AssignListForAgencyUserComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AssignListForAgencyUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
