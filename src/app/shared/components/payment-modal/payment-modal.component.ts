import { Component, Input, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';
import { Order } from '../../../core/models/payment';
import { CoreSitesService } from '../../../core/services/core-sites.service';
import { BillingService } from '../../../core/services/billing.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-payment-modal',
  templateUrl: './payment-modal.component.html',
  styleUrls: ['./payment-modal.component.scss'],
  providers: [DatePipe]
})
export class PaymentModalComponent implements OnInit {
  @Input() public title;
  @Input() public subscription;
  @Input() private plans;
  @Input() private siteId;
  @Input() public siteName;
  @Input() private expTime;

  public planLabels;
  public price;
  public plan;
  public activePriceId;

  private firstPrice;

  constructor(
    private translate: TranslateService,
    private activeModal: NgbActiveModal,
    private datePipe: DatePipe,
    private coreSitesService: CoreSitesService,
    private billingService: BillingService
  ) {

  }

  ngOnInit(): void {
    this.plan = this.plans[0];
    this.firstPrice = this.plan.prices[0];
    this.activePriceId = this.firstPrice.id;
    this.title = this.title || this.translate.instant('sitelist.tariff.improve');
    this.subscription = this.subscription || null;
    this.siteName = this.siteName ? this.siteName : this.coreSitesService.getSiteById(this.siteId).name;

    this.planLabels = {
      activationLabel: this.translate.instant('sitelist.tariff.activation', {tariffName: this.plan.name, siteName: this.siteName}),
      activationDateLabel: this.getDatesLabel(),
      payDescription: this.getPayDescription(this.firstPrice.name, this.firstPrice.desc),
      currentPrice: this.firstPrice.price
    };
  }

  public closeModal(): void {
    this.activeModal.close();
  }

  public changePrice(price) {
    this.planLabels.activationDateLabel = this.getDatesLabel(price.days);
    this.planLabels.payDescription = this.getPayDescription(price.name, price.desc);
    this.planLabels.currentPrice = price.price;
    this.activePriceId = price.id;
  }

  public activatePlan() {
    this.billingService.createOrder(this.siteId, this.activePriceId).subscribe((order: Order) => {
      const form = document.createElement('form');
      form.setAttribute('method', 'POST');
      form.setAttribute('target', '_blank');
      form.setAttribute('action', 'https://wl.walletone.com/checkout/checkout/Index');

      for (const key in order) {
        if (order.hasOwnProperty(key)) {
          const hiddenField = document.createElement('input');
          hiddenField.setAttribute('type', 'hidden');
          hiddenField.setAttribute('name', key);
          hiddenField.setAttribute('value', order[key]);

          form.appendChild(hiddenField);
        }
      }

      document.body.appendChild(form);
      form.submit();
    });
  }

  private getPayDescription(payTerm, payDiscount) {
    return this.translate.instant('global.for') + ' ' + payTerm + ', ' + (payDiscount.replace('-', '').trim() || '0%')
      + ' ' + this.translate.instant('global.discount');
  }

  private getDatesLabel(days?) {
    const expectedTime = this.expTime ? parseFloat(this.expTime) : null;
    const startDate = expectedTime ? new Date(expectedTime) : new Date();
    const endDate   = new Date(startDate.getTime() + 1000 * 60 * 60 * 24 * (days || this.firstPrice.days));

    return this.translate.instant('sitelist.tariff.activationDate', {
      startDate: this.datePipe.transform(startDate, 'dd.MM.yy'),
      endDate: this.datePipe.transform(endDate, 'dd.MM.yy')
    });
  }

}
