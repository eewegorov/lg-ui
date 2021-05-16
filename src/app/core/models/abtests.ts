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

export interface AbtestVariantRequest {
  mode: string;
  templateId: string;
  mockupId: string;
}

export interface AbtestCreateRequest extends AbtestVariantRequest {
  siteId: string;
  widgetId: string;
  name: string;
  description: string;
}

export interface AbtestVariantResponse extends ApiResponse {
  data: AbtestVariant;
}

export interface AbtestCreateResponse extends ApiResponse {
  data: AbtestShort;
}

export interface AbtestVariant {
  value: string;
}

export interface AbtestShort {
  id: string;
  variantId: string;
}

export interface AbtestStatisticsResponse extends ApiResponse {
  data: AbtestStatistics[];
}

export interface AbtestStatistics {
  id: string;
  name: string;
  conversions: AbtestConversion[];
  active: boolean;
  etalon: boolean;
}

export interface AbtestConversion {
  date: number;
  shows: number;
  target: number;
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

export interface AbtestsArchiveResponse extends ApiResponse {
  data: AbtestArchive[];
}

export interface AbtestArchive {
  id: string;
  name: string;
  description: string;
  siteId: string;
  variants: VariantArchiveExtended[];
}

export interface AbtestArchiveExtended extends AbtestArchive{
  etalonConversion: number;
}

export interface VariantArchive {
  widgetId: string;
  name: string;
  shows: number;
  target: number;
  winner: boolean;
  etalon: boolean;
}

export interface VariantArchiveExtended extends VariantArchive {
  conversion: string;
  convNumber: number;
  betterTo: number;
}
