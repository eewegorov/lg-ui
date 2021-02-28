import { ApiResponse } from './api';

export interface WidgetsResponse extends ApiResponse {
  data: Entities;
}

export interface Entities {
  companies: Company[];
  containers: Container[];
  smartPoints: SmartPoints;
  widgets: Widget[];
}

export interface Company {
  id: string;
  name: string;
  default: boolean;
}

export interface CompanyRequest {
  name: string;
}

export interface CompanyResponse extends ApiResponse {
  data: CompanyShort;
}

export interface CompanyShort {
  id: string;
  name: string;
}

export interface Container {
  id: string;
  description: string;
  name: string;
  widgets: WidgetInfo[];
}

export interface SmartPoints {
  enabled: boolean;
  list: SmartPoint[];
}

export interface SmartPoint {
  enabled: boolean;
  autoinvite: boolean;
  pos: string;
  type: SmartPointTypes;
}

export interface SmartPointUpdateRequest {
  enabled: boolean;
  autoinvite: boolean;
  pos: string;
}

export interface SmartPointEnableRequest {
  enabled: boolean;
}

export enum SmartPointTypes {
  CALLBACK = 'CALLBACK',
  INVITE = 'INVITE',
  INSTANT_POPUP = 'INSTANT_POPUP',
  POPUP = 'POPUP',
  EXIT_INTENT = 'EXIT_INTENT',
  MOBILE = 'MOBILE'
}

export interface Widget {
  [key: string]: WidgetInfo[];
}

export interface WidgetInfo {
  id: string;
  name: string;
  type: string;
  template: string;
  companyId: string;
  active: boolean;
  abtestInfo: AbtestInfo;
}

export interface AbtestInfo {
  id: string;
  type: string;
}

export interface WidgetRename {
  name: string;
}

export interface WidgetTypesResponse extends ApiResponse {
  data: WidgetType[];
}

export interface WidgetType {
  id: string;
  name: string;
  description: string;
  previewLink: string;
  code: string;
  static: boolean;
  containerized: boolean;
}

export interface WidgetTemplatesResponse extends ApiResponse {
  data: WidgetTemplate[];
}

export interface WidgetTemplate {
  id: string;
  name: string;
  preview: string;
  type: string;
  active: boolean;
}
