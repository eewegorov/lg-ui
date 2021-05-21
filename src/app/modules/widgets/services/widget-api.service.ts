import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { ApiResponse } from '../../../core/models/api';
import {
  CompaniesResponse,
  CompanyRequest,
  CompanyResponse, DeleteCompanyRequest, FullWidget, MockupGroupsResponse, MockupResponse, MockupsResponse,
  SmartPointEnableRequest,
  SmartPointTypes,
  SmartPointUpdateRequest,
  WidgetChangeCompanyRequest,
  WidgetCloneRequest,
  WidgetCloneResponse,
  WidgetConversionResponse, WidgetCreateRequest, WidgetCreateResponse,
  WidgetRename, WidgetResponse,
  WidgetsResponse,
  WidgetSwapRequest,
  WidgetTemplatesResponse,
  WidgetTypesResponse
} from '../../../core/models/widgets';


@Injectable({
  providedIn: 'root'
})
export class WidgetApiService {

  constructor(private http: HttpClient) { }

  public getWidgetsList(siteId: string): Observable<WidgetsResponse> {
    return this.http.get<WidgetsResponse>(`${ environment.url }/sites/${siteId}/widgets`);
  }

  public getWidgetById(siteId: string, widgetId: string): Observable<WidgetResponse> {
    return this.http.get<WidgetResponse>(`${ environment.url }/sites/${siteId}/widgets/${widgetId}`);
  }

  public getWidgetsTypes(): Observable<WidgetTypesResponse> {
    return this.http.get<WidgetTypesResponse>(`${ environment.url }/widgets/types`);
  }

  public getWidgetsTemplates(): Observable<WidgetTemplatesResponse> {
    return this.http.get<WidgetTemplatesResponse>(`${ environment.url }/widgets/templates`);
  }

  public getCompanies(siteId: string): Observable<CompaniesResponse> {
    return this.http.get<CompaniesResponse>(`${ environment.url }/sites/${siteId}/companies`);
  }

  public getMockupGroups(type: string): Observable<MockupGroupsResponse> {
    const opts = { params: new HttpParams().append('type', type) };
    return this.http.get<MockupGroupsResponse>(`${ environment.url }/mockupgroups`, type ? opts : {});
  }

  public getMockups(type: string, categories: string): Observable<MockupsResponse> {
    let params = new HttpParams();
    if (type) {
      params = params.append('type', type);
    }

    if (categories) {
      params = params.append('categories', categories);
    }

    const opts = { params };

    return this.http.get<MockupsResponse>(`${ environment.url }/mockups`, type || categories ? opts : {});
  }

  public getMockup(id: string): Observable<MockupResponse> {
    return this.http.get<MockupResponse>(`${ environment.url }/mockups/${id}`);
  }

  public updateMockup(id: string, mockup: FullWidget): Observable<ApiResponse> {
    return this.http.put<ApiResponse>(`${ environment.url }/mockups/${id}`, mockup);
  }

  public getWidgetConversion(siteId: string, widgetId: string): Observable<WidgetConversionResponse> {
    return this.http.get<WidgetConversionResponse>(`${ environment.url }/sites/${siteId}/widgets/${widgetId}/conversion`);
  }

  public deleteWidget(siteId: string, widgetId: string): Observable<ApiResponse> {
    return this.http.delete<ApiResponse>(`${ environment.url }/sites/${siteId}/widgets/${widgetId}`);
  }

  public updateWidget(siteId: string, widgetId: string, widget: FullWidget): Observable<ApiResponse> {
    return this.http.put<ApiResponse>(`${ environment.url }/sites/${siteId}/widgets/${widgetId}`, widget);
  }

  public create(siteId: string, widget: WidgetCreateRequest): Observable<WidgetCreateResponse> {
    return this.http.post<WidgetCreateResponse>(`${ environment.url }/sites/${siteId}/sitewidgets`, widget);
  }

  public switch(siteId: string, widgetId: string, action: 'start' | 'stop') {
    return this.http.post<ApiResponse>(`${ environment.url }/sites/${siteId}/sitewidgets/${widgetId}/${action}`, null);
  }

  public rename(siteId: string, widgetId: string, name: WidgetRename): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${ environment.url }/sites/${siteId}/sitewidgets/${widgetId}/rename`, name);
  }

  public clone(siteId: string, widgetId: string, widget: WidgetCloneRequest): Observable<WidgetCloneResponse> {
    return this.http.post<WidgetCloneResponse>(`${ environment.url }/sites/${siteId}/sitewidgets/${widgetId}/clone`, widget);
  }

  public changeWidgetCompany(siteId: string, widgetId: string, company: WidgetChangeCompanyRequest): Observable<ApiResponse> {
    return this.http.put<ApiResponse>(`${ environment.url }/sites/${siteId}/sitewidgets/${widgetId}/company`, company);
  }

  public swap(siteId: string, widgetSwap: WidgetSwapRequest): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${ environment.url }/sites/${siteId}/sitewidgets/swap`, widgetSwap);
  }

  public putSmartpointType(siteId: string, smartpointType: SmartPointTypes, smartpoint: SmartPointUpdateRequest): Observable<ApiResponse> {
    return this.http.put<ApiResponse>(`${ environment.url }/sites/${siteId}/smartpoints/${smartpointType}`, smartpoint);
  }

  public startStopSmartpoint(siteId: string, smartpoint: SmartPointEnableRequest): Observable<ApiResponse> {
    return this.http.put<ApiResponse>(`${ environment.url }/sites/${siteId}/smartpoints/enable`, smartpoint);
  }

  public createCompany(siteId: string, company: CompanyRequest): Observable<CompanyResponse> {
    return this.http.post<CompanyResponse>(`${ environment.url }/sites/${siteId}/companies`, company);
  }

  public deleteCompany(siteId: string, companyId: string, company: DeleteCompanyRequest): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${ environment.url }/sites/${siteId}/companies`, company);
  }

  public listFileToUrl(listUrl) {
    return this.http.get(`${ environment.url }/${listUrl}`);
  }

  public deleteFileToUrl(deleteFileUrl, name): Observable<ApiResponse> {
    return this.http.delete<ApiResponse>(`${ environment.url }/${deleteFileUrl}/${name}`);
  }
}
