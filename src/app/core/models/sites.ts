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
  params: any;
}

export interface CreateIntegrationRequest {
  name: string;
  type: IntegrationTypes;
  default: boolean;
  params: object;
}

export interface UpdateIntegrationRequest {
  name: string;
  default: boolean;
  params: object;
}

export interface CloneIntegrationRequest {
  name: string;
  default: boolean;
  siteId: string;
}

export enum IntegrationTypes {
  CAMPAIGNMONITOR = 'CAMPAIGNMONITOR',
  GETRESPONSE = 'GETRESPONSE',
  MAILCHIMP = 'MAILCHIMP',
  SENDPULSE = 'SENDPULSE',
  UNISENDER = 'UNISENDER',
  BITRIX = 'BITRIX',
  AMOCRM = 'AMOCRM',
  WEBHOOK = 'WEBHOOK',
  SENDBOX = 'SENDBOX',
  EMAIL = 'EMAIL',
  ROISTAT = 'ROISTAT'
}

export interface IntegrationService {
  name: string;
  helpUrl: string;
  type: IntegrationTypes;
  group: string;
  isPayment: boolean;
}

export interface SmartpointsResponse extends ApiResponse {
  data: Smartpoints;
}

export interface Smartpoints {
  enabled: boolean;
  list: Smartpoint[];
}

export interface Smartpoint {
  enabled: boolean;
  autoinvite: boolean;
  pos: string;
  type: string;
}

export enum BitrixConnectionTypes {
  Webhook = 'webhook',
  Api = 'api'
}

export enum FunnelCheckDuplicate {
  NONE = 'NONE',
  PHONE = 'PHONE',
  EMAIL = 'EMAIL'
}

export const FunnelCheckDuplicateValues = {
  NONE: 'Не проверять',
  PHONE: 'Проверять по номеру телефона',
  EMAIL: 'Проверять по email'
};

export interface IntegrationFunnel {
  funnelId: string;
  leadStateId: string;
  checkDuplicate: FunnelCheckDuplicate;
}

export interface AmoAuthRequest {
  client_id: string;
  client_secret: string;
  grant_type: string;
  code: string;
  redirect_uri: string;
}

export interface AmoAuthResponse {
  token_type: string;
  expires_in: number;
  access_token: string;
  refresh_token: string;
}

export interface AmoFunnelResponse {
  _total_items: number;
  _links: AmoFunnelLink;
  _embedded: { pipelines: AmoFunnel };
}

interface AmoFunnelLink {
  self: { href: string };
}

export interface AmoFunnel {
  id: number;
  name: string;
  sort: number;
  is_main: boolean;
  is_unsorted_on: boolean;
  is_archive: boolean;
  account_id: number;
  _links: AmoFunnelLink;
}

