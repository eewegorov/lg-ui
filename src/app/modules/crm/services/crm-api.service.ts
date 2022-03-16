import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { ApiResponse } from '../../../core/models/api';
import {
  LeadByIdResponse,
  LeadsResponse,
  LeadsWidgetsResponse,
  UpdateComment,
  UpdateState
} from '../../../core/models/crm';


@Injectable({
  providedIn: 'root'
})
export class CrmApiService {

  constructor(private http: HttpClient) { }

  public getLeadList(filterParams): Observable<LeadsResponse> {
    return this.http.get<LeadsResponse>(`${ environment.prov }/leads`, {
      params: filterParams
    });
  }

  public getLeadById(leadId: string): Observable<LeadByIdResponse> {
    return this.http.get<LeadByIdResponse>(`${ environment.prov }/leads/${leadId}`);
  }

  public updateLeadState(leadId: string, state: UpdateState): Observable<ApiResponse> {
    return this.http.put<ApiResponse>(`${ environment.prov }/leads/${leadId}/state`, state);
  }

  public updateLeadComment(leadId: string, comment: UpdateComment): Observable<ApiResponse> {
    return this.http.put<ApiResponse>(`${ environment.prov }/leads/${leadId}/userComment`, comment);
  }

  public getLeadsFilters(): Observable<LeadsWidgetsResponse> {
    return this.http.get<LeadsWidgetsResponse>(`${ environment.prov }/leads/filters`);
  }

}
