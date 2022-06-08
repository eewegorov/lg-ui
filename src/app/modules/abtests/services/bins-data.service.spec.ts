import { TestBed } from '@angular/core/testing';

import { BinsDataService } from './bins-data.service';

describe('BinsDataService', () => {
  let service: BinsDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BinsDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
