import { TestBed } from '@angular/core/testing';

import { PartnerApiService } from './partner-api.service';

describe('PartnerApiService', () => {
  let service: PartnerApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PartnerApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
