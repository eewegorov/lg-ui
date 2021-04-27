import { TestBed } from '@angular/core/testing';

import { CoreSitesService } from './core-sites.service';

describe('CoreSitesService', () => {
  let service: CoreSitesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CoreSitesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
