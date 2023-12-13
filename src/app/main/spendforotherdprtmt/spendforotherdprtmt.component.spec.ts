import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpendforotherdprtmtComponent } from './spendforotherdprtmt.component';

describe('SpendforotherdprtmtComponent', () => {
  let component: SpendforotherdprtmtComponent;
  let fixture: ComponentFixture<SpendforotherdprtmtComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SpendforotherdprtmtComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SpendforotherdprtmtComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
