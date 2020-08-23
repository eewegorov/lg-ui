import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';
import { Lead, LeadsResponse } from '../../../core/models/crm';
import { ErrorHandlerService } from '../../../core/services/error-handler.service';
import { CrmApiService } from './crm-api.service';



@Injectable({
  providedIn: 'root'
})
export class CrmService {

  constructor(
    private translate: TranslateService,
    private errorHandlerService: ErrorHandlerService,
    private crmApiService: CrmApiService
  ) { }

  public getLeadList(filterParams): Observable<Lead[]> {
    return this.crmApiService.getLeadList(filterParams).pipe(
      map((response: LeadsResponse) => response.data),
      catchError(this.errorHandlerService.handleError)
    );
  }

  public getStates() {
    return [
      {
        type: 'NEW',
        label: this.translate.instant('сrm.page.card.status.new')
      },
      {
        type: 'INWORK',
        label: this.translate.instant('сrm.page.card.status.onWork')
      },
      {
        type: 'INVALID',
        label: this.translate.instant('сrm.page.card.status.bad')
      },
      {
        type: 'SUCCESS',
        label: this.translate.instant('сrm.page.card.status.success')
      }
    ];
  }
}
