import { AfterViewInit, Component, Input, OnChanges } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';
import { CouponById } from '@core/models/coupons';
import { CouponService } from '../../services/coupon.service';
import { CouponModalService } from '../../services/coupon-modal.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';

@Component({
  selector: 'app-coupons-list',
  templateUrl: './coupons-list.component.html',
  styleUrls: ['./coupons-list.component.scss']
})
export class CouponsListComponent implements OnChanges, AfterViewInit {
  @Input() public first: boolean;
  @Input() public coupon;
  public couponCodeToPaste: string;

  public readonly couponNameEditing$: Observable<boolean>;
  public couponEditingName: string;

  private readonly _couponNameEditing$: BehaviorSubject<boolean>;

  constructor(
    private translate: TranslateService,
    private toastr: ToastrService,
    private couponModalService: CouponModalService,
    private couponService: CouponService
  ) {
    this._couponNameEditing$ = new BehaviorSubject<boolean>(false);
    this.couponNameEditing$ = this._couponNameEditing$.asObservable().pipe(
      tap((state: boolean) => {
        if (state) {
          this.couponEditingName = this.coupon.name;
        } else {
          this.couponEditingName = '';
        }
      })
    );
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      ($('[data-toggle="tooltip"]') as any).tooltip({ trigger: 'hover' });
    }, 1000);
  }

  ngOnChanges(): void {
    this.couponCodeToPaste = `[coupon_${this.coupon.code}]`;
  }

  public toggleCouponNameEditing(): void {
    ($('[data-toggle="tooltip"]') as any).tooltip('hide');
    this._couponNameEditing$.next(!this._couponNameEditing$.getValue());
  }

  public updateCoupon(): void {
    ($('[data-toggle="tooltip"]') as any).tooltip('hide');
    if (
      this.couponEditingName === this.coupon.name ||
      !this.couponEditingName.length ||
      this.couponEditingName.length > 44
    ) {
      this.toggleCouponNameEditing();
      return;
    }
    this.coupon.name = this.couponEditingName;
    this.couponService
      .getCouponById(this.coupon.id)
      .pipe(
        switchMap((response: CouponById) => {
          if (response) {
            const couponForSave = response;
            couponForSave.name = this.couponEditingName;
            return this.couponService.updateCoupon(this.coupon.id, couponForSave);
          }
        })
      )
      .subscribe(() => this.toggleCouponNameEditing());
  }

  public copyCouponCode(): void {
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

  public openEditableCouponModal(): void {
    this.couponService.getCouponById(this.coupon.id).subscribe((response: CouponById) => {
      if (response) {
        this.couponModalService.openCouponModal(response);
      }
    });
  }

  public removeCoupon(): void {
    Swal.fire({
      title: this.translate.instant('coupons.coupon.delete.title'),
      text: this.translate.instant('coupons.coupon.delete.text'),
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#DD6B55',
      confirmButtonText: this.translate.instant('coupons.coupon.delete.tooltip'),
      cancelButtonText: this.translate.instant('widgetsList.widget.delete.cancel')
    }).then(isConfirm => {
      if (isConfirm) {
        this.couponService.deleteCoupon(this.coupon.id).subscribe((response: boolean) => {
          if (response) {
            this.toastr.success(
              this.translate.instant('coupons.coupon.delete.desc'),
              this.translate.instant('global.done')
            );
          }
          this.couponService.updateCouponsList.next();
        });
      }
    });
  }
}
