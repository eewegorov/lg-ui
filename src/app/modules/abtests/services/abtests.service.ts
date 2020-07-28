import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Abtest, AbtestsResponse } from '../../../core/models/abtests';
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

  public setListOfABTests(tests: Abtest[]): void {
    this.tests = tests;
  }
}
