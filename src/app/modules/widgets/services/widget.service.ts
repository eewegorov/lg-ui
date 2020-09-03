import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import {
  Entities,
  WidgetRename,
  WidgetsResponse,
  WidgetTemplate,
  WidgetTemplatesResponse, WidgetType, WidgetTypesResponse
} from '../../../core/models/widgets';
import { ErrorHandlerService } from '../../../core/services/error-handler.service';
import { WidgetApiService } from './widget-api.service';
import { ApiResponse } from '../../../core/models/api';


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

  public getWidgetsTypes(): Observable<WidgetType[]> {
    return this.widgetApiService.getWidgetsTypes().pipe(
      map((response: WidgetTypesResponse) => response.data),
      catchError(this.errorHandlerService.handleError)
    );
  }

  public getWidgetsTemplates(): Observable<WidgetTemplate[]> {
    return this.widgetApiService.getWidgetsTemplates().pipe(
      map((response: WidgetTemplatesResponse) => response.data),
      catchError(this.errorHandlerService.handleError)
    );
  }

  public rename(siteId: string, widgetId: string, name: string): Observable<boolean> {
    const renamedCWidget: WidgetRename = { name: name };
    return this.widgetApiService.rename(siteId, widgetId, renamedCWidget).pipe(
      map((response: ApiResponse) => response.success),
      catchError(this.errorHandlerService.handleError)
    );
  }

  public switch(siteId: string, widgetId: string, active: boolean): Observable<boolean> {
    const action = active ? 'start' : 'stop';
    return this.widgetApiService.switch(siteId, widgetId, action).pipe(
      map((response: ApiResponse) => response.success),
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
