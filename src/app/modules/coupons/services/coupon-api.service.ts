import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { ApiResponse } from '../../../core/models/api';
import {
  CouponByIdResponse,
  CouponsResponse,
  CreateCoupon,
  CreateCouponResponse,
  UpdateCoupon
} from '../../../core/models/coupons';


@Injectable({
  providedIn: 'root'
})
export class CouponApiService {

  constructor(private http: HttpClient) { }

  public getCouponsList(): Observable<CouponsResponse> {
    return this.http.get<CouponsResponse>(`${ environment.url }/coupons`);
  }

  public getCouponById(couponId: string): Observable<CouponByIdResponse> {
    return this.http.get<CouponByIdResponse>(`${ environment.url }/coupons/${couponId}`);
  }

  public createCoupon(coupon: CreateCoupon): Observable<CreateCouponResponse> {
    return this.http.post<CreateCouponResponse>(`${ environment.url }/coupons`, coupon);
  }

  public updateCoupon(couponId: string, coupon: UpdateCoupon): Observable<ApiResponse> {
    return this.http.put<ApiResponse>(`${ environment.url }/coupons/${couponId}`, coupon);
  }

  public deleteCoupon(couponId: string): Observable<ApiResponse> {
    return this.http.delete<ApiResponse>(`${ environment.url }/coupons/${couponId}`);
  }

}
