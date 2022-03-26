import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse } from '../../../core/models/api';
import { CouponByIdResponse, CouponsResponse, CreateCoupon, CreateCouponResponse, UpdateCoupon } from '../../../core/models/coupons';
import { ConfigService } from '../../../core/services/config.service';


@Injectable({
  providedIn: 'root'
})
export class CouponApiService {

  constructor(
    private http: HttpClient,
    private configService: ConfigService
  ) {
  }

  public getCouponsList(): Observable<CouponsResponse> {
    return this.http.get<CouponsResponse>(`${this.configService.config.prov}/coupons`);
  }

  public getCouponById(couponId: string): Observable<CouponByIdResponse> {
    return this.http.get<CouponByIdResponse>(`${this.configService.config.prov}/coupons/${couponId}`);
  }

  public createCoupon(coupon: CreateCoupon): Observable<CreateCouponResponse> {
    return this.http.post<CreateCouponResponse>(`${this.configService.config.prov}/coupons`, coupon);
  }

  public updateCoupon(couponId: string, coupon: UpdateCoupon): Observable<ApiResponse> {
    return this.http.put<ApiResponse>(`${this.configService.config.prov}/coupons/${couponId}`, coupon);
  }

  public deleteCoupon(couponId: string): Observable<ApiResponse> {
    return this.http.delete<ApiResponse>(`${this.configService.config.prov}/coupons/${couponId}`);
  }

}
