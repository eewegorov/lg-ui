import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { ApiResponse } from '../../../core/models/api';
import {
  AbtestsResponse,
  UpdateAbtest,
  CloneVariantResponse,
  AbtestStatisticsResponse,
  AbtestsArchiveResponse,
  AbtestCreateRequest,
  AbtestCreateResponse,
  AbtestVariantRequest,
  AbtestVariantResponse, AbtestVariantsResponse
} from '../../../core/models/abtests';


@Injectable({
  providedIn: 'root'
})
export class AbtestsApiService {

  constructor(private http: HttpClient) { }

  public getTests(): Observable<AbtestsResponse> {
    return this.http.get<AbtestsResponse>(`${ environment.prov }/abtests`);
  }

  public createTest(test: AbtestCreateRequest): Observable<AbtestCreateResponse> {
    return this.http.post<AbtestCreateResponse>(`${ environment.prov }/abtests`, test);
  }

  public getVariants(id: string): Observable<AbtestVariantsResponse> {
    return this.http.get<AbtestVariantsResponse>(`${ environment.prov }/abtests/${id}/variants`);
  }

  public getStatistics(id: string): Observable<AbtestStatisticsResponse> {
    return this.http.get<AbtestStatisticsResponse>(`${ environment.stat }/abtests/${id}/widgets`);
  }

  public start(id: string): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${ environment.prov }/abtests/${id}/activate`, null);
  }

  public pause(id: string): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${ environment.prov }/abtests/${id}/pause`, null);
  }

  public deleteTest(id: string): Observable<ApiResponse> {
    return this.http.delete<ApiResponse>(`${ environment.prov }/abtests/${id}`);
  }

  public update(id: string, test: UpdateAbtest): Observable<ApiResponse> {
    return this.http.put<ApiResponse>(`${ environment.prov }/abtests/${id}`, test);
  }

  public createVariant(testId: string, test: AbtestVariantRequest): Observable<AbtestVariantResponse> {
    return this.http.post<AbtestVariantResponse>(`${ environment.prov }/abtests/${testId}/variants`, test);
  }

  public cloneVariant(testId: string, variantId: string): Observable<CloneVariantResponse> {
    return this.http.post<CloneVariantResponse>(`${ environment.prov }/abtests/${testId}/variants/${variantId}/clone`, null);
  }

  public deleteVariant(testId: string, variantId: string): Observable<ApiResponse> {
    return this.http.delete<ApiResponse>(`${ environment.prov }/abtests/${testId}/variants/${variantId}`);
  }

  public chooseWinner(testId: string, variantId: string): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${ environment.prov }/abtests/${testId}/variants/${variantId}/winner`, null);
  }

  public resetStats(id: string): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${ environment.prov }/abtests/${id}/clear`, null);
  }

  public getArchTests(): Observable<AbtestsArchiveResponse> {
    return this.http.get<AbtestsArchiveResponse>(`${ environment.prov }/abtestsarchives`);
  }

  public deleteArchTest(id: string): Observable<ApiResponse> {
    return this.http.delete<ApiResponse>(`${ environment.prov }/abtestsarchives/${id}`);
  }
}
