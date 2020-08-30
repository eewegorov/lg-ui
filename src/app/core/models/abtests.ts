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

export interface UpdateAbtest {
  name: string;
  description: string;
}

export interface CloneVariantResponse extends ApiResponse {
  data: Variant;
}

export interface Variant {
  id: string;
  name: string;
  active: boolean;
  abtestInfo: AbTestInfo;
}

export interface AbTestInfo {
  id: string;
  type: string;
}

export interface NewVariant extends Variant {
  conversions: string[];
  etalon: boolean;
}
