import { Component, Input, OnInit } from '@angular/core';
import { Coupon, CouponCallback } from '@core/models/coupons';
import { CouponService } from '../../../../../coupons/services/coupon.service';
import { WidgetService } from '../../../../services/widget.service';

@Component({
  selector: 'app-coupon-callback',
  templateUrl: './coupon-callback.component.html',
  styleUrls: ['../../../../shared/shared.scss', './coupon-callback.component.scss']
})
export class CouponCallbackComponent implements OnInit {
  @Input() public coupons: Coupon[];
  @Input() public coupon: CouponCallback;
  @Input() public placePopup: string[];
  @Input() public showErrors: boolean;

  constructor(private couponService: CouponService, private widgetService: WidgetService) {}

  ngOnInit(): void {}

  public onChangePayment(couponEnabled) {
    this.widgetService.onChangePayment.next(couponEnabled);
  }

  public refreshCouponsList() {
    ($('[data-toggle="tooltip"]') as any).tooltip('hide');
    this.couponService.updateCouponsList.next();
  }
}
