import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ClearEmailsRequest, EmailsResponse, EmailsStatisticsResponse } from '../../../core/models/emails';
import { ApiResponse } from '../../../core/models/api';
import { ConfigService } from '../../../core/services/config.service';


@Injectable({
  providedIn: 'root'
})
export class EmailsApiService {

  constructor(
    private http: HttpClient,
    private configService: ConfigService
  ) { }

  public getEmailList(filterParams): Observable<EmailsResponse> {
    return this.http.get<EmailsResponse>(`${this.configService.config.prov}/emails`, {
      params: filterParams
    });
  }

  public getEmailStatistic(filterParams): Observable<EmailsStatisticsResponse> {
    return this.http.get<EmailsStatisticsResponse>(`${this.configService.config.prov}/emails/statistics`, {
      params: filterParams
    });
  }

  public downloadEmailList(filterParams) {
    return this.http.get<EmailsStatisticsResponse>(`${this.configService.config.prov}/emails/export`, {
      params: filterParams
    });
  }

  public clearEmail(filterParams: ClearEmailsRequest): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.configService.config.prov}/emails/clear`, filterParams);
  }
}
