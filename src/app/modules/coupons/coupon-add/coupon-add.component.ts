import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CouponService } from '../services/coupon.service';

@Component({
  selector: 'app-coupon-add',
  templateUrl: './coupon-add.component.html',
  styleUrls: ['./coupon-add.component.scss']
})
export class CouponAddComponent implements OnInit {
  @Input() public currentCoupon;
  public couponTypeLabel;
  public editableCoupon;
  public tags;
  public currentActiveCouponType;

  constructor(
    private activeModal: NgbActiveModal,
    private couponService: CouponService
  ) { }

  ngOnInit(): void {
  }

  public setCouponType(newTab) {
    this.currentActiveCouponType = newTab;
    this.editableCoupon.type = newTab;
  };

  public isCurrentActiveCouponType(tab) {
    return this.currentActiveCouponType === tab;
  };

  public closeModal(result?): void {
    this.activeModal.close(result);
  }

  public createCoupon() {
    const couponForSave = {
      name: this.editableCoupon.name,
      code: this.editableCoupon.code,
      type: this.currentActiveCouponType,
      defaultValue: this.editableCoupon.defaultValue,
      values: null,
      needUseDefault: null,
      notificationThreshold: null
    };
    if (this.currentActiveCouponType === "REUSABLE") {
      couponForSave.values = this.unmappedCoupons(this.tags);
      couponForSave.needUseDefault = this.editableCoupon.needUseDefault;
      couponForSave.notificationThreshold = this.editableCoupon.notificationThreshold;
      if (!this.editableCoupon.needUseDefault) {
        delete couponForSave.defaultValue;
      }
    }
    if (this.currentCoupon) {
      this.couponService.updateCoupon(this.currentCoupon.id, couponForSave).subscribe((response) => {
        if (response) {
          this.closeModal(response);
        }
      });
    } else {
      this.couponService.createCoupon(couponForSave).subscribe((response) => {
        if (response) {
          this.closeModal(response);
        }
      });
    }
  };

  private unmappedCoupons(list: string): string[] {
    return list.split("\n");
  }

}
