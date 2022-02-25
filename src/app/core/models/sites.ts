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

export interface SitesStatisticsResponse extends ApiResponse {
  data: SiteStatistics[];
}

export interface SiteStatistics {
  date: Date;
  actions: number;
  emails: number;
  leads: number;
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
  customFieldsMapping: any;
}

export interface CreateIntegrationRequest {
  name: string;
  type: IntegrationTypes;
  default: boolean;
  params: object;
  customFieldsMapping: object;
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

export interface AmoParams {
  subdomain: string;
  clientId: string;
  clientSecret: string;
  code: string;
  accessToken: string;
  refreshToken: string;
  funnelId: string;
  funnelName: string;
  leadStateId: string;
  leadStateName: string;
  checkDuplicate: FunnelCheckDuplicate;
}

export interface AmoAuthRequest {
  client_id: string;
  client_secret: string;
  grant_type: AmoGrantTypes;
  redirect_uri: string;
}

export interface AmoAuthByCodeRequest extends AmoAuthRequest {
  code: string;
}

export interface AmoAuthByRefreshTokenRequest extends AmoAuthRequest {
  refresh_token: string;
}

export enum AmoGrantTypes {
  AuthCode = 'authorization_code',
  RefreshToken = 'refresh_token'
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
  _embedded: { pipelines: AmoFunnel[] };
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
  _embedded: { statuses: AmoStatus[] };
}

export interface AmoStatus {
  id: number;
  name: string;
  sort: number;
  is_editable: boolean;
  pipeline_id: number;
  color: string;
  type: number;
  account_id: number;
  _links: AmoFunnelLink;
}
