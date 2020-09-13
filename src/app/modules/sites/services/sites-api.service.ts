import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { ApiResponse } from '../../../core/models/api';
import {
  CreateSiteRequest,
  CreateSiteResponse,
  SiteSettingsResponse, SiteShortResponse,
  SitesResponse,
  SitesShortResponse
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
}
