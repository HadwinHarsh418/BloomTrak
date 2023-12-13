import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddspendforotherdprtmtComponent } from './addspendforotherdprtmt.component';

describe('AddspendforotherdprtmtComponent', () => {
  let component: AddspendforotherdprtmtComponent;
  let fixture: ComponentFixture<AddspendforotherdprtmtComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddspendforotherdprtmtComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddspendforotherdprtmtComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
