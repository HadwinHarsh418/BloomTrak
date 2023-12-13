import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddAdminSettingsComponent } from './add-admin-settings.component';

describe('AddAdminSettingsComponent', () => {
  let component: AddAdminSettingsComponent;
  let fixture: ComponentFixture<AddAdminSettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddAdminSettingsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddAdminSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
