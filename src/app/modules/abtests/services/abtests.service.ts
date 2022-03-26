import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import {
  Abtest,
  AbtestArchive,
  AbtestCreateRequest,
  AbtestCreateResponse,
  AbtestsArchiveResponse,
  AbtestShort,
  AbtestsResponse,
  AbtestStatistics,
  AbtestStatisticsResponse,
  AbtestVariant,
  AbtestVariantRequest,
  AbtestVariantResponse,
  AbtestVariantsResponse,
  CloneVariantResponse,
  UpdateAbtest,
  Variant
} from '../../../core/models/abtests';
import { ApiResponse } from '../../../core/models/api';
import { ErrorHandlerService } from '../../../core/services/error-handler.service';
import { AbtestsApiService } from './abtests-api.service';


@Injectable({
  providedIn: 'root'
})
export class AbtestsService {
  private tests: Abtest[];

  constructor(
    private errorHandlerService: ErrorHandlerService,
    private abtestsApiService: AbtestsApiService
  ) {
  }

  public getTests(): Observable<Abtest[]> {
    return this.abtestsApiService.getTests().pipe(
      map((response: AbtestsResponse) => response.data),
      catchError(this.errorHandlerService.handleError)
    );
  }

  public createTest(test: AbtestCreateRequest): Observable<AbtestShort> {
    return this.abtestsApiService.createTest(test).pipe(
      map((response: AbtestCreateResponse) => response.data),
      catchError(this.errorHandlerService.handleError)
    );
  }

  public getVariants(id: string): Observable<Variant[]> {
    return this.abtestsApiService.getVariants(id).pipe(
      map((response: AbtestVariantsResponse) => response.data),
      catchError(this.errorHandlerService.handleError)
    );
  }

  public getStatistics(id: string): Observable<AbtestStatistics> {
    return this.abtestsApiService.getStatistics(id).pipe(
      map((response: AbtestStatisticsResponse) => response.data),
      catchError(this.errorHandlerService.handleError)
    );
  }

  public start(id: string): Observable<number> {
    return this.abtestsApiService.start(id).pipe(
      map((response: ApiResponse) => response.code),
      catchError(this.errorHandlerService.handleError)
    );
  }

  public pause(id: string): Observable<number> {
    return this.abtestsApiService.pause(id).pipe(
      map((response: ApiResponse) => response.code),
      catchError(this.errorHandlerService.handleError)
    );
  }

  public deleteTest(id: string): Observable<boolean> {
    return this.abtestsApiService.deleteTest(id).pipe(
      map((response: ApiResponse) => response.success),
      catchError(this.errorHandlerService.handleError)
    );
  }

  public update(id: string, test: UpdateAbtest): Observable<boolean> {
    return this.abtestsApiService.update(id, test).pipe(
      map((response: ApiResponse) => response.success),
      catchError(this.errorHandlerService.handleError)
    );
  }

  public createVariant(testId: string, test: AbtestVariantRequest): Observable<AbtestVariant> {
    return this.abtestsApiService.createVariant(testId, test).pipe(
      map((response: AbtestVariantResponse) => response.data),
      catchError(this.errorHandlerService.handleError)
    );
  }

  public cloneVariant(testId: string, variantId: string): Observable<Variant> {
    return this.abtestsApiService.cloneVariant(testId, variantId).pipe(
      map((response: CloneVariantResponse) => response.data),
      catchError(this.errorHandlerService.handleError)
    );
  }

  public deleteVariant(testId: string, variantId: string): Observable<boolean> {
    return this.abtestsApiService.deleteVariant(testId, variantId).pipe(
      map((response: ApiResponse) => response.success),
      catchError(this.errorHandlerService.handleError)
    );
  }

  public chooseWinner(testId: string, variantId: string): Observable<boolean> {
    return this.abtestsApiService.chooseWinner(testId, variantId).pipe(
      map((response: ApiResponse) => response.success),
      catchError(this.errorHandlerService.handleError)
    );
  }

  public resetStats(id: string): Observable<boolean> {
    return this.abtestsApiService.resetStats(id).pipe(
      map((response: ApiResponse) => response.success),
      catchError(this.errorHandlerService.handleError)
    );
  }

  public getArchTests(): Observable<AbtestArchive[]> {
    return this.abtestsApiService.getArchTests().pipe(
      map((response: AbtestsArchiveResponse) => response.data),
      catchError(this.errorHandlerService.handleError)
    );
  }

  public deleteArchTest(id: string): Observable<boolean> {
    return this.abtestsApiService.deleteArchTest(id).pipe(
      map((response: ApiResponse) => response.success),
      catchError(this.errorHandlerService.handleError)
    );
  }

  public setListOfABTests(tests: Abtest[]): void {
    this.tests = tests;
  }

  public getListOfABTests() {
    return this.tests;
  }
}
