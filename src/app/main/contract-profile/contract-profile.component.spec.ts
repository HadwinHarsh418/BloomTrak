import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContractProfileComponent } from './contract-profile.component';

describe('ContractProfileComponent', () => {
  let component: ContractProfileComponent;
  let fixture: ComponentFixture<ContractProfileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ContractProfileComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ContractProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
