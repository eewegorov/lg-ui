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

export interface WidgetResponse extends ApiResponse {
  data: FullWidget;
}

export interface FullWidget {
  id: string;
  abtestInfo: AbtestInfo;
  containerId: string;
  name: string;
  type: string;
  active: boolean;
  sendCrm: boolean;
  template: string;
  restrictions: Record<string, any>;
  autoresponder: Record<string, string>;
  audiencesEnabled: boolean;
  audience: Audience;
  rules: Record<string, any>;
  guiprops: Record<string, any>;
  coupons: string[];
  integrations: string[];
  useCustomIntegrationsList: boolean;
  customFields: CustomField[];
  jsInfo: WidgetJsInfo;
  autoinvite?: Record<string, any>;
}

export interface Audience {
  groups: AudienceGroup[];
}

export interface AudienceGroup {
  id?: number;
  items: AudienceGroupItem[];
}

export interface AudienceGroupItem {
  type: string;
  subitems: object[];
  id?: number;
}

export interface CustomField {
  id: string;
  name: string;
  type: string;
}

export interface WidgetJsInfo {
  onShowScript: WidgetJsOnScript;
  onTargetScript: WidgetJsOnScript;
  enablePlaceholding: boolean;
}

export interface WidgetJsOnScript {
  enable: boolean;
  script: string;
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

export interface ContainerInfoResponse {
  data: Container;
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
  containerId?: string;
  guiprops: Record<string, any>;
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

export interface NewContainerizedWidgetInfo {
  step: number;
  containerizedType: string;
  siteId: string;
  companyMode: number;
  company: string;
  companyId: string;
  types: NewWidgetType[];
  createMode?: string;
}

export interface NewWidgetInfo {
  siteId: string;
  templateId: string;
  mockupId: string;
  typeId: string;
  widgetName: string;
  name: string;
  companyMode: number;
  company: string;
  companyId: string;
  containerized?: boolean;
}

export interface NewWidgetType {
  type: string;
  title: string;
}

export interface WidgetCreateRequest {
  name: string;
  templateId: string;
  companyId: string;
  mockupId: string;
  containerId?: string;
}

export interface WidgetCreateResponse extends ApiResponse {
  data: WidgetCreated;
}

export interface WidgetCreated {
  value: string;
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

export interface MockupGroupsResponse extends ApiResponse {
  data: MockupGroup[];
}

export interface MockupGroup {
  id: string;
  name: string;
  categories: MockupCategory[];
}

export interface MockupCategory {
  id: string;
  name: string;
}

export interface MockupsResponse extends ApiResponse {
  data: Mockup[];
}

export interface MockupResponse extends ApiResponse {
  data: MockupShort;
}

export interface MockupShort {
  name: string;
  description: string;
  preview: string;
  tariff: string;
  categories: string[] | string;
}

export interface Mockup extends MockupShort {
  id: string;
  template: string;
  type: string;
}


