import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgencyPersonelComponent } from './agency-personel.component';

describe('AgencyPersonelComponent', () => {
  let component: AgencyPersonelComponent;
  let fixture: ComponentFixture<AgencyPersonelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AgencyPersonelComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AgencyPersonelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
