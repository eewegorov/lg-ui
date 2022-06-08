import { TestBed } from '@angular/core/testing';

import { AbtestsApiService } from './abtests-api.service';

describe('AbtestsApiService', () => {
  let service: AbtestsApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AbtestsApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
