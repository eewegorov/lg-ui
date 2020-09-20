import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import {
  CreateIntegrationRequest,
  CreateSiteData,
  CreateSiteRequest,
  CreateSiteResponse,
  Integration,
  IntegrationItem,
  IntegrationResponse, IntegrationService,
  IntegrationsResponse,
  IntegrationTypes,
  Site,
  SiteSettings,
  SiteSettingsResponse,
  SiteShort,
  SiteShortResponse,
  SitesResponse,
  SitesShortResponse,
  UpdateIntegrationRequest
} from '../../../core/models/sites';
import { ErrorHandlerService } from '../../../core/services/error-handler.service';
import { SitesApiService } from './sites-api.service';
import { ApiResponse } from '../../../core/models/api';


@Injectable({
  providedIn: 'root'
})
export class SitesService {
  public sites: Site[] | SiteShort[] = [];
  private currentSiteId: string;

  constructor(
    private errorHandlerService: ErrorHandlerService,
    private sitesApiService: SitesApiService
  ) { }

  public getSites(): Observable<Site[]> {
    return this.sitesApiService.getSites().pipe(
      map((response: SitesResponse) => response.data),
      catchError(this.errorHandlerService.handleError)
    );
  }

  public getSitesShort(): Observable<SiteShort[]> {
    return this.sitesApiService.getSitesShort().pipe(
      map((response: SitesShortResponse) => response.data),
      catchError(this.errorHandlerService.handleError)
    );
  }

  public createSite(data: CreateSiteRequest): Observable<CreateSiteData> {
    return this.sitesApiService.createSite(data).pipe(
      map((response: CreateSiteResponse) => response.data),
      catchError(this.errorHandlerService.handleError)
    );
  }

  public deleteSite(id: string): Observable<boolean> {
    return this.sitesApiService.deleteSite(id).pipe(
      map((response: ApiResponse) => response.success),
      catchError(this.errorHandlerService.handleError)
    );
  }

  public getSiteSettings(id: string): Observable<SiteSettings> {
    return this.sitesApiService.getSiteSettings(id).pipe(
      map((response: SiteSettingsResponse) => response.data),
      catchError(this.errorHandlerService.handleError)
    );
  }

  public getSiteShortInfo(id: string): Observable<SiteShort> {
    return this.sitesApiService.getSiteShortInfo(id).pipe(
      map((response: SiteShortResponse) => response.data),
      catchError(this.errorHandlerService.handleError)
    );
  }

  public updateSiteSettings(id: string, settings: SiteSettings): Observable<boolean> {
    return this.sitesApiService.updateSiteSettings(id, settings).pipe(
      map((response: ApiResponse) => response.success),
      catchError(this.errorHandlerService.handleError)
    );
  }

  public getSiteIntegrations(id: string): Observable<Integration[]> {
    return this.sitesApiService.getSiteIntegrations(id).pipe(
      map((response: IntegrationsResponse) => response.data),
      catchError(this.errorHandlerService.handleError)
    );
  }

  public getSiteIntegration(siteId: string, integrationId: string): Observable<IntegrationItem> {
    return this.sitesApiService.getSiteIntegration(siteId, integrationId).pipe(
      map((response: IntegrationResponse) => response.data),
      catchError(this.errorHandlerService.handleError)
    );
  }

  public createSiteIntegration(siteId: string, integration: CreateIntegrationRequest): Observable<IntegrationItem> {
    return this.sitesApiService.createSiteIntegration(siteId, integration).pipe(
      map((response: IntegrationResponse) => response.data),
      catchError(this.errorHandlerService.handleError)
    );
  }

  public cloneSiteIntegration(
    siteId: string, integrationId: string, newIntegrationName: string, recipientSiteId: string, isDefault: boolean
  ): Observable<IntegrationItem> {
    const data = {
      name: newIntegrationName,
      siteId,
      default: isDefault
    };
    return this.sitesApiService.cloneSiteIntegration(recipientSiteId, integrationId, data).pipe(
      map((response: IntegrationResponse) => response.data),
      catchError(this.errorHandlerService.handleError)
    );
  }

  public updateSiteIntegration(siteId: string, integrationId: string, integration: UpdateIntegrationRequest): Observable<boolean> {
    return this.sitesApiService.updateSiteIntegration(siteId, integrationId, integration).pipe(
      map((response: ApiResponse) => response.success),
      catchError(this.errorHandlerService.handleError)
    );
  }

  public startStopSiteIntegration(siteId: string, integrationId: string, isStart: boolean): Observable<boolean> {
    return this.sitesApiService.startStopSiteIntegration(siteId, integrationId, isStart).pipe(
      map((response: ApiResponse) => response.success),
      catchError(this.errorHandlerService.handleError)
    );
  }

  public deleteSiteIntegration(siteId: string, integrationId: string): Observable<boolean> {
    return this.sitesApiService.deleteSiteIntegration(siteId, integrationId).pipe(
      map((response: ApiResponse) => response.success),
      catchError(this.errorHandlerService.handleError)
    );
  }

  public getCorrectNameByType(type: string) {
    const correctItem = this.getIntegrationServicesList().find((item) => {
      return item.type === type;
    });
    if (correctItem) {
      return correctItem.name;
    }
  }

  public getPaymentByType(type) {
    const correctItem = this.getIntegrationServicesList().find((item) => {
      return item.type === type;
    });
    if (correctItem) {
      return correctItem.isPayment;
    }
  }

  public generatePath(path: string, needUrl: boolean = false): string {
    let scriptPath = '<!-- BEGIN LEADGENIC CODE {literal} -->\r\n';
    scriptPath +=  '<!-- Put this script tag before the </body> tag of your page -->';
    scriptPath += '\r\n<script type="text/javascript" charset="UTF-8" async src="';
    scriptPath += needUrl ? ('https://gate.leadgenic.ru/getscript?site=' + path) : path;
    scriptPath += '"></script>\r\n';
    scriptPath += '<!-- {/literal} END LEADGENIC CODE -->';
    return scriptPath;
  }

  public getCurrentSiteId(): string {
    return this.currentSiteId;
  }

  public isSiteHasExpTariff(site): boolean {
    if (this.isSiteHasFreeTariff(site)) {
      return true;
    } else {
      const d = new Date();
      const expTime = site.tariffExp - d.getTime();
      return expTime <= 0;
    }
  }

  public isIntegrationCRM(type) {
    return type === 'BITRIX' || type === 'AMOCRM';
  }

  public isIntegrationMailing(type) {
    return type === 'MAILCHIMP' || type === 'GETRESPONSE' || type === 'SENDPULSE' || type === 'SENDBOX' || type === 'UNISENDER';
  }

  public isIntegrationNotification(type) {
    return type === 'EMAIL';
  }

  public isIntegrationOthers(type) {
    return type === 'ROISTAT' || type === 'WEBHOOK';
  }

  private isSiteHasFreeTariff(site): boolean {
    return (!site.tariffExp && !site.tariffName) || site.tariffName === 'Бесплатный';
  }

  public getIntegrationServicesList(): IntegrationService[] {
    return [
      {
        name: 'Mailchimp',
        helpUrl: 'https://leadgenic.userecho.com/knowledge-bases/2/articles/523-mailchimp',
        type: IntegrationTypes.MAILCHIMP,
        group: 'mailing',
        isPayment: false
      },
      {
        name: 'Getresponse',
        helpUrl: 'https://leadgenic.userecho.com/knowledge-bases/2/articles/522-getresponce',
        type: IntegrationTypes.GETRESPONSE,
        group: 'mailing',
        isPayment: false
      },
      {
        name: 'Sendpulse',
        helpUrl: 'https://leadgenic.userecho.com/knowledge-bases/2/articles/524-sendpulse',
        type: IntegrationTypes.SENDPULSE,
        group: 'mailing',
        isPayment: false
      },
      {
        name: 'Sendbox',
        helpUrl: 'https://leadgenic.userecho.com/knowledge-bases/2/articles/525-sendbox',
        type: IntegrationTypes.SENDBOX,
        group: 'mailing',
        isPayment: false
      },
      {
        name: 'Unisender',
        helpUrl: 'https://leadgenic.userecho.com/knowledge-bases/2/articles/526-unisender',
        type: IntegrationTypes.UNISENDER,
        group: 'mailing',
        isPayment: false
      },
      {
        name: 'Bitrix24',
        helpUrl: 'https://leadgenic.userecho.com/knowledge-bases/2/articles/527-bitrix',
        type: IntegrationTypes.BITRIX,
        group: 'CRM',
        isPayment: true
      },
      {
        name: 'Amo CRM',
        helpUrl: 'https://leadgenic.userecho.com/knowledge-bases/2/articles/528-amocrm',
        type: IntegrationTypes.AMOCRM,
        group: 'CRM',
        isPayment: true
      },
      {
        name: 'Отправка Email',
        helpUrl: 'https://leadgenic.userecho.com/knowledge-bases/2/articles/529-email',
        type: IntegrationTypes.EMAIL,
        group: 'notification',
        isPayment: true
      },
      {
        name: 'Roistat',
        helpUrl: 'https://leadgenic.userecho.com/knowledge-bases/2/articles/335-nastrojka-integratsii-s-roistat',
        type: IntegrationTypes.ROISTAT,
        group: 'others',
        isPayment: true
      },
      {
        name: 'Webhook',
        helpUrl: 'https://leadgenic.userecho.com/knowledge-bases/2/articles/334-nastrojka-integratsii-webhook',
        type: IntegrationTypes.WEBHOOK,
        group: 'others',
        isPayment: true
      }
    ];
  }


}
