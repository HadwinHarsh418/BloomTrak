import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IdentificationModalComponent } from './identification-modal.component';

describe('IdentificationModalComponent', () => {
  let component: IdentificationModalComponent;
  let fixture: ComponentFixture<IdentificationModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IdentificationModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IdentificationModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
