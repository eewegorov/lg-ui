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
