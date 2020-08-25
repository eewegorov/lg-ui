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
  status?: string;
  date: number;
  comment: string;
}

export interface LeadByIdResponse extends ApiLimitResponse {
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

export interface UpdateComment {
  comment: string;
}

export enum Periods {
  TODAY = 'TODAY',
  YESTERDAY = 'YESTERDAY',
  DECADE = 'DECADE',
  WEEK = 'WEEK',
  MONTH = 'MONTH'
}
