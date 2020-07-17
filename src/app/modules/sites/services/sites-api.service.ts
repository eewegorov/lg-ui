import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { SitesResponse } from '../models/sites';
import { ApiResponse } from '../../../core/models/api';

@Injectable({
  providedIn: 'root'
})
export class SitesApiService {

  constructor(private http: HttpClient) { }

  public getRawSites(): Observable<SitesResponse> {
    return this.http.get<SitesResponse>(`${ environment.url }/sites/statistics`);
  }

  private handleError(error: ApiResponse): Observable<Error> {
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
      BillingService.checkTariffPlans(siteId,
        $translate.instant("sitelist.tarrif.title"),
        $translate.instant("widgetsList.payment.limit", {siteName: getSiteById(siteId).name}));
    } else if (type === "CONTAINER_WIDGETS_LIMIT") {
      BillingService.checkTariffPlans(siteId,
        $translate.instant("sitelist.tarrif.title"),
        $translate.instant("widgetsList.payment.limit.container", {siteName: getSiteById(siteId).name}));
    } else if (type === "INTEGRATION_PAYMENT") {
      BillingService.checkTariffPlans(siteId,
        $translate.instant("sitelist.tarrif.title"),
        $translate.instant("settings.site.integration.paymentLabel", {siteName: getSiteById(siteId).name}));
    } else if (type === "WIDGET_HAS_PAYMENT_OPTIONS") {
      BillingService.checkTariffPlans(siteId,
        $translate.instant("sitelist.tarrif.title"),
        $translate.instant("widgetsList.payment.options", {siteName: getSiteById(siteId).name}));
    } else if (type === "PAYMENT_SETTINGS") {
      BillingService.checkTariffPlans(siteId,
        $translate.instant("sitelist.tarrif.title"),
        $translate.instant("settings.site.update.paymentLabel", {siteName: getSiteById(siteId).name}));
    } else if (type === "MAX_LEADS_SHOW_REACHED") {
      BillingService.checkTariffPlans(siteId,
        $translate.instant("sitelist.tarrif.title"),
        $translate.instant("settings.site.update.crm.paymentLabel", {siteName: getSiteById(siteId).name}));
    }
  }
}
