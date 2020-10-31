import { ApiLimitResponse, ApiResponse } from './api';

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
  status?: string;
  date: number;
  comment: string;
}

export interface LeadRequest {
  orders: string;
  limit: number;
  offset: number;
  dateFrom: number;
  dateTo: number;
  siteId?: string;
  widgetName?: string;
  state?: string;
}

export interface LeadByIdResponse extends ApiResponse {
  data: LeadById;
}

export interface LeadById {
  id: string;
  title: string;
  firstName: string;
  lastName: string;
  phones: string[];
  emails: string[];
  comment: string;
  userComment: string;
  pageUrl: string;
  pageTitle: string;
  visitNo: number;
  ip: string;
  history: LeadHistory[];
  state: string;
  siteName: string;
  siteUrl: string;
  createDate: number;
  widgetName: string;
  fieldsValues: LeadCustomFields[];
}

export interface LeadHistory {
  title: string;
  url: string;
  serverDate: number;
  userDate: number;
}

export interface LeadCustomFields {
  id: string;
  name: string;
  value: string;
}

export interface LeadByIdWithIndex {
  data: LeadById;
  index: number;
}

export interface UpdateState {
  state: string;
}

export interface StateWithIndex {
  index: number;
  state: string;
}

export interface UpdateComment {
  comment: string;
}

export interface LeadsWidgetsResponse extends ApiResponse {
  data: LeadWidgets[];
}

export interface LeadWidgets {
  id: string;
  name: string;
  widgets: LeadWidget[];
}

export interface LeadWidget {
  id: string;
  name: string;
}

export enum Periods {
  TODAY = 'TODAY',
  YESTERDAY = 'YESTERDAY',
  DECADE = 'DECADE',
  WEEK = 'WEEK',
  MONTH = 'MONTH'
}
