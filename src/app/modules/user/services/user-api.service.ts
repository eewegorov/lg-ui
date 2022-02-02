import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { ApiResponse } from '../../../core/models/api';
import { PasswordRequest, Phone, UserRequest, UserResponse, Wallet } from '../../../core/models/user';


@Injectable({
  providedIn: 'root'
})
export class UserApiService {

  constructor(private http: HttpClient) { }

  public getMeInfo(): Observable<UserResponse> {
    return this.http.get<UserResponse>(`${ environment.url }/me`);
  }

  public updateMeInfo(user: UserRequest): Observable<ApiResponse> {
    return this.http.put<ApiResponse>(`${ environment.url }/me`, user);
  }

  public updatePassword(password: PasswordRequest): Observable<ApiResponse> {
    return this.http.put<ApiResponse>(`${ environment.url }/me/changePassword`, password);
  }

  public savePhone(data: Phone): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${ environment.url }/me/phone`, data);
  }

  public setWallet(wallet: Wallet): Observable<ApiResponse> {
    return this.http.put<ApiResponse>(`${ environment.url }/me/wallet`, wallet);
  }
}
