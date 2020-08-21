import { ApiLimitResponse } from './api';

export interface LeadsResponse extends ApiLimitResponse {
  data: Lead[];
}

export interface Lead {
  id: string;
  title: string;
  widgetName: string;
  siteId: string;
  siteName: string;
  siteUrl: string;
  pageUrl: string;
  state: string;
  date: string;
  comment: string;
}

export enum Periods {
  TODAY = 'TODAY',
  YESTERDAY = 'YESTERDAY',
  DECADE = 'DECADE',
  WEEK = 'WEEK',
  MONTH = 'MONTH'
}
