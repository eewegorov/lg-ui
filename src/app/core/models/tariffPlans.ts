import { ApiResponse } from './api';

export interface TariffPlansResponse extends ApiResponse {
  data: TariffPlan[];
}

export interface TariffPlan {
  id: string;
  name: string;
  productName: string;
  startDate: number;
  endDate: number;
  prices: Price[];
}

export interface Price {
  id: string;
  name: string;
  desc: string;
  days: number;
  price: number;
  planName: string;
}
