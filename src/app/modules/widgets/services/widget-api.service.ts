import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { WidgetsResponse } from '../models/widgets';


@Injectable({
  providedIn: 'root'
})
export class WidgetApiService {

  constructor(private http: HttpClient) { }

  public getWidgetsList(siteId: string): Observable<WidgetsResponse> {
    return this.http.get<WidgetsResponse>(`${ environment.url }/sites/${siteId}/widgets`);
  }
}
