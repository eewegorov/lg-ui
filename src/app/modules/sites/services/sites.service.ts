import { Injectable } from '@angular/core';
import { SitesApiService } from './sites-api.service';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';
import { ApiResponse } from '../../../core/models/api';
import { Site, SitesResponse } from '../models/sites';
import { BillingService } from '../../../core/services/billing.service';


@Injectable({
  providedIn: 'root'
})
export class SitesService {
  public sites: Site[];

  constructor(
    private translate: TranslateService,
    private billingService: BillingService,
    private sitesApiService: SitesApiService
  ) { }

  public getSites(): Observable<Site[]> {
    return this.sitesApiService.getRawSites().pipe(
      map((response: SitesResponse) => response.data),
      catchError(this.handleError)
    );
  }

  private handleError(error: ApiResponse) {
    if (error.message) {
      let errors = error.message.split(":");
      if (errors[0] === "WIDGETS_LIMIT" && errors[1]) {
        this.prepareResponseForPaymentService(errors[0], errors[1]);
      }
      console.log(errors[0], errors[1], errors[2]);
    }
    console.log('Http request error: ', error);
    return throwError('HTTP Error');
  }

  private prepareResponseForPaymentService(type, siteId) {
    if (type === "WIDGETS_LIMIT") {
      this.billingService.checkTariffPlans(siteId,
        this.translate.instant("sitelist.tarrif.title"),
        this.translate.instant("widgetsList.payment.limit", { siteName: this.getSiteById(siteId).name }));
    } else if (type === "CONTAINER_WIDGETS_LIMIT") {
      this.billingService.checkTariffPlans(siteId,
        this.translate.instant("sitelist.tarrif.title"),
        this.translate.instant("widgetsList.payment.limit.container", { siteName: this.getSiteById(siteId).name }));
    } else if (type === "INTEGRATION_PAYMENT") {
      this.billingService.checkTariffPlans(siteId,
        this.translate.instant("sitelist.tarrif.title"),
        this.translate.instant("settings.site.integration.paymentLabel", { siteName: this.getSiteById(siteId).name }));
    } else if (type === "WIDGET_HAS_PAYMENT_OPTIONS") {
      this.billingService.checkTariffPlans(siteId,
        this.translate.instant("sitelist.tarrif.title"),
        this.translate.instant("widgetsList.payment.options", { siteName: this.getSiteById(siteId).name }));
    } else if (type === "PAYMENT_SETTINGS") {
      this.billingService.checkTariffPlans(siteId,
        this.translate.instant("sitelist.tarrif.title"),
        this.translate.instant("settings.site.update.paymentLabel", { siteName: this.getSiteById(siteId).name }));
    } else if (type === "MAX_LEADS_SHOW_REACHED") {
      this.billingService.checkTariffPlans(siteId,
        this.translate.instant("sitelist.tarrif.title"),
        this.translate.instant("settings.site.update.crm.paymentLabel", { siteName: this.getSiteById(siteId).name }));
    }
  }

  private getSiteById(id) {
    return this.sites.find((item) => {
      return item.id === id;
    });
  }
}
