import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { CouponService } from '../services/coupon.service';
import { CouponById } from '../../../core/models/coupons';

@Component({
  selector: 'app-coupons-list',
  templateUrl: './coupons-list.component.html',
  styleUrls: ['./coupons-list.component.scss']
})
export class CouponsListComponent implements OnInit, OnChanges {
  @Input() public coupon;
  public couponCodeToPaste: string;
  private fixedCoupon;
  private updatedEarlier = false;

  constructor(
    private couponService: CouponService
  ) { }

  ngOnInit(): void {
  }

  ngOnChanges(): void {
    this.couponCodeToPaste = `[coupon_${this.coupon.code}]`;
  }

  public fixOldCoupon(data: string) {
    this.fixedCoupon = this.coupon.name;
  }

  public updateCoupon(data: string) {
    if (this.updatedEarlier) {
      this.updatedEarlier = false;
      return;
    }
    if (!data) {
      setTimeout(() => {
        this.coupon.name = this.fixedCoupon;
      }, 0);
      return;
    }
    this.coupon.name = data;
    this.updatedEarlier = true;
    this.couponService.getCouponById(this.coupon.id).subscribe((response: CouponById) => {
      if (response) {
        const couponForSave = response;
        couponForSave.name = data;
        this.couponService.updateCoupon(this.coupon.id, couponForSave);
      }
    });
  }

}
