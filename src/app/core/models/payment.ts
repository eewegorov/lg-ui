import { ApiResponse } from './api';

export enum Payment {
  WIDGETS_LIMIT = 'WIDGETS_LIMIT',
  CONTAINER_WIDGETS_LIMIT = 'CONTAINER_WIDGETS_LIMIT',
  INTEGRATION_PAYMENT = 'INTEGRATION_PAYMENT',
  WIDGET_HAS_PAYMENT_OPTIONS = 'WIDGET_HAS_PAYMENT_OPTIONS',
  PAYMENT_SETTINGS = 'PAYMENT_SETTINGS',
  MAX_LEADS_SHOW_REACHED = 'MAX_LEADS_SHOW_REACHED'
}

export interface OrderRequest {
  siteId: string;
  priceId: string;
}

export interface OrderResponse extends ApiResponse {
  data: Order;
}

export interface Order {
  billingParams: BillingParams;
}

export interface BillingParams {
  [key: string]: string;
}
