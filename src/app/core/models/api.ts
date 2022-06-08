export interface ApiResponse {
  code: number;
  success: boolean;
  errors: {};
  message: string;
}

export interface ApiLimitResponse extends ApiResponse {
  meta: Meta;
}

export interface Meta {
  limit: number;
  offset: number;
  count: number;
}
