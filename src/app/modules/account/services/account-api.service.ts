import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { AuthRequest, AuthResponse, OAuthRequest, OAuthResponse, RegistrationResponse } from '../../../core/models/account';


@Injectable({
  providedIn: 'root'
})
export class AccountApiService {

  constructor(private http: HttpClient) { }

  public postAuth(data: AuthRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${ environment.oauthUrl }/token`,
      '', {
      headers: {
        'Authorization': `Basic dWk6dWk=`
      },
      params: {
        password: data.password,
        grant_type: data.grant_type,
        username: data.username
      }
      });
  }

  public postOAuth(data: OAuthRequest): Observable<OAuthResponse> {
    return this.http.post<OAuthResponse>(`${ environment.url }/auth/external/redirect`, data);
  }

  public postRegistration(data: FormData): Observable<RegistrationResponse> {
    return this.http.post<RegistrationResponse>(`${ environment.url }/users`, data);
  }

  public postReset(data: FormData): Observable<RegistrationResponse> {
    return this.http.post<RegistrationResponse>(`${ environment.url }/users/resetPassword`, data);
  }
}
