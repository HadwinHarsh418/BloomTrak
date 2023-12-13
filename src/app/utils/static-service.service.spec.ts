import { TestBed } from '@angular/core/testing';

import { StaticServiceService } from './static-service.service';

describe('StaticServiceService', () => {
  let service: StaticServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StaticServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
