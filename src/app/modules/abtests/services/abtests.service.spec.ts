import { TestBed } from '@angular/core/testing';

import { AbtestsService } from './abtests.service';

describe('AbtestsService', () => {
  let service: AbtestsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AbtestsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
