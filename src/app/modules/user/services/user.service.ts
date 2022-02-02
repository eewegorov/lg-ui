import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError, map, share } from 'rxjs/operators';
import { ApiResponse } from '../../../core/models/api';
import { PasswordRequest, Phone, User, UserRequest, UserResponse } from '../../../core/models/user';
import { ErrorHandlerService } from '../../../core/services/error-handler.service';
import { UserApiService } from './user-api.service';


@Injectable({
  providedIn: 'root'
})
export class UserService {
  public userPhone: string;
  public getMeSub: Observable<User>;

  constructor(
    private errorHandlerService: ErrorHandlerService,
    private userApiService: UserApiService
  ) { }

  public getMeInfo(): Observable<User> {
    if (this.getMeSub) {
      return this.getMeSub;
    } else {
      this.getMeSub = this.userApiService.getMeInfo().pipe(
        map((response: UserResponse) => response.data),
        catchError(this.errorHandlerService.handleError),
        share()
      );
      return this.getMeSub;
    }
  }

  public updateMeInfo(user: UserRequest): Observable<boolean> {
    return this.userApiService.updateMeInfo(user).pipe(
      map((response: ApiResponse) => response.success),
      catchError(this.errorHandlerService.handleError)
    );
  }

  public updatePassword(password: PasswordRequest): Observable<boolean> {
    return this.userApiService.updatePassword(password).pipe(
      map((response: ApiResponse) => response.success),
      catchError(this.errorHandlerService.handleError)
    );
  }

  public savePhone(phone: Phone): Observable<boolean> {
    return this.userApiService.savePhone(phone).pipe(
      map((response: ApiResponse) => response.success),
      catchError(this.errorHandlerService.handleError)
    );
  }
}
