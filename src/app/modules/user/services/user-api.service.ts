import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse } from '../../../core/models/api';
import { PasswordRequest, Phone, UserRequest, UserResponse, Wallet } from '../../../core/models/user';
import { ConfigService } from '../../../core/services/config.service';


@Injectable({
  providedIn: 'root'
})
export class UserApiService {

  constructor(
    private http: HttpClient,
    private configService: ConfigService
  ) { }

  public getMeInfo(): Observable<UserResponse> {
    return this.http.get<UserResponse>(`${this.configService.config.prov}/me`);
  }

  public updateMeInfo(user: UserRequest): Observable<ApiResponse> {
    return this.http.put<ApiResponse>(`${this.configService.config.prov}/me`, user);
  }

  public updatePassword(password: PasswordRequest): Observable<ApiResponse> {
    return this.http.put<ApiResponse>(`${this.configService.config.prov}/me/changePassword`, password);
  }

  public savePhone(data: Phone): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.configService.config.prov}/me/phone`, data);
  }

  public setWallet(wallet: Wallet): Observable<ApiResponse> {
    return this.http.put<ApiResponse>(`${this.configService.config.prov}/me/wallet`, wallet);
  }
}
