import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';
import {
  Lead,
  LeadById,
  LeadByIdResponse,
  LeadByIdWithIndex,
  LeadsResponse,
  LeadsWidgetsResponse,
  LeadWidgets,
  StateWithIndex,
  UpdateComment,
  UpdateState
} from '../../../core/models/crm';
import { ErrorHandlerService } from '../../../core/services/error-handler.service';
import { CrmApiService } from './crm-api.service';
import { ApiResponse } from '../../../core/models/api';


@Injectable({
  providedIn: 'root'
})
export class CrmService {
  public openLeadInfoSidebar: BehaviorSubject<LeadByIdWithIndex> = new BehaviorSubject(null);
  public updateLeadInfo: BehaviorSubject<StateWithIndex> = new BehaviorSubject(null);

  constructor(
    private translate: TranslateService,
    private errorHandlerService: ErrorHandlerService,
    private crmApiService: CrmApiService
  ) {
  }

  public getLeadList(filterParams): Observable<Lead[]> {
    return this.crmApiService.getLeadList(filterParams).pipe(
      map((response: LeadsResponse) => response.data),
      catchError(this.errorHandlerService.handleError)
    );
  }

  public getLeadById(leadId: string): Observable<LeadById> {
    return this.crmApiService.getLeadById(leadId).pipe(
      map((response: LeadByIdResponse) => response.data),
      catchError(this.errorHandlerService.handleError)
    );
  }

  public updateLeadState(leadId: string, state: UpdateState): Observable<boolean> {
    return this.crmApiService.updateLeadState(leadId, state).pipe(
      map((response: ApiResponse) => response.success),
      catchError(this.errorHandlerService.handleError)
    );
  }

  public updateLeadComment(leadId: string, comment: UpdateComment): Observable<boolean> {
    return this.crmApiService.updateLeadComment(leadId, comment).pipe(
      map((response: ApiResponse) => response.success),
      catchError(this.errorHandlerService.handleError)
    );
  }

  public getLeadsFilters(): Observable<LeadWidgets[]> {
    return this.crmApiService.getLeadsFilters().pipe(
      map((response: LeadsWidgetsResponse) => response.data),
      catchError(this.errorHandlerService.handleError)
    );
  }

  public getStates() {
    return [
      {
        id: 'NEW',
        name: this.translate.instant('crm.page.card.status.new')
      },
      {
        id: 'INWORK',
        name: this.translate.instant('crm.page.card.status.onWork')
      },
      {
        id: 'INVALID',
        name: this.translate.instant('crm.page.card.status.bad')
      },
      {
        id: 'SUCCESS',
        name: this.translate.instant('crm.page.card.status.success')
      }
    ];
  }
}
