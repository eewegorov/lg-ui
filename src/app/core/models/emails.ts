import { ApiLimitResponse, ApiResponse } from './api';

export interface EmailsResponse extends ApiLimitResponse {
  data: Email[];
}

export interface Email {
  id: string;
  email: string;
  siteId: string;
  date: number;
}

export interface EmailsStatisticsResponse extends ApiResponse {
  data: EmailsStatistics[];
}

export interface EmailsStatistics {
  date: number;
  items: {
    [siteId: string]: number;
  }
}
