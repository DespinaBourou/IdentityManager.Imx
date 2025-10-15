import { TestBed } from '@angular/core/testing';

import { ApiresponseGuardGuard } from './apiresponse-guard.guard';

describe('ApiresponseGuardGuard', () => {
  let guard: ApiresponseGuardGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(ApiresponseGuardGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
