import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Lead, LeadsResponse } from '../../../core/models/crm';
import { ErrorHandlerService } from '../../../core/services/error-handler.service';
import { CrmApiService } from './crm-api.service';


@Injectable({
  providedIn: 'root'
})
export class CrmService {

  constructor(
    private errorHandlerService: ErrorHandlerService,
    private crmApiService: CrmApiService
  ) { }

  public getLeadList(filterParams): Observable<Lead[]> {
    return this.crmApiService.getLeadList(filterParams).pipe(
      map((response: LeadsResponse) => response.data),
      catchError(this.errorHandlerService.handleError)
    );
  }
}
