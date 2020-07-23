import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { ApiResponse } from '../../../core/models/api';
import { Phone } from '../../../core/models/user';
import { CreateSiteData, CreateSiteRequest, CreateSiteResponse, Site, SitesResponse } from '../models/sites';
import { CoreApiService } from '../../../core/services/core-api.service';
import { ErrorHandlerService } from '../../../core/services/error-handler.service';
import { SitesApiService } from './sites-api.service';


@Injectable({
  providedIn: 'root'
})
export class SitesService {

  private currentSiteId: string;

  constructor(
    private coreApiService: CoreApiService,
    private errorHandlerService: ErrorHandlerService,
    private sitesApiService: SitesApiService
  ) { }

  public getSites(): Observable<Site[]> {
    return this.sitesApiService.getSites().pipe(
      map((response: SitesResponse) => response.data),
      catchError(this.errorHandlerService.handleError)
    );
  }

  public createSite(data: CreateSiteRequest): Observable<CreateSiteData> {
    return this.sitesApiService.postSites(data).pipe(
      map((response: CreateSiteResponse) => response.data),
      catchError(this.errorHandlerService.handleError)
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

  public getCurrentSiteId(): string {
    return this.currentSiteId;
  }


}
