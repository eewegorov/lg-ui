import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { ApiResponse } from '../../../core/models/api';
import {
  ConfirmResetData,
  OAuthRequest,
  OAuthResponse,
  RegistrationRequest,
  RegistrationResponse,
  RequestResetData
} from '../../../core/models/account';


@Injectable({
  providedIn: 'root'
})
export class AccountApiService {

  constructor(private http: HttpClient) { }

  public postOAuth(data: OAuthRequest): Observable<OAuthResponse> {
    return this.http.post<OAuthResponse>(`${ environment.prov }/auth/external/redirect`, data);
  }

  public postRegistration(data: RegistrationRequest): Observable<RegistrationResponse> {
    return this.http.post<RegistrationResponse>(`${ environment.prov }/users`, data);
  }

  public postRequestReset(data: RequestResetData): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${ environment.prov }/users/resetPassword`, data);
  }

  public postConfirmReset(data: ConfirmResetData): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${ environment.prov }/users/resetPassword/confirm`, data);
  }
}
