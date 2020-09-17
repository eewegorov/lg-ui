import { ApiResponse } from './api';

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

export interface SitesShortResponse extends ApiResponse {
  data: SiteShort[];
}

export interface SiteShortResponse extends ApiResponse {
  data: SiteShort;
}

export interface SiteShort {
  id: string;
  name: string;
  url: string;
  tariffName: string;
  tariffExp: number;
  trial: boolean;
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

export interface SiteSettingsResponse extends ApiResponse {
  data: SiteSettings;
}

export interface SiteSettings {
  name: string;
  url: string;
  needLeadNotification: boolean;
  logoRefLink: boolean;
  needEmailSubscriptions: boolean;
  needHideLogo: boolean;
  yandexAnalyticsCounter: string;
  googleAnalyticsService: string;
}

export interface IntegrationsResponse {
  data: Integration[];
}

export interface IntegrationResponse {
  data: IntegrationItem;
}

export interface Integration {
  id: string;
  name: string;
  type: string;
  default: boolean;
  active: boolean;
  serviceName: string;
  isPayment: boolean;
}

export interface IntegrationItem {
  id: string;
  name: string;
  type: string;
  default: boolean;
  active: boolean;
  params: object;
}

export interface IntegrationRequest {
  name: string;
  default: boolean;
  params: object;
}
