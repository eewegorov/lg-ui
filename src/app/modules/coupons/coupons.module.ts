import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { CouponsRoutingModule } from './coupons-routing.module';
import { CouponsListComponent } from './coupons-list/coupons-list.component';
import { CouponAddComponent } from './coupon-add/coupon-add.component';
import { CouponMultipleComponent } from './coupon-multiple/coupon-multiple.component';
import { CouponUniqueComponent } from './coupon-unique/coupon-unique.component';
import { CouponsComponent } from './coupons/coupons.component';


@NgModule({
  declarations: [
    CouponsListComponent,
    CouponAddComponent,
    CouponMultipleComponent,
    CouponUniqueComponent,
    CouponsComponent
  ],
  imports: [
    CommonModule,
    TranslateModule,
    CouponsRoutingModule
  ]
})
export class CouponsModule { }
