import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { ApiResponse } from '../../../core/models/api';
import { IncomeBalanceResponse, RegistrationsResponse, TransactionsResponse, UserEmail } from '../../../core/models/partner';


@Injectable({
  providedIn: 'root'
})
export class PartnerApiService {

  constructor(private http: HttpClient) { }

  public getTransactions(filterParams): Observable<TransactionsResponse> {
    return this.http.get<TransactionsResponse>(`${ environment.prov }/partner/transactions`, {
      params: filterParams
    });
  }

  public getEarnedMoney(): Observable<IncomeBalanceResponse> {
    return this.http.get<IncomeBalanceResponse>(`${ environment.prov }/partner/income`);
  }

  public getPartnerBalance(): Observable<IncomeBalanceResponse> {
    return this.http.get<IncomeBalanceResponse>(`${ environment.prov }/partner/balance`);
  }

  public getRegistrations(): Observable<RegistrationsResponse> {
    return this.http.get<RegistrationsResponse>(`${ environment.prov }/partner/registrations`);
  }

  public addNewRef(email: UserEmail): Observable<ApiResponse> {
    return this.http.put<ApiResponse>(`${ environment.prov }/partner/registrations`, email);
  }

}
