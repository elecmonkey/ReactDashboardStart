// 通用 API 响应类型
export interface ApiResponse<T = any> {
  success: boolean;
  code: number;
  message: string;
  data: T;
  timestamp?: string;
  responseTime?: string;
}

// 分页请求参数
export interface PaginationParams {
  page?: number;
  limit?: number;
  offset?: number;
}

// 分页响应数据
export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// 排序参数
export interface SortParams {
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

// 查询参数基类
export interface BaseQueryParams extends PaginationParams, SortParams {
  keyword?: string;
}

// 操作状态枚举
export enum OperationStatus {
  IDLE = 'idle',
  LOADING = 'loading',
  SUCCESS = 'success',
  ERROR = 'error',
}

// 通用错误类型
export interface AppError {
  code: string;
  message: string;
  details?: any;
}

// 表单字段错误类型
export interface FieldError {
  field: string;
  message: string;
}

// 操作结果类型
export interface OperationResult<T = any> {
  success: boolean;
  data?: T;
  error?: AppError;
} 