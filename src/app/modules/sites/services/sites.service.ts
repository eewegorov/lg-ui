import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { ApiResponse } from '../../../core/models/api';
import {
  AmoAuthByCodeRequest,
  AmoAuthByRefreshTokenRequest,
  AmoAuthRequest,
  AmoAuthResponse,
  AmoFunnelResponse,
  AmoGrantTypes,
  CreateIntegrationRequest,
  CreateSiteData,
  CreateSiteRequest,
  CreateSiteResponse,
  Integration,
  IntegrationItem,
  IntegrationResponse,
  IntegrationService,
  IntegrationsResponse,
  IntegrationTypes,
  SiteSettings,
  SiteSettingsResponse,
  SiteShort,
  SiteShortResponse,
  SitesShortResponse,
  SiteStatistics,
  SiteStatisticsResponse,
  Smartpoints,
  SmartpointsResponse,
  UpdateIntegrationRequest
} from '../../../core/models/sites';
import { ErrorHandlerService } from '../../../core/services/error-handler.service';
import { SitesApiService } from './sites-api.service';


@Injectable({
  providedIn: 'root'
})
export class SitesService {
  private currentSiteId: string;

  constructor(
    private errorHandlerService: ErrorHandlerService,
    private sitesApiService: SitesApiService
  ) {
  }

  public getSites(): Observable<SiteShort[]> {
    return this.sitesApiService.getSites().pipe(
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

  public getSiteStatistics(id: string): Observable<SiteStatistics[]> {
    return this.sitesApiService.getSiteStatistics(id).pipe(
      map((response: SiteStatisticsResponse) => response.data),
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

  public getSiteSmartpointsList(siteId: string): Observable<Smartpoints> {
    return this.sitesApiService.getSiteSmartpointsList(siteId).pipe(
      map((response: SmartpointsResponse) => response.data),
      catchError(this.errorHandlerService.handleError)
    );
  }

  public getAmoTokens(
    subdomain: string, clientId: string, clientSecret: string, grantType: AmoGrantTypes, credentials: string
  ): Observable<AmoAuthResponse> {
    const amoCredentials: AmoAuthRequest = {
      client_id: clientId,
      client_secret: clientSecret,
      grant_type: grantType,
      redirect_uri: 'https://leadgenic.ru/amo/auth'
    };

    let amoRequest: AmoAuthByCodeRequest | AmoAuthByRefreshTokenRequest;

    if (grantType === AmoGrantTypes.AuthCode) {
      amoRequest = {
        ...amoCredentials,
        code: credentials
      };
    } else {
      amoRequest = {
        ...amoCredentials,
        refresh_token: credentials
      };
    }

    return this.sitesApiService.getAmoTokens(subdomain, amoRequest);
  }

  public getAmoFunnels(subdomain: string, accessToken: string): Observable<AmoFunnelResponse> {
    return this.sitesApiService.getAmoFunnels(subdomain, accessToken);
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
    scriptPath += '<!-- Put this script tag before the </body> tag of your page -->';
    scriptPath += '\r\n<script type="text/javascript" charset="UTF-8" async src="';
    scriptPath += needUrl ? ('https://gate.leadgenic.ru/getscript?site=' + path) : path;
    scriptPath += '"></script>\r\n';
    scriptPath += '<!-- {/literal} END LEADGENIC CODE -->';
    return scriptPath;
  }

  public getCurrentSiteId(): string {
    return this.currentSiteId;
  }

  public setCurrentSiteId(id) {
    this.currentSiteId = id;
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

  private isSiteHasFreeTariff(site): boolean {
    return (!site?.tariffExp && !site?.tariffName) || site?.tariffName === 'Бесплатный';
  }

}
