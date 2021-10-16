import { AfterViewChecked, Component, Input, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { UtilsService } from '../../../core/services/utils.service';
import { CouponService } from '../services/coupon.service';


@Component({
  selector: 'app-coupon-add',
  templateUrl: './coupon-add.component.html',
  styleUrls: ['./coupon-add.component.scss']
})
export class CouponAddComponent implements OnInit, AfterViewChecked {
  @Input() public currentCoupon;
  public couponTypeLabel;
  public editableCoupon;
  public tags = '';
  public currentActiveCouponType;

  constructor(
    private translate: TranslateService,
    private activeModal: NgbActiveModal,
    private utilsService: UtilsService,
    private couponService: CouponService
  ) { }

  ngOnInit(): void {
    if (this.currentCoupon) {
      this.currentActiveCouponType = this.currentCoupon.type;

      this.couponTypeLabel = this.currentCoupon.type === 'REUSABLE' ?
        this.translate.instant('coupons.modal.newCoupon.tab2.title') :
        this.translate.instant('coupons.modal.newCoupon.tab1.title');

      this.editableCoupon = { ...this.currentCoupon };
      if (this.currentActiveCouponType === 'REUSABLE') {
        this.tags = this.mappedCoupons(this.editableCoupon.values);
      }
    } else {
      this.currentActiveCouponType = 'SINGABLE';
      this.editableCoupon = {
        name: '',
        code: this.utilsService.generateShortID(),
        value: '',
        needUseDefault: false,
        notificationThreshold: 10
      };
    }
  }

  ngAfterViewChecked(): void {
    ($('[data-toggle="tooltip"]') as any).tooltip({ trigger: 'hover' });
  }

  public setCouponType(newTab) {
    this.currentActiveCouponType = newTab;
    this.editableCoupon.type = newTab;
  }

  public isCurrentActiveCouponType(tab: string): boolean {
    return this.currentActiveCouponType === tab;
  }

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
    if (this.currentActiveCouponType === 'REUSABLE') {
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
  }

  private unmappedCoupons(list: string): string[] {
    return list.split('\n');
  }

  private mappedCoupons(list: string[]): string {
    return list.join('\n');
  }

}
