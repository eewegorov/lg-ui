import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { ApiResponse } from '../../../core/models/api';
import { AbtestsResponse, UpdateAbtest, CloneVariantResponse } from '../../../core/models/abtests';


@Injectable({
  providedIn: 'root'
})
export class AbtestsApiService {

  constructor(private http: HttpClient) { }

  public getTests(): Observable<AbtestsResponse> {
    return this.http.get<AbtestsResponse>(`${ environment.url }/abtests`);
  }

  public start(id: string): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${ environment.url }/abtests/${id}/activate`, null);
  }

  public pause(id: string): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${ environment.url }/abtests/${id}/pause`, null);
  }

  public deleteTest(id: string): Observable<ApiResponse> {
    return this.http.delete<ApiResponse>(`${ environment.url }/abtests/${id}`);
  }

  public update(id: string, test: UpdateAbtest): Observable<ApiResponse> {
    return this.http.put<ApiResponse>(`${ environment.url }/abtests/${id}`, test);
  }

  public cloneVariant(testId: string, variantId: string): Observable<CloneVariantResponse> {
    return this.http.post<CloneVariantResponse>(`${ environment.url }/abtests/${testId}/variants/${variantId}/clone`, null);
  }

  public deleteVariant(testId: string, variantId: string): Observable<ApiResponse> {
    return this.http.delete<ApiResponse>(`${ environment.url }/abtests/${testId}/variants/${variantId}`);
  }

  public chooseWinner(testId: string, variantId: string): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${ environment.url }/abtests/${testId}/variants/${variantId}/winner`, null);
  }

  public resetStats(id: string): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${ environment.url }/abtests/${id}/clear`, null);
  }

  public getArchTests(): Observable<AbtestsResponse> {
    return this.http.get<AbtestsResponse>(`${ environment.url }/abtests/archives`);
  }

  public deleteArchTest(id: string): Observable<ApiResponse> {
    return this.http.delete<ApiResponse>(`${ environment.url }/abtests/archives/${id}`);
  }
}
