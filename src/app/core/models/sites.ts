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
