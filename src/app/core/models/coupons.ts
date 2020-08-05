import { ApiResponse } from './api';

export interface CouponsResponse extends ApiResponse {
  data: Coupon[];
}

export interface CouponByIdResponse extends ApiResponse {
  data: CouponById;
}

export interface CreateCouponResponse extends ApiResponse {
  data: Coupon;
}

export interface Coupon {
  id: string;
  code: string;
  name: string;
  type: string;
}

export interface CreateCoupon {
  code: string;
  name: string;
  type: string;
  defaultValue: string;
  values: string[];
  needUseDefault: boolean;
  notificationThreshold: number;
}

export interface CouponById extends CreateCoupon {
  id: string;
}

export interface UpdateCoupon {
  name: string;
  defaultValue: string;
  values: string[];
  needUseDefault: boolean;
  notificationThreshold: number;
}
