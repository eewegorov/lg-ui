import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Order, OrderRequest, OrderResponse } from '../models/payment';
import { ErrorHandlerService } from './error-handler.service';
import { CoreApiService } from './core-api.service';


@Injectable({
  providedIn: 'root'
})
export class BillingService {

  constructor(
    private errorHandlerService: ErrorHandlerService,
    private coreApiService: CoreApiService
  ) { }

  public createOrder(siteId: string, priceId: string): Observable<Order> {
    const order: OrderRequest = { siteId, priceId };

    return this.coreApiService.createOrder(order).pipe(
      map((response: OrderResponse) => response.data),
      catchError(this.errorHandlerService.handleError)
    );
  }
}
