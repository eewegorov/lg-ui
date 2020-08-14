import { TestBed } from '@angular/core/testing';

import { CouponModalService } from './coupon-modal.service';

describe('CouponModalService', () => {
  let service: CouponModalService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CouponModalService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
