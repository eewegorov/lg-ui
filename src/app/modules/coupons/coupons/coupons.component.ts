import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CouponAddComponent } from '../coupon-add/coupon-add.component';

@Component({
  selector: 'app-coupons',
  templateUrl: './coupons.component.html',
  styleUrls: ['./coupons.component.scss']
})
export class CouponsComponent implements OnInit {
  private coupons = [];

  constructor(private modalService: NgbModal) { }

  ngOnInit(): void {
  }

  public getCouponsList() {
    this.coupons = [];
    /*CouponsService.getCouponsList().then(function (response) {
      if (response.code === 200) {
        $scope.isSitesListLoaded = true;
        $scope.coupons = response.data;

        if (enableCouponModal) {
          enableCouponModal = false;
          $timeout(function() {
            openCouponModal();
          }, 500);
        }
      }
    });*/
  }

  public openCouponModal(coupon?) {
    const modalRef = this.modalService.open(CouponAddComponent, {
      size: 'lg',
      windowClass: 'animate__animated animate__slideInDown animate__faster'
    });
    modalRef.componentInstance.currentCoupon = coupon || null;
    modalRef.result.then((result: boolean) => {
      if (result) {
        /*getCouponsList();*/
      }
    });
  }

}
