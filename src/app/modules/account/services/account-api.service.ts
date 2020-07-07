import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { OAuthData, OAuthResponse } from '../models/account';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AccountApiService {

  constructor(private http: HttpClient) { }

  public postOAuth(data: OAuthData) {
    return this.http.post<OAuthResponse>(`${ environment.url }/auth/external`, data);
  }
}
