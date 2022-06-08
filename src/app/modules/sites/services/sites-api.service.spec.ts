import { TestBed } from '@angular/core/testing';

import { SitesApiService } from './sites-api.service';

describe('SitesApiService', () => {
  let service: SitesApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SitesApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
