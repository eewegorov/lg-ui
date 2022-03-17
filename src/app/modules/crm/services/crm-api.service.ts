import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse } from '../../../core/models/api';
import {
  LeadByIdResponse,
  LeadsResponse,
  LeadsWidgetsResponse,
  UpdateComment,
  UpdateState
} from '../../../core/models/crm';
import { ConfigService } from '../../../core/services/config.service';


@Injectable({
  providedIn: 'root'
})
export class CrmApiService {

  constructor(
    private http: HttpClient,
    private configService: ConfigService
  ) { }

  public getLeadList(filterParams): Observable<LeadsResponse> {
    return this.http.get<LeadsResponse>(`${this.configService.config.prov}/leads`, {
      params: filterParams
    });
  }

  public getLeadById(leadId: string): Observable<LeadByIdResponse> {
    return this.http.get<LeadByIdResponse>(`${this.configService.config.prov}/leads/${leadId}`);
  }

  public updateLeadState(leadId: string, state: UpdateState): Observable<ApiResponse> {
    return this.http.put<ApiResponse>(`${this.configService.config.prov}/leads/${leadId}/state`, state);
  }

  public updateLeadComment(leadId: string, comment: UpdateComment): Observable<ApiResponse> {
    return this.http.put<ApiResponse>(`${this.configService.config.prov}/leads/${leadId}/userComment`, comment);
  }

  public getLeadsFilters(): Observable<LeadsWidgetsResponse> {
    return this.http.get<LeadsWidgetsResponse>(`${this.configService.config.prov}/leads/filters`);
  }

}
