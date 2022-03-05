import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import {
  CompaniesResponse,
  CompanyRequest,
  CompanyResponse,
  CompanyShort,
  DeleteCompanyRequest,
  Entities,
  FullWidget,
  Mockup,
  MockupGroup,
  MockupGroupsResponse,
  MockupResponse,
  MockupShort,
  MockupsResponse,
  SmartPoint,
  SmartPointEnableRequest,
  SmartPointUpdateRequest,
  WidgetChangeCompanyRequest,
  WidgetCloned,
  WidgetCloneRequest,
  WidgetCloneResponse,
  WidgetStatistics,
  WidgetStatisticsResponse,
  WidgetCreated,
  WidgetCreateRequest,
  WidgetCreateResponse,
  WidgetInfo,
  WidgetRename, WidgetResponse,
  WidgetsResponse,
  WidgetTemplate,
  WidgetTemplatesResponse,
  WidgetType,
  WidgetTypesResponse
} from '../../../core/models/widgets';
import { ErrorHandlerService } from '../../../core/services/error-handler.service';
import { WidgetApiService } from './widget-api.service';
import { ApiResponse } from '../../../core/models/api';


@Injectable({
  providedIn: 'root'
})
export class WidgetService {
  public updateWidgetsList = new Subject<string>();
  public updateCurrentContainer = new Subject<string>();
  public openCloneWidgetModal = new Subject<{data: WidgetInfo; containerId: string}>();
  public loadWidgetToController = new Subject();
  public onChangePayment = new Subject<boolean>();
  public validators = [];

  private currentCompanies = [];
  private currentContainers = [];
  private currentWidgetTypes = [];
  private currentWidgetTemplates = [];

  constructor(
    private errorHandlerService: ErrorHandlerService,
    private widgetApiService: WidgetApiService
  ) {
  }

  public getWidgetsList(siteId: string): Observable<Entities> {
    return this.widgetApiService.getWidgetsList(siteId).pipe(
      map((response: WidgetsResponse) => response.data),
      catchError(this.errorHandlerService.handleError)
    );
  }

  public getWidgetById(siteId: string, widgetId: string): Observable<FullWidget> {
    return this.widgetApiService.getWidgetById(siteId, widgetId).pipe(
      map((response: WidgetResponse) => response.data),
      catchError(this.errorHandlerService.handleError)
    );
  }

  public getWidgetsTypes(): Observable<WidgetType[]> {
    return this.widgetApiService.getWidgetsTypes().pipe(
      map((response: WidgetTypesResponse) => response.data),
      catchError(this.errorHandlerService.handleError)
    );
  }

  public getCompanies(siteId: string): Observable<CompanyShort[]> {
    return this.widgetApiService.getCompanies(siteId).pipe(
      map((response: CompaniesResponse) => response.data),
      catchError(this.errorHandlerService.handleError)
    );
  }

  public getMockupGroups(type: string): Observable<MockupGroup[]> {
    return this.widgetApiService.getMockupGroups(type).pipe(
      map((response: MockupGroupsResponse) => response.data),
      catchError(this.errorHandlerService.handleError)
    );
  }

  public getMockups(type: string, categories?: string): Observable<Mockup[]> {
    return this.widgetApiService.getMockups(type, categories).pipe(
      map((response: MockupsResponse) => response.data),
      catchError(this.errorHandlerService.handleError)
    );
  }

  public getMockup(id: string): Observable<MockupShort> {
    return this.widgetApiService.getMockup(id).pipe(
      map((response: MockupResponse) => response.data),
      catchError(this.errorHandlerService.handleError)
    );
  }

  public updateMockup(id: string, mockup: FullWidget): Observable<boolean> {
    return this.widgetApiService.updateMockup(id, mockup).pipe(
      map((response: ApiResponse) => response.success),
      catchError(this.errorHandlerService.handleError)
    );
  }

  public getWidgetsTemplates(): Observable<WidgetTemplate[]> {
    return this.widgetApiService.getWidgetsTemplates().pipe(
      map((response: WidgetTemplatesResponse) => response.data),
      catchError(this.errorHandlerService.handleError)
    );
  }

  public getWidgetStatistics(widgetId: string): Observable<WidgetStatistics> {
    return this.widgetApiService.getWidgetStatistics(widgetId).pipe(
      map((response: WidgetStatisticsResponse) => response.data),
      catchError(this.errorHandlerService.handleError)
    );
  }

  public deleteWidget(siteId: string, widgetId: string): Observable<boolean> {
    return this.widgetApiService.deleteWidget(siteId, widgetId).pipe(
      map((response: ApiResponse) => response.success),
      catchError(this.errorHandlerService.handleError)
    );
  }

  public updateWidget(siteId: string, widgetId: string, widget: FullWidget): Observable<boolean> {
    return this.widgetApiService.updateWidget(siteId, widgetId, widget).pipe(
      map((response: ApiResponse) => response.success),
      catchError(this.errorHandlerService.handleError)
    );
  }

  public create(siteId: string, widget: WidgetCreateRequest): Observable<WidgetCreated> {
    return this.widgetApiService.create(siteId, widget).pipe(
      map((response: WidgetCreateResponse) => response.data),
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

  public rename(siteId: string, widgetId: string, name: string): Observable<boolean> {
    const renamedCWidget: WidgetRename = { name };
    return this.widgetApiService.rename(siteId, widgetId, renamedCWidget).pipe(
      map((response: ApiResponse) => response.success),
      catchError(this.errorHandlerService.handleError)
    );
  }

  public clone(siteId: string, widgetId: string, targetSiteId: string, companyId: string): Observable<WidgetCloned> {
    const cloneWidget: WidgetCloneRequest = { siteId: targetSiteId, companyId };
    return this.widgetApiService.clone(siteId, widgetId, cloneWidget).pipe(
      map((response: WidgetCloneResponse) => response.data),
      catchError(this.errorHandlerService.handleError)
    );
  }

  public changeWidgetCompany(siteId: string, widgetId: string, companyId: string): Observable<boolean> {
    const changedCompanyWidget: WidgetChangeCompanyRequest = { companyId };
    return this.widgetApiService.changeWidgetCompany(siteId, widgetId, changedCompanyWidget).pipe(
      map((response: ApiResponse) => response.success),
      catchError(this.errorHandlerService.handleError)
    );
  }

  public swap(siteId: string, widgetId1: string, widgetId2: string): Observable<boolean> {
    const widgetSwap = { widgetId1, widgetId2 };
    return this.widgetApiService.swap(siteId, widgetSwap).pipe(
      map((response: ApiResponse) => response.success),
      catchError(this.errorHandlerService.handleError)
    );
  }

  public saveSmartpointType(siteId: string, smartpoint: SmartPoint): Observable<boolean> {
    const updatedSmartpoint: SmartPointUpdateRequest = {
      enabled: smartpoint.enabled,
      autoinvite: smartpoint.autoinvite,
      pos: smartpoint.pos
    };
    return this.widgetApiService.putSmartpointType(siteId, smartpoint.type, updatedSmartpoint).pipe(
      map((response: ApiResponse) => response.success),
      catchError(this.errorHandlerService.handleError)
    );
  }

  public startStopSmartpoint(siteId: string, enabled: boolean): Observable<boolean> {
    const smartpoint: SmartPointEnableRequest = { enabled };
    return this.widgetApiService.startStopSmartpoint(siteId, smartpoint).pipe(
      map((response: ApiResponse) => response.success),
      catchError(this.errorHandlerService.handleError)
    );
  }

  public createCompany(siteId: string, companyName: string): Observable<CompanyShort> {
    const company: CompanyRequest = {
      name: companyName
    };
    return this.widgetApiService.createCompany(siteId, company).pipe(
      map((response: CompanyResponse) => response.data),
      catchError(this.errorHandlerService.handleError)
    );
  }

  public deleteCompany(siteId: string, companyId: string, company: DeleteCompanyRequest): Observable<boolean> {
    return this.widgetApiService.deleteCompany(siteId, companyId, company).pipe(
      map((response: ApiResponse) => response.success),
      catchError(this.errorHandlerService.handleError)
    );
  }

  public getDefaultCompany(companies) {
    const currentC = companies || this.currentCompanies;
    return currentC.find((item) => {
      return item.default;
    });
  }

  public getUndefaultCompanies(companies) {
    return companies.filter((item) => {
      return !item.default;
    });
  }

  public setContainers(containers) {
    this.currentContainers = containers;
  }

  public setCurrentCompanies(companies) {
    this.currentCompanies = companies;
  }

  public getCurrentCompanies() {
    return this.currentCompanies;
  }

  public setCurrentWidgetsTypes(types: WidgetType[]): void {
    this.currentWidgetTypes = types;
  }

  public getCurrentWidgetsTypes(): WidgetType[] {
    return this.currentWidgetTypes;
  }

  public setCurrentWidgetsTemplates(templates) {
    this.currentWidgetTemplates = templates;
  }

  public getCurrentWidgetsTemplates() {
    return this.currentWidgetTemplates;
  }

  public getCompanyById(companyId, companies) {
    return companies.find((item) => {
      return item.id === companyId;
    });
  }

  public addValidator(callbackFunc) {
    this.validators.push(callbackFunc);
  }
}
