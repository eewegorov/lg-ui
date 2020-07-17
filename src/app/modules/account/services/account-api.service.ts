import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthRequest, AuthResponse, OAuthRequest, OAuthResponse, RegistrationResponse } from '../models/account';
import { environment } from '../../../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class AccountApiService {

  constructor(private http: HttpClient) { }

  public postAuth(data: AuthRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${ environment.authUrl }/oauth/token`, data);
  }

  public postOAuth(data: OAuthRequest): Observable<OAuthResponse> {
    return this.http.post<OAuthResponse>(`${ environment.authUrl }/auth/external`, data);
  }

  public postRegistration(data: FormData): Observable<RegistrationResponse> {
    return this.http.post<RegistrationResponse>(`${ environment.accountUrl }/create`, data);
  }

  public postReset(data: FormData): Observable<RegistrationResponse> {
    return this.http.post<RegistrationResponse>(`${ environment.accountUrl }/resetPassword`, data);
  }
}
