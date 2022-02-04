import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { ApiResponse } from '../../../core/models/api';
import {
  OAuthRequest,
  OAuthResponse,
  RegistrationRequest,
  RegistrationResponse,
  ResetData
} from '../../../core/models/account';


@Injectable({
  providedIn: 'root'
})
export class AccountApiService {

  constructor(private http: HttpClient) { }

  public postOAuth(data: OAuthRequest): Observable<OAuthResponse> {
    return this.http.post<OAuthResponse>(`${ environment.url }/auth/external/redirect`, data);
  }

  public postRegistration(data: RegistrationRequest): Observable<RegistrationResponse> {
    return this.http.post<RegistrationResponse>(`${ environment.url }/users`, data);
  }

  public postReset(data: ResetData): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${ environment.url }/users/resetPassword`, data);
  }
}
