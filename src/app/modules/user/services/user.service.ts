import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { ApiResponse } from '../../../core/models/api';
import { Phone, User, UserResponse } from '../../../core/models/user';
import { ErrorHandlerService } from '../../../core/services/error-handler.service';
import { CoreApiService } from '../../../core/services/core-api.service';


@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(
    private errorHandlerService: ErrorHandlerService,
    private coreApiService: CoreApiService
  ) { }

  public getMeInfo(): Observable<User> {
    return this.coreApiService.getMeInfo().pipe(
      map((response: UserResponse) => response.data),
      catchError(this.errorHandlerService.handleError)
    );
  }

  public savePhone(data: Phone): Observable<ApiResponse> {
    return this.coreApiService.savePhone(data).pipe(
      catchError(this.errorHandlerService.handleError)
    );
  }
}
