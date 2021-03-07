import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { ApiResponse } from '../../../core/models/api';
import {
  ContainerRequest,
  ContainerizedWidgetCloneRequest,
  ContainerResponse,
  ContainersResponse,
  WidgetCloneResponse,
  WidgetRename,
  WidgetSwapRequest,
  ContainerInfoResponse, WidgetChangeCompanyRequest
} from '../../../core/models/widgets';


@Injectable({
  providedIn: 'root'
})
export class ContainerizedWidgetApiService {

  constructor(private http: HttpClient) { }

  public getWContainers(siteId: string): Observable<ContainersResponse> {
    return this.http.get<ContainersResponse>(`${ environment.url }/sites/${siteId}/containers`);
  }

  public getWContainerInfo(siteId: string, containerId: string): Observable<ContainerInfoResponse> {
    return this.http.get<ContainerInfoResponse>(`${ environment.url }/sites/${siteId}/containers/${containerId}`);
  }

  public createWContainer(siteId: string, container: ContainerRequest): Observable<ContainerResponse> {
    return this.http.post<ContainerResponse>(`${ environment.url }/sites/${siteId}/containers`, container);
  }

  public updateWContainer(siteId: string, containerId: string, container: ContainerRequest): Observable<ContainerResponse> {
    return this.http.put<ContainerResponse>(`${ environment.url }/sites/${siteId}/containers/${containerId}`, container);
  }

  public deleteWContainer(siteId: string, containerId: string): Observable<ApiResponse> {
    return this.http.delete<ApiResponse>(`${ environment.url }/sites/${siteId}/containers/${containerId}`);
  }

  public switch(siteId: string, widgetId: string, action: 'start' | 'stop') {
    return this.http.post<ApiResponse>(`${ environment.url }/sites/${siteId}/containerwidgets/${widgetId}/${action}`, null);
  }

  public rename(siteId: string, widgetId: string, name: WidgetRename): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${ environment.url }/sites/${siteId}/containerwidgets/${widgetId}/rename`, name);
  }

  public clone(siteId: string, widgetId: string, widget: ContainerizedWidgetCloneRequest): Observable<WidgetCloneResponse> {
    return this.http.post<WidgetCloneResponse>(`${ environment.url }/sites/${siteId}/containerwidgets/${widgetId}/clone`, widget);
  }

  public changeCWidgetCompany(siteId: string, widgetId: string, company: WidgetChangeCompanyRequest): Observable<ApiResponse> {
    return this.http.put<ApiResponse>(`${ environment.url }/sites/${siteId}/containerwidgets//${widgetId}/company`, company);
  }

  public swap(siteId: string, widgetSwap: WidgetSwapRequest): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${ environment.url }/sites/${siteId}/containerwidgets/swap`, widgetSwap);
  }
}
