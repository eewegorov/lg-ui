import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { ApiResponse } from '../../../core/models/api';
import {
  Coupon,
  CouponById,
  CouponByIdResponse,
  CouponsResponse,
  CreateCoupon,
  CreateCouponResponse,
  UpdateCoupon
} from '../../../core/models/coupons';
import { ErrorHandlerService } from '../../../core/services/error-handler.service';
import { CouponApiService } from './coupon-api.service';


@Injectable({
  providedIn: 'root'
})
export class CouponService {

  constructor(
    private errorHandlerService: ErrorHandlerService,
    private couponApiService: CouponApiService
  ) { }

  public getCouponsList(): Observable<Coupon[]> {
    return this.couponApiService.getCouponsList().pipe(
      map((response: CouponsResponse) => response.data),
      catchError(this.errorHandlerService.handleError)
    );
  }

  public getCouponById(couponId: string): Observable<CouponById> {
    return this.couponApiService.getCouponById(couponId).pipe(
      map((response: CouponByIdResponse) => response.data),
      catchError(this.errorHandlerService.handleError)
    );
  }

  public createCoupon(coupon: CreateCoupon): Observable<Coupon> {
    return this.couponApiService.createCoupon(coupon).pipe(
      map((response: CreateCouponResponse) => response.data),
      catchError(this.errorHandlerService.handleError)
    );
  }

  public updateCoupon(couponId: string, coupon: UpdateCoupon): Observable<boolean> {
    return this.couponApiService.updateCoupon(couponId, coupon).pipe(
      map((response: ApiResponse) => response.success),
      catchError(this.errorHandlerService.handleError)
    );
  }

  public deleteCoupon(couponId: string): Observable<boolean> {
    return this.couponApiService.deleteCoupon(couponId).pipe(
      map((response: ApiResponse) => response.success),
      catchError(this.errorHandlerService.handleError)
    );
  }
}
