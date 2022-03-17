import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
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
import { ConfigService } from '../../../core/services/config.service';


@Injectable({
  providedIn: 'root'
})
export class AbtestsApiService {

  constructor(
    private http: HttpClient,
    private configService: ConfigService
  ) { }

  public getTests(): Observable<AbtestsResponse> {
    return this.http.get<AbtestsResponse>(`${this.configService.config.prov}/abtests`);
  }

  public createTest(test: AbtestCreateRequest): Observable<AbtestCreateResponse> {
    return this.http.post<AbtestCreateResponse>(`${this.configService.config.prov}/abtests`, test);
  }

  public getVariants(id: string): Observable<AbtestVariantsResponse> {
    return this.http.get<AbtestVariantsResponse>(`${this.configService.config.prov}/abtests/${id}/variants`);
  }

  public getStatistics(id: string): Observable<AbtestStatisticsResponse> {
    return this.http.get<AbtestStatisticsResponse>(`${this.configService.config.stat}/abtests/${id}/widgets`);
  }

  public start(id: string): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.configService.config.prov}/abtests/${id}/activate`, null);
  }

  public pause(id: string): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.configService.config.prov}/abtests/${id}/pause`, null);
  }

  public deleteTest(id: string): Observable<ApiResponse> {
    return this.http.delete<ApiResponse>(`${this.configService.config.prov}/abtests/${id}`);
  }

  public update(id: string, test: UpdateAbtest): Observable<ApiResponse> {
    return this.http.put<ApiResponse>(`${this.configService.config.prov}/abtests/${id}`, test);
  }

  public createVariant(testId: string, test: AbtestVariantRequest): Observable<AbtestVariantResponse> {
    return this.http.post<AbtestVariantResponse>(`${this.configService.config.prov}/abtests/${testId}/variants`, test);
  }

  public cloneVariant(testId: string, variantId: string): Observable<CloneVariantResponse> {
    return this.http.post<CloneVariantResponse>(`${this.configService.config.prov}/abtests/${testId}/variants/${variantId}/clone`, null);
  }

  public deleteVariant(testId: string, variantId: string): Observable<ApiResponse> {
    return this.http.delete<ApiResponse>(`${this.configService.config.prov}/abtests/${testId}/variants/${variantId}`);
  }

  public chooseWinner(testId: string, variantId: string): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.configService.config.prov}/abtests/${testId}/variants/${variantId}/winner`, null);
  }

  public resetStats(id: string): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.configService.config.prov}/abtests/${id}/clear`, null);
  }

  public getArchTests(): Observable<AbtestsArchiveResponse> {
    return this.http.get<AbtestsArchiveResponse>(`${this.configService.config.prov}/abtestsarchives`);
  }

  public deleteArchTest(id: string): Observable<ApiResponse> {
    return this.http.delete<ApiResponse>(`${this.configService.config.prov}/abtestsarchives/${id}`);
  }
}
