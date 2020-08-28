import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Abtest, AbtestsResponse, UpdateAbtest } from '../../../core/models/abtests';
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
  ) { }

  public getTests(): Observable<Abtest[]> {
    return this.abtestsApiService.getTests().pipe(
      map((response: AbtestsResponse) => response.data),
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

  public setListOfABTests(tests: Abtest[]): void {
    this.tests = tests;
  }
}
