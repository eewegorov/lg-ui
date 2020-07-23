import { ApiResponse } from '../../../core/models/api';

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
