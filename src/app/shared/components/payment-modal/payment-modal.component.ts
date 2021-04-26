import { Component, Input, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { SitesService } from '../../../modules/sites/services/sites.service';
import { BillingService } from '../../../core/services/billing.service';

@Component({
  selector: 'app-payment-modal',
  templateUrl: './payment-modal.component.html',
  styleUrls: ['./payment-modal.component.scss']
})
export class PaymentModalComponent implements OnInit {
  @Input() public title;
  @Input() public subscription;
  @Input() private plans;
  @Input() private siteId;
  @Input() private siteName;
  @Input() private expTime;

  public planLabels;
  public price;
  public plan;
  public activePriceId;

  private firstPrice;

  constructor(
    private translate: TranslateService,
    private sitesService: SitesService,
    private billingService: BillingService
  ) {
    this.title = this.title || this.translate.instant('sitelist.tarrif.title');
    this.subscription = this.subscription || null;
    this.siteName = this.siteName ? this.siteName : this.sitesService.getSiteById(this.siteId).name;

    this.planLabels = {
      activationLabel: this.translate.instant('sitelist.tarrif.activation', {tariffName: this.plan.name, siteName: this.siteName}),
      activationDateLabel: this.getDatesLabel(),
      payDescription: this.getPayDescription(this.firstPrice.name, this.firstPrice.desc),
      currentPrice: this.firstPrice.price
    };
  }

  ngOnInit(): void {
    this.plan = this.plans[0];
    this.firstPrice = this.plan.prices[0];
    this.activePriceId = this.firstPrice.id;
  }

  public changePrice(price) {
    this.planLabels.activationDateLabel = this.getDatesLabel(price.days);
    this.planLabels.payDescription = this.getPayDescription(price.name, price.desc);
    this.planLabels.currentPrice = price.price;
    this.activePriceId = price.id;
  }

  public activatePlan() {
    this.billingService.getInvoiceAndGoToWallet(this.siteId, this.activePriceId);
  }

  private getPayDescription(payTerm, payDiscount) {
    return this.translate.instant('global.for') + ' ' + payTerm + ', ' + (payDiscount || '0%') + ' ' + this.translate.instant('global.discount');
  }

  private getDatesLabel(days?) {
    const expectedTime = this.expTime ? parseFloat(this.expTime) : null;
    const startDate = expectedTime ? new Date(expectedTime) : new Date();
    const endDate   = new Date(startDate.getTime() + 1000 * 60 * 60 * 24 * (days || this.firstPrice.days));

    return this.translate.instant('sitelist.tarrif.activationDate', {startDate: $filter('date')(startDate, "dd.MM.yy"), endDate: $filter('date')(endDate, "dd.MM.yy")});
  }

}
