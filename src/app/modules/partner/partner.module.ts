import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { PartnerRoutingModule } from './partner-routing.module';
import { PartnerComponent } from './partner/partner.component';
import { PromotionalComponent } from './promotional/promotional.component';
import { PartnerLinkComponent } from './partner-link/partner-link.component';
import { ReferralAddComponent } from './referral-add/referral-add.component';
import { PartnerBalanceComponent } from './partner-balance/partner-balance.component';
import { PartnerStatisticsComponent } from './partner-statistics/partner-statistics.component';
import { PartnerBannerComponent } from './partner-banner/partner-banner.component';
import { PartnerShowComponent } from './partner-show/partner-show.component';


@NgModule({
  declarations: [
    PartnerComponent,
    PromotionalComponent,
    PartnerLinkComponent,
    ReferralAddComponent,
    PartnerBalanceComponent,
    PartnerStatisticsComponent,
    PartnerBannerComponent,
    PartnerShowComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    TranslateModule,
    PartnerRoutingModule
  ]
})
export class PartnerModule { }
