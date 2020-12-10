import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { ApiResponse } from '../../../core/models/api';
import {
  CreateSiteRequest,
  CreateSiteResponse,
  UpdateIntegrationRequest,
  IntegrationResponse,
  IntegrationsResponse,
  SiteSettings,
  SiteSettingsResponse,
  SiteShortResponse,
  SitesResponse,
  SitesShortResponse,
  CloneIntegrationRequest,
  CreateIntegrationRequest,
  SmartpointsResponse,
  AmoAuthRequest,
  AmoAuthResponse, AmoFunnelResponse
} from '../../../core/models/sites';



@Injectable({
  providedIn: 'root'
})
export class SitesApiService {

  constructor(private http: HttpClient) { }

  public getSites(): Observable<SitesResponse> {
    return this.http.get<SitesResponse>(`${ environment.url }/sites/statistics`);
  }

  public getSitesShort(): Observable<SitesShortResponse> {
    return this.http.get<SitesShortResponse>(`${ environment.url }/sites/short`);
  }

  public createSite(data: CreateSiteRequest): Observable<CreateSiteResponse> {
    return this.http.post<CreateSiteResponse>(`${ environment.url }/sites/statistics`, data);
  }

  public deleteSite(id: string): Observable<ApiResponse> {
    return this.http.delete<ApiResponse>(`${ environment.url }/sites/${id}`);
  }

  public getSiteSettings(id: string): Observable<SiteSettingsResponse> {
    return this.http.get<SiteSettingsResponse>(`${ environment.url }/sites/${id}/settings`);
  }

  public getSiteShortInfo(id: string): Observable<SiteShortResponse> {
    return this.http.get<SiteShortResponse>(`${ environment.url }/sites/${id}/short`);
  }

  public updateSiteSettings(id: string, settings: SiteSettings): Observable<ApiResponse> {
    return this.http.put<ApiResponse>(`${ environment.url }/sites/${id}/settings`, settings);
  }

  public getSiteIntegrations(id: string): Observable<IntegrationsResponse> {
    return this.http.get<IntegrationsResponse>(`${ environment.url }/sites/${id}/integrations`);
  }

  public getSiteIntegration(siteId: string, integrationId: string): Observable<IntegrationResponse> {
    return this.http.get<IntegrationResponse>(`${ environment.url }/sites/${siteId}/integrations/${integrationId}`);
  }

  public createSiteIntegration(siteId: string, integration: CreateIntegrationRequest) {
    return this.http.post<IntegrationResponse>(`${ environment.url }/sites/${siteId}/integrations`, integration);
  }

  public cloneSiteIntegration(siteId: string, integrationId: string, data: CloneIntegrationRequest): Observable<IntegrationResponse> {
    return this.http.post<IntegrationResponse>(`${ environment.url }/sites/${siteId}/integrations/${integrationId}/clone`, data);
  }

  public updateSiteIntegration(siteId: string, integrationId: string, integration: UpdateIntegrationRequest): Observable<ApiResponse> {
    return this.http.put<ApiResponse>(`${ environment.url }/sites/${siteId}/integrations/${integrationId}`, integration);
  }

  public startStopSiteIntegration(siteId: string, integrationId: string, isStart: boolean): Observable<ApiResponse> {
    const type = isStart ? 'start' : 'pause';
    return this.http.post<ApiResponse>(`${ environment.url }/sites/${siteId}/integrations/${integrationId}/${type}`, null);
  }

  public deleteSiteIntegration(siteId: string, integrationId: string): Observable<ApiResponse> {
    return this.http.delete<ApiResponse>(`${ environment.url }/sites/${siteId}/integrations/${integrationId}`);
  }

  public getSiteSmartpointsList(siteId: string): Observable<SmartpointsResponse> {
    return this.http.get<SmartpointsResponse>(`${ environment.url }/sites/${siteId}/smartpoints`);
  }

  public getAmoTokens(subdomain: string, amoCredentials: AmoAuthRequest): Observable<AmoAuthResponse> {
    return this.http.post<AmoAuthResponse>(`http://${subdomain}/oauth2/access_token`, amoCredentials);
  }

  public getAmoFunnels(subdomain: string, accessToken: string): Observable<AmoFunnelResponse> {
    return this.http.get<AmoFunnelResponse>(`http://${subdomain}/api/v4/leads/pipelines`, {
      headers: {
        Authorization: accessToken
      }
    });
  }

}
