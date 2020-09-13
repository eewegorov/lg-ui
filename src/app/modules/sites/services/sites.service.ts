import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import {
  CreateSiteData,
  CreateSiteRequest,
  CreateSiteResponse,
  Site, SiteSettings, SiteSettingsResponse,
  SiteShort, SiteShortResponse,
  SitesResponse,
  SitesShortResponse
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
      var d = new Date();
      var expTime = site.tariffExp - d.getTime();
      return expTime <= 0;
    }
  }

  private isSiteHasFreeTariff(site): boolean {
    return (!site.tariffExp && !site.tariffName) || site.tariffName === "Бесплатный";
  }


}
