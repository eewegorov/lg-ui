import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CouponCallbackComponent } from './coupon-callback.component';

describe('CouponCallbackComponent', () => {
  let component: CouponCallbackComponent;
  let fixture: ComponentFixture<CouponCallbackComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CouponCallbackComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CouponCallbackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
