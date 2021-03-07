import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';
import { ApiResponse } from '../../../core/models/api';
import {
  Container,
  ContainerInfoResponse,
  ContainerizedWidgetCloneRequest, ContainerRequest,
  ContainerResponse,
  ContainerShort,
  ContainersResponse, WidgetChangeCompanyRequest, WidgetCloned, WidgetCloneRequest,
  WidgetCloneResponse,
  WidgetRename
} from '../../../core/models/widgets';
import { ErrorHandlerService } from '../../../core/services/error-handler.service';
import { ContainerizedWidgetApiService } from './containerized-widget-api.service';
import { SitesService } from '../../sites/services/sites.service';


@Injectable({
  providedIn: 'root'
})
export class ContainerizedWidgetService {

  constructor(
    private translate: TranslateService,
    private errorHandlerService: ErrorHandlerService,
    private sitesService: SitesService,
    private containerizedWidgetApiService: ContainerizedWidgetApiService
  ) { }

  public getWContainers(siteId: string): Observable<ContainerShort[]> {
    return this.containerizedWidgetApiService.getWContainers(siteId).pipe(
      map((response: ContainersResponse) => response.data),
      catchError(this.errorHandlerService.handleError)
    );
  }

  public getWContainerInfo(siteId: string, containerId: string): Observable<Container> {
    return this.containerizedWidgetApiService.getWContainerInfo(siteId, containerId).pipe(
      map((response: ContainerInfoResponse) => response.data),
      catchError(this.errorHandlerService.handleError)
    );
  }

  public createWContainer(siteId: string, containerName: string): Observable<ContainerShort> {
    const container: ContainerRequest = { name: containerName };
    return this.containerizedWidgetApiService.createWContainer(siteId, container).pipe(
      map((response: ContainerResponse) => response.data),
      catchError(this.errorHandlerService.handleError)
    );
  }

  public updateWContainer(siteId: string, containerId: string, name: string, description: string): Observable<ContainerShort> {
    const container: ContainerRequest = { name, description };
    return this.containerizedWidgetApiService.updateWContainer(siteId, containerId, container).pipe(
      map((response: ContainerResponse) => response.data),
      catchError(this.errorHandlerService.handleError)
    );
  }

  public deleteWContainer(siteId: string, containerId: string): Observable<boolean> {
    return this.containerizedWidgetApiService.deleteWContainer(siteId, containerId).pipe(
      map((response: ApiResponse) => response.success),
      catchError(this.errorHandlerService.handleError)
    );
  }

  public switch(siteId: string, widgetId: string, active: boolean): Observable<boolean> {
    const action = active ? 'start' : 'stop';
    return this.containerizedWidgetApiService.switch(siteId, widgetId, action).pipe(
      map((response: ApiResponse) => response.success),
      catchError(this.errorHandlerService.handleError)
    );
  }

  public rename(siteId: string, widgetId: string, name: string): Observable<boolean> {
    const renamedCWidget: WidgetRename = { name };
    return this.containerizedWidgetApiService.rename(siteId, widgetId, renamedCWidget).pipe(
      map((response: ApiResponse) => response.success),
      catchError(this.errorHandlerService.handleError)
    );
  }

  public clone(siteId: string, widgetId: string, targetSiteId: string, companyId: string, containerId: string): Observable<WidgetCloned> {
    const cloneWidget: ContainerizedWidgetCloneRequest = { siteId: targetSiteId, companyId, containerId };
    return this.containerizedWidgetApiService.clone(siteId, widgetId, cloneWidget).pipe(
      map((response: WidgetCloneResponse) => response.data),
      catchError(this.errorHandlerService.handleError)
    );
  }

  public changeCWidgetCompany(siteId: string, widgetId: string, companyId: string): Observable<boolean> {
    const changedCompanyWidget: WidgetChangeCompanyRequest = { companyId };
    return this.containerizedWidgetApiService.changeCWidgetCompany(siteId, widgetId, changedCompanyWidget).pipe(
      map((response: ApiResponse) => response.success),
      catchError(this.errorHandlerService.handleError)
    );
  }

  public swap(siteId: string, widgetId1: string, widgetId2: string): Observable<boolean> {
    const widgetSwap = { widgetId1, widgetId2 };
    return this.containerizedWidgetApiService.swap(siteId, widgetSwap).pipe(
      map((response: ApiResponse) => response.success),
      catchError(this.errorHandlerService.handleError)
    );
  }

  public getWContainerName(siteId: string) {
    const searchText = this.translate.instant('containerized.container.label') + ' #';
    return this.getWContainers(siteId || this.sitesService.getCurrentSiteId()).pipe(
      map((response: ContainerShort[]) => {
        if (response.length) {
          let compareNumber;
          response.forEach((item: ContainerShort) => {
            if (item.name.indexOf(searchText) > -1) {
              compareNumber = 1;
              const lastChar = parseInt(item.name.substring(searchText.length), 10);
              if (lastChar > compareNumber) {
                compareNumber = lastChar;
              }
            }
          });
          compareNumber = compareNumber ? (compareNumber + 1) : 1;
          return searchText + compareNumber;
        } else {
          return searchText + '1';
        }
      })
    );
  }

  public getContainerInstallCode(containerId) {
    const className = `lg-containerized-id-${containerId}`;
    return `<div class="${className}"></div>`;
  }
}
