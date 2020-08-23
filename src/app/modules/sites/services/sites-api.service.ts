import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { CreateSiteRequest, CreateSiteResponse, SitesResponse, SitesShortResponse } from '../../../core/models/sites';


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
}
