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

export interface CompaniesResponse extends ApiResponse {
  data: CompanyShort[];
}

export interface CompanyRequest {
  name: string;
}

export interface CompanyResponse extends ApiResponse {
  data: CompanyShort;
}

export interface DeleteCompanyRequest {
  recipientCompanyId: string;
  mode: 'MOVE_WIDGETS' | 'DELETE_WIDGETS';
}

export interface CompanyShort {
  id: string;
  name: string;
}

export interface Container {
  id: string;
  name: string;
  description: string;
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

export interface WidgetInfoShort {
  id: string;
  name: string;
  companyId: string;
}

export interface WidgetInfo extends WidgetInfoShort {
  type: string;
  template: string;
  active: boolean;
  abtestInfo: AbtestInfo;
  widgetConversion?: WidgetConversion;
}

export interface AbtestInfo {
  id: string;
  type: string;
  state?: string;
}

export interface WidgetRename {
  name: string;
}

export interface WidgetCloneRequest {
  siteId: string;
  companyId: string;
}

export interface ContainerizedWidgetCloneRequest extends WidgetCloneRequest {
  containerId: string;
}

export interface WidgetCloneResponse {
  data: WidgetCloned;
}

export interface WidgetCloned {
  siteId: string;
  widgetId: string;
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

export interface WidgetConversionResponse extends ApiResponse {
  data: WidgetConversion;
}

export interface WidgetConversion {
  shows: number;
  target: number;
}

export interface WidgetSwapRequest {
  widgetId1: string;
  widgetId2: string;
}

export interface WidgetChangeCompanyRequest {
  companyId: string;
}

export interface ContainersResponse extends ApiResponse {
  data: ContainerShort[];
}

export interface ContainerResponse extends ApiResponse {
  data: ContainerShort;
}

export interface ContainerShort {
  id: string;
  description: string;
  name: string;
}

export interface ContainerRequest {
  name: string;
  description?: string;
}
