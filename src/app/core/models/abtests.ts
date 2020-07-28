import { ApiResponse } from './api';

export interface AbtestsResponse extends ApiResponse {
  data: Abtest[];
}

export interface Abtest {
  id: string;
  name: string;
  description: string;
  state: 'ACTIVE' | 'PAUSED';
  type: string;
  siteId: string;
}
