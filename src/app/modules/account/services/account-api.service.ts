import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse } from '../../../core/models/api';
import {
  ConfirmResetData,
  OAuthRequest,
  OAuthResponse,
  RegistrationRequest,
  RegistrationResponse,
  RequestResetData
} from '../../../core/models/account';
import { ConfigService } from '../../../core/services/config.service';


@Injectable({
  providedIn: 'root'
})
export class AccountApiService {

  constructor(
    private http: HttpClient,
    private configService: ConfigService
  ) { }

  public postOAuth(data: OAuthRequest): Observable<OAuthResponse> {
    return this.http.post<OAuthResponse>(`${this.configService.config.prov}/auth/external/redirect`, data);
  }

  public postRegistration(data: RegistrationRequest): Observable<RegistrationResponse> {
    return this.http.post<RegistrationResponse>(`${this.configService.config.prov}/users`, data);
  }

  public postRequestReset(data: RequestResetData): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.configService.config.prov}/users/resetPassword`, data);
  }

  public postConfirmReset(data: ConfirmResetData): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.configService.config.prov}/users/resetPassword/confirm`, data);
  }
}
