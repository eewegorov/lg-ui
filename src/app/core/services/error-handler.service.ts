import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { throwError } from 'rxjs';
import { Payment } from '../models/payment';
import { ApiResponse } from '../models/api';
import { CoreSitesService } from './core-sites.service';
import { TariffsService } from './tariffs.service';


@Injectable({
  providedIn: 'root'
})
export class ErrorHandlerService {

  constructor(
    private translate: TranslateService,
    private coreSitesService: CoreSitesService,
    private tariffsService: TariffsService
  ) { }

  public handleError(error: ApiResponse) {
    if (error.message) {
      const errors = error.message.split(':');
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
      this.tariffsService.checkTariffPlans(siteId,
        this.translate.instant('sitelist.tariff.improve'),
        this.translate.instant('widgetsList.payment.limit', { siteName: this.coreSitesService.getSiteById(siteId).name }));
    } else if (type === Payment.CONTAINER_WIDGETS_LIMIT) {
      this.tariffsService.checkTariffPlans(siteId,
        this.translate.instant('sitelist.tariff.improve'),
        this.translate.instant('widgetsList.payment.limit.container', { siteName: this.coreSitesService.getSiteById(siteId).name }));
    } else if (type === Payment.INTEGRATION_PAYMENT) {
      this.tariffsService.checkTariffPlans(siteId,
        this.translate.instant('sitelist.tariff.improve'),
        this.translate.instant('settings.site.integration.paymentLabel', { siteName: this.coreSitesService.getSiteById(siteId).name }));
    } else if (type === Payment.WIDGET_HAS_PAYMENT_OPTIONS) {
      this.tariffsService.checkTariffPlans(siteId,
        this.translate.instant('sitelist.tariff.improve'),
        this.translate.instant('widgetsList.payment.options', { siteName: this.coreSitesService.getSiteById(siteId).name }));
    } else if (type === Payment.PAYMENT_SETTINGS) {
      this.tariffsService.checkTariffPlans(siteId,
        this.translate.instant('sitelist.tariff.improve'),
        this.translate.instant('settings.site.update.paymentLabel', { siteName: this.coreSitesService.getSiteById(siteId).name }));
    } else if (type === Payment.MAX_LEADS_SHOW_REACHED) {
      this.tariffsService.checkTariffPlans(siteId,
        this.translate.instant('sitelist.tariff.improve'),
        this.translate.instant('settings.site.update.crm.paymentLabel', { siteName: this.coreSitesService.getSiteById(siteId).name }));
    }
  }
}
