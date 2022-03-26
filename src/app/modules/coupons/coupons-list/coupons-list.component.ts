import { AfterViewInit, Component, Input, OnChanges, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';
import { CouponById } from '../../../core/models/coupons';
import { CouponService } from '../services/coupon.service';
import { CouponModalService } from '../services/coupon-modal.service';

@Component({
  selector: 'app-coupons-list',
  templateUrl: './coupons-list.component.html',
  styleUrls: ['./coupons-list.component.scss']
})
export class CouponsListComponent implements OnInit, OnChanges, AfterViewInit {
  @Input() public coupon;
  @Input() public isColoredRow = false;
  public couponCodeToPaste: string;
  private fixedCoupon;
  private updatedEarlier = false;

  constructor(
    private translate: TranslateService,
    private toastr: ToastrService,
    private couponModalService: CouponModalService,
    private couponService: CouponService
  ) {
  }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      ($('[data-toggle="tooltip"]') as any).tooltip({ trigger: 'hover' });
    }, 1000);
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
    if (!data || data.length > 44) {
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

  public copyCouponCode() {
    const el = document.createElement('textarea');
    el.value = this.couponCodeToPaste;
    el.setAttribute('readonly', '');
    el.style.position = 'absolute';
    el.style.left = '-9999px';
    document.body.appendChild(el);

    const selected = document.getSelection().rangeCount > 0 ? document.getSelection().getRangeAt(0) : false;
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
    if (selected) {
      document.getSelection().removeAllRanges();
      document.getSelection().addRange(selected);
    }

    this.toastr.success(this.translate.instant('coupons.coupon.copied.desc'), this.translate.instant('global.done'));
  }

  public openEditableCouponModal() {
    this.couponService.getCouponById(this.coupon.id).subscribe((response: CouponById) => {
      if (response) {
        this.couponModalService.openCouponModal(response);
      }
    });
  }

  public removeCoupon() {
    Swal.fire({
      title: this.translate.instant('coupons.coupon.delete.title'),
      text: this.translate.instant('coupons.coupon.delete.text'),
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#DD6B55',
      confirmButtonText: this.translate.instant('coupons.coupon.delete.tooltip'),
      cancelButtonText: this.translate.instant('widgetsList.widget.delete.cancel')
    }).then((isConfirm) => {
      if (isConfirm) {
        this.couponService.deleteCoupon(this.coupon.id).subscribe((response: boolean) => {
          if (response) {
            this.toastr.success(this.translate.instant('coupons.coupon.delete.desc'), this.translate.instant('global.done'));
          }
          this.couponService.updateCouponsList.next();
        });
      }
    });
  }

}
