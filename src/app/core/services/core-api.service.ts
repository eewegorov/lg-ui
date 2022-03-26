import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TariffPlansResponse } from '../models/tariffPlans';
import { OrderRequest, OrderResponse } from '../models/payment';
import { ConfigService } from './config.service';


@Injectable({
  providedIn: 'root'
})
export class CoreApiService {

  constructor(
    private http: HttpClient,
    private configService: ConfigService
  ) {
  }

  public getTariffPlans(): Observable<TariffPlansResponse> {
    return this.http.get<TariffPlansResponse>(`${this.configService.config.prov}/plans`);
  }

  public createOrder(data: OrderRequest): Observable<OrderResponse> {
    return this.http.post<OrderResponse>(`${this.configService.config.prov}/billing/orders`, data);
  }

}
