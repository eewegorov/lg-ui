import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { throwError } from 'rxjs';
import { Payment } from '../models/payment';
import { ApiResponse } from '../models/api';
import { Site } from '../../modules/sites/models/sites';
import { BillingService } from './billing.service';


@Injectable({
  providedIn: 'root'
})
export class ErrorHandlerService {
  public sites: Site[];

  constructor(
    private translate: TranslateService,
    private billingService: BillingService
  ) { }

  public handleError(error: ApiResponse) {
    if (error.message) {
      let errors = error.message.split(":");
      if (errors[0] === Payment.WIDGETS_LIMIT && errors[1]) {
        this.prepareResponseForPaymentService(errors[0], errors[1]);
      }
      console.log(errors[0], errors[1], errors[2]);
    }
    console.log('Http request error: ', error);
    return throwError('HTTP Error');
  }

  private prepareResponseForPaymentService(type: Payment, siteId): void {
    if (type === Payment.WIDGETS_LIMIT) {
      this.billingService.checkTariffPlans(siteId,
        this.translate.instant('sitelist.tariff.title'),
        this.translate.instant('widgetsList.payment.limit', { siteName: this.getSiteById(siteId).name }));
    } else if (type === Payment.CONTAINER_WIDGETS_LIMIT) {
      this.billingService.checkTariffPlans(siteId,
        this.translate.instant('sitelist.tariff.title'),
        this.translate.instant('widgetsList.payment.limit.container', { siteName: this.getSiteById(siteId).name }));
    } else if (type === Payment.INTEGRATION_PAYMENT) {
      this.billingService.checkTariffPlans(siteId,
        this.translate.instant('sitelist.tariff.title'),
        this.translate.instant('settings.site.integration.paymentLabel', { siteName: this.getSiteById(siteId).name }));
    } else if (type === Payment.WIDGET_HAS_PAYMENT_OPTIONS) {
      this.billingService.checkTariffPlans(siteId,
        this.translate.instant('sitelist.tariff.title'),
        this.translate.instant('widgetsList.payment.options', { siteName: this.getSiteById(siteId).name }));
    } else if (type === Payment.PAYMENT_SETTINGS) {
      this.billingService.checkTariffPlans(siteId,
        this.translate.instant('sitelist.tariff.title'),
        this.translate.instant('settings.site.update.paymentLabel', { siteName: this.getSiteById(siteId).name }));
    } else if (type === Payment.MAX_LEADS_SHOW_REACHED) {
      this.billingService.checkTariffPlans(siteId,
        this.translate.instant('sitelist.tariff.title'),
        this.translate.instant('settings.site.update.crm.paymentLabel', { siteName: this.getSiteById(siteId).name }));
    }
  }

  private getSiteById(id): Site {
    return this.sites.find((item) => {
      return item.id === id;
    });
  }
}
