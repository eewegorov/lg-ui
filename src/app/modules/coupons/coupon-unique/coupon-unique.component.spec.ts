import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CouponUniqueComponent } from './coupon-unique.component';

describe('CouponUniqueComponent', () => {
  let component: CouponUniqueComponent;
  let fixture: ComponentFixture<CouponUniqueComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [CouponUniqueComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CouponUniqueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
