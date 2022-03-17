import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse } from '../../../core/models/api';
import { IncomeBalanceResponse, RegistrationsResponse, TransactionsResponse, UserEmail } from '../../../core/models/partner';
import { ConfigService } from '../../../core/services/config.service';


@Injectable({
  providedIn: 'root'
})
export class PartnerApiService {

  constructor(
    private http: HttpClient,
    private configService: ConfigService
  ) { }

  public getTransactions(filterParams): Observable<TransactionsResponse> {
    return this.http.get<TransactionsResponse>(`${this.configService.config.prov}/partner/transactions`, {
      params: filterParams
    });
  }

  public getEarnedMoney(): Observable<IncomeBalanceResponse> {
    return this.http.get<IncomeBalanceResponse>(`${this.configService.config.prov}/partner/income`);
  }

  public getPartnerBalance(): Observable<IncomeBalanceResponse> {
    return this.http.get<IncomeBalanceResponse>(`${this.configService.config.prov}/partner/balance`);
  }

  public getRegistrations(): Observable<RegistrationsResponse> {
    return this.http.get<RegistrationsResponse>(`${this.configService.config.prov}/partner/registrations`);
  }

  public addNewRef(email: UserEmail): Observable<ApiResponse> {
    return this.http.put<ApiResponse>(`${this.configService.config.prov}/partner/registrations`, email);
  }

}
