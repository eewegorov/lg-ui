import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { ApiResponse } from '../../../core/models/api';
import {
  ContainerCreateRequest, ContainerizedWidgetCloneRequest,
  ContainerResponse,
  ContainersResponse, WidgetCloneRequest, WidgetCloneResponse,
  WidgetRename
} from '../../../core/models/widgets';


@Injectable({
  providedIn: 'root'
})
export class ContainerizedWidgetApiService {

  constructor(private http: HttpClient) { }

  public getWContainers(siteId: string): Observable<ContainersResponse> {
    return this.http.get<ContainersResponse>(`${ environment.url }/sites/${siteId}/containers`);
  }

  public createWContainer(siteId: string, container: ContainerCreateRequest): Observable<ContainerResponse> {
    return this.http.post<ContainerResponse>(`${ environment.url }/sites/${siteId}/containers`, container);
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
}
