import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { CoolInlineEditFieldModule } from '@angular-cool/inline-edit-field';
import { UiSwitchModule } from 'ngx-ui-switch';
import { SharedModule } from '../../shared/shared.module';
import { CouponsRoutingModule } from './coupons-routing.module';
import { CouponsComponent } from './pages/coupons/coupons.component';
import { CouponsListComponent } from './components/coupons-list/coupons-list.component';
import { CouponAddComponent } from './components/coupon-add/coupon-add.component';
import { CouponMultipleComponent } from './components/coupon-multiple/coupon-multiple.component';
import { CouponUniqueComponent } from './components/coupon-unique/coupon-unique.component';
import { InlineSVGModule } from 'ng-inline-svg-2';

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
    CoolInlineEditFieldModule,
    UiSwitchModule,
    SharedModule,
    CouponsRoutingModule,
    InlineSVGModule
  ]
})
export class CouponsModule {}
