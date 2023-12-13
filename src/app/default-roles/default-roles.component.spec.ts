import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DefaultRolesComponent } from './default-roles.component';

describe('DefaultRolesComponent', () => {
  let component: DefaultRolesComponent;
  let fixture: ComponentFixture<DefaultRolesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DefaultRolesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DefaultRolesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
