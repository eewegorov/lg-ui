import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse } from '../models/api';
import { TariffPlansResponse } from '../models/tariffPlans';
import { Phone, UserResponse, Wallet } from '../models/user';


@Injectable({
  providedIn: 'root'
})
export class CoreApiService {

  constructor(private http: HttpClient) { }

  public getMeInfo(): Observable<UserResponse> {
    return this.http.get<UserResponse>(`${ environment.url }/me`);
  }

  public getTariffPlans(): Observable<TariffPlansResponse> {
    return this.http.get<TariffPlansResponse>(`${ environment.url }/plans`);
  }

  public savePhone(data: Phone): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${ environment.url }/me/phone`, data);
  }

  public setWallet(wallet: Wallet): Observable<ApiResponse> {
    return this.http.put<ApiResponse>(`${ environment.url }/me/wallet`, wallet);
  }

}
