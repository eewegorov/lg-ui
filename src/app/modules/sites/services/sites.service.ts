import { Injectable } from '@angular/core';
import { SitesApiService } from './sites-api.service';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';
import { ApiResponse } from '../../../core/models/api';
import { CreateSiteData, CreateSiteRequest, CreateSiteResponse, Site, SitesResponse } from '../models/sites';
import { CoreApiService } from '../../../core/services/core-api.service';
import { BillingService } from '../../../core/services/billing.service';
import { Phone } from '../../../core/models/user';


@Injectable({
  providedIn: 'root'
})
export class SitesService {
  public sites: Site[];

  constructor(
    private translate: TranslateService,
    private coreApiService: CoreApiService,
    private billingService: BillingService,
    private sitesApiService: SitesApiService
  ) { }

  public getSites(): Observable<Site[]> {
    return this.sitesApiService.getRawSites().pipe(
      map((response: SitesResponse) => response.data),
      catchError(this.handleError)
    );
  }

  public createSite(data: CreateSiteRequest): Observable<CreateSiteData> {
    return this.sitesApiService.postSites(data).pipe(
      map((response: CreateSiteResponse) => response.data),
      catchError(this.handleError)
    );
  }

  public savePhoneFromSite(data: Phone): Observable<ApiResponse> {
    return this.coreApiService.savePhone(data);
  }

  public generatePath(path: string, needUrl: boolean = false): string {
    let scriptPath = "<!-- BEGIN LEADGENIC CODE {literal} -->\r\n";
    scriptPath +=  "<!-- Put this script tag before the </body> tag of your page -->";
    scriptPath += '\r\n<script type="text/javascript" charset="UTF-8" async src="';
    scriptPath += needUrl ? ("https://gate.leadgenic.ru/getscript?site=" + path) : path;
    scriptPath += '"></script>\r\n';
    scriptPath += '<!-- {/literal} END LEADGENIC CODE -->';
    return scriptPath;
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
