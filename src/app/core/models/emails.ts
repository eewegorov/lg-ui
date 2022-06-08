import { ApiLimitResponse, ApiResponse } from './api';

export interface EmailsResponse extends ApiLimitResponse {
  data: Email[];
}

export interface Email {
  id: string;
  email: string;
  siteId: string;
  date: number;
  gravatarUrl?: string;
}

export interface EmailsStatisticsResponse extends ApiResponse {
  data: EmailsStatistics[];
}

export interface EmailsStatistics {
  date: number;
  items: {
    [siteId: string]: number;
  };
}

export interface EmailsStatisticsView {
  date: number;
  value: number;
}

export interface ClearEmailsRequest {
  siteIds: string;
  start: string;
  end: string;
}
