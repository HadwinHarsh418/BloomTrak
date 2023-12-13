import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddVendorContractsComponent } from './add-vendor-contracts.component';

describe('AddVendorContractsComponent', () => {
  let component: AddVendorContractsComponent;
  let fixture: ComponentFixture<AddVendorContractsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddVendorContractsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddVendorContractsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
