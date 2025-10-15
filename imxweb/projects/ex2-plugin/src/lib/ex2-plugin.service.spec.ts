import { TestBed } from '@angular/core/testing';

import { Ex2PluginService } from './ex2-plugin.service';

describe('Ex2PluginService', () => {
  let service: Ex2PluginService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Ex2PluginService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
