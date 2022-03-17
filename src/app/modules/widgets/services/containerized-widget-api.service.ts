import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse } from '../../../core/models/api';
import {
  ContainerRequest,
  ContainerizedWidgetCloneRequest,
  ContainerResponse,
  ContainersResponse,
  WidgetCloneResponse,
  WidgetRename,
  WidgetSwapRequest,
  ContainerInfoResponse,
  WidgetChangeCompanyRequest,
  WidgetCreateRequest,
  WidgetCreateResponse
} from '../../../core/models/widgets';
import { ConfigService } from '../../../core/services/config.service';


@Injectable({
  providedIn: 'root'
})
export class ContainerizedWidgetApiService {

  constructor(
    private http: HttpClient,
    private configService: ConfigService
  ) { }

  public getWContainers(siteId: string): Observable<ContainersResponse> {
    return this.http.get<ContainersResponse>(`${this.configService.config.prov}/sites/${siteId}/containers`);
  }

  public getWContainerInfo(siteId: string, containerId: string): Observable<ContainerInfoResponse> {
    return this.http.get<ContainerInfoResponse>(`${this.configService.config.prov}/sites/${siteId}/containers/${containerId}`);
  }

  public createWContainer(siteId: string, container: ContainerRequest): Observable<ContainerResponse> {
    return this.http.post<ContainerResponse>(`${this.configService.config.prov}/sites/${siteId}/containers`, container);
  }

  public updateWContainer(siteId: string, containerId: string, container: ContainerRequest): Observable<ContainerResponse> {
    return this.http.put<ContainerResponse>(`${this.configService.config.prov}/sites/${siteId}/containers/${containerId}`, container);
  }

  public deleteWContainer(siteId: string, containerId: string): Observable<ApiResponse> {
    return this.http.delete<ApiResponse>(`${this.configService.config.prov}/sites/${siteId}/containers/${containerId}`);
  }

  public create(siteId: string, widget: WidgetCreateRequest): Observable<WidgetCreateResponse> {
    return this.http.post<WidgetCreateResponse>(`${this.configService.config.prov}/sites/${siteId}/containerwidgets`, widget);
  }

  public switch(siteId: string, widgetId: string, action: 'start' | 'stop'): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.configService.config.prov}/sites/${siteId}/containerwidgets/${widgetId}/${action}`, null);
  }

  public rename(siteId: string, widgetId: string, name: WidgetRename): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.configService.config.prov}/sites/${siteId}/containerwidgets/${widgetId}/rename`, name);
  }

  public clone(siteId: string, widgetId: string, widget: ContainerizedWidgetCloneRequest): Observable<WidgetCloneResponse> {
    return this.http.post<WidgetCloneResponse>(`${this.configService.config.prov}/sites/${siteId}/containerwidgets/${widgetId}/clone`, widget);
  }

  public changeCWidgetCompany(siteId: string, widgetId: string, company: WidgetChangeCompanyRequest): Observable<ApiResponse> {
    return this.http.put<ApiResponse>(`${this.configService.config.prov}/sites/${siteId}/containerwidgets//${widgetId}/company`, company);
  }

  public swap(siteId: string, widgetSwap: WidgetSwapRequest): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.configService.config.prov}/sites/${siteId}/containerwidgets/swap`, widgetSwap);
  }
}
