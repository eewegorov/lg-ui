import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { OAuthData, OAuthResponse, RegistrationData, RegistrationResponse } from '../models/account';
import { environment } from '../../../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class AccountApiService {

  constructor(private http: HttpClient) { }

  public postOAuth(data: OAuthData): Observable<OAuthResponse> {
    return this.http.post<OAuthResponse>(`${ environment.url }/auth/external`, data);
  }

  public postRegistration(data: FormData): Observable<RegistrationResponse> {
    return this.http.post<RegistrationResponse>(`${ environment.authUrl }/create`, data);
  }
}
