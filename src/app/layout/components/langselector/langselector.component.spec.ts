import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LangselectorComponent } from './langselector.component';

describe('LangselectorComponent', () => {
  let component: LangselectorComponent;
  let fixture: ComponentFixture<LangselectorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LangselectorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LangselectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
