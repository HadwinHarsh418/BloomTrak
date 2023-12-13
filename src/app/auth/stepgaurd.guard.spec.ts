import { TestBed } from '@angular/core/testing';

import { StepgaurdGuard } from './stepgaurd.guard';

describe('StepgaurdGuard', () => {
  let guard: StepgaurdGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(StepgaurdGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
