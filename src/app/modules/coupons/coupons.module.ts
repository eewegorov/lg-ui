import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { CouponsRoutingModule } from './coupons-routing.module';
import { CouponsComponent } from './coupons/coupons.component';
import { CouponsListComponent } from './coupons-list/coupons-list.component';
import { CouponAddComponent } from './coupon-add/coupon-add.component';
import { CouponMultipleComponent } from './coupon-multiple/coupon-multiple.component';
import { CouponUniqueComponent } from './coupon-unique/coupon-unique.component';


@NgModule({
  declarations: [
    CouponsComponent,
    CouponsListComponent,
    CouponAddComponent,
    CouponMultipleComponent,
    CouponUniqueComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    TranslateModule,
    CouponsRoutingModule
  ]
})
export class CouponsModule { }
