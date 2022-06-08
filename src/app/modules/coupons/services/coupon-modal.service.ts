import { Injectable } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CouponAddComponent } from '../components/coupon-add/coupon-add.component';
import { CouponService } from './coupon.service';

@Injectable({
  providedIn: 'root'
})
export class CouponModalService {
  constructor(private modalService: NgbModal, private couponService: CouponService) {}

  public openCouponModal(coupon?) {
    const modalRef = this.modalService.open(CouponAddComponent, {
      size: 'lg',
      windowClass: 'animate__animated animate__slideInDown animate__faster'
    });
    modalRef.componentInstance.currentCoupon = coupon || null;
    modalRef.result
      .then((result: boolean) => {
        if (result) {
          this.couponService.updateCouponsList.next();
        }
      })
      .catch(() => {});
  }
}
