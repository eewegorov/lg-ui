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

export interface Container {
  id: string;
  description: string;
  name: string;
  widgets: WidgetInfo[];
}

export interface SmartPoints {
  enabled: true;
  list: SmartPoint[];
}

export interface SmartPoint {
  enabled: boolean;
  autoinvite: boolean;
  pos: string;
  type: string;
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
