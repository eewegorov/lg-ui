import { ApiResponse } from '../../../core/models/api';

export enum Payment {
  WIDGETS_LIMIT = 'WIDGETS_LIMIT',
  CONTAINER_WIDGETS_LIMIT = 'CONTAINER_WIDGETS_LIMIT',
  INTEGRATION_PAYMENT = 'INTEGRATION_PAYMENT',
  WIDGET_HAS_PAYMENT_OPTIONS = 'WIDGET_HAS_PAYMENT_OPTIONS',
  PAYMENT_SETTINGS = 'PAYMENT_SETTINGS',
  MAX_LEADS_SHOW_REACHED = 'MAX_LEADS_SHOW_REACHED'
}

export interface SitesResponse extends ApiResponse {
  data: Site[];
}

export interface Site {
  id: string;
  name: string;
  url: string;
  tariffName: string;
  tariffExp: number;
  actions: DayStat[];
  emails: DayStat[];
  leads: DayStat[];
}

export interface DayStat {
  date: number;
  value: number;
}

export interface CreateSiteRequest {
  name: string;
  url: string;
}

export interface CreateSiteResponse extends ApiResponse{
  data: CreateSiteData;
}

export interface CreateSiteData {
  id: string;
  link: string;
}
