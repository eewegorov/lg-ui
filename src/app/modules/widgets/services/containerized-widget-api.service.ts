import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { ApiResponse } from '../../../core/models/api';
import { WidgetRename } from '../../../core/models/widgets';


@Injectable({
  providedIn: 'root'
})
export class ContainerizedWidgetApiService {

  constructor(private http: HttpClient) { }

  public rename(siteId: string, widgetId: string, name: WidgetRename): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${ environment.url }/sites/${siteId}/containerwidgets/${widgetId}/rename`, name);
  }

  public switch(siteId: string, widgetId: string, action: 'start' | 'stop') {
    return this.http.post<ApiResponse>(`${ environment.url }/sites/${siteId}/containerwidgets/${widgetId}/${action}`, null);
  }
}
