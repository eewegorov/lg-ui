import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Entities, WidgetsResponse } from '../../../core/models/widgets';
import { ErrorHandlerService } from '../../../core/services/error-handler.service';
import { WidgetApiService } from './widget-api.service';


@Injectable({
  providedIn: 'root'
})
export class WidgetService {
  private currentCompanies;
  private currentContainers;

  constructor(
    private errorHandlerService: ErrorHandlerService,
    private widgetApiService: WidgetApiService
  ) { }

  public getWidgetsList(siteId: string): Observable<Entities> {
    return this.widgetApiService.getWidgetsList(siteId).pipe(
      map((response: WidgetsResponse) => response.data),
      catchError(this.errorHandlerService.handleError)
    );
  }

  public getDefaultCompany(companies) {
    const currentC = companies || this.currentCompanies;
    return currentC.find(function(item) {
      return item.default;
    });
  }

  public getUndefaultCompanies(companies) {
    return companies.filter(function (item) {
      return !item.default;
    });
  }

  public setContainers(containers) {
    this.currentContainers = containers;
  }
}
