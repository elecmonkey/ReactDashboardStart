import { z } from 'zod';

// 通用 API 响应类型 Schema
export const ApiResponseSchema = <T extends z.ZodTypeAny>(dataSchema: T) =>
  z.object({
    success: z.boolean(),
    code: z.number(),
    message: z.string(),
    data: dataSchema,
    timestamp: z.string().optional(),
    responseTime: z.string().optional(),
  });

// 分页请求参数 Schema
export const PaginationParamsSchema = z.object({
  page: z.number().min(1).optional().default(1),
  limit: z.number().min(1).max(100).optional().default(10),
  offset: z.number().min(0).optional(),
});

// 分页响应数据 Schema
export const PaginatedResponseSchema = <T extends z.ZodTypeAny>(itemSchema: T) =>
  z.object({
    items: z.array(itemSchema),
    total: z.number().min(0),
    page: z.number().min(1),
    limit: z.number().min(1),
    totalPages: z.number().min(0),
  });

// 排序参数 Schema
export const SortParamsSchema = z.object({
  sortBy: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).optional(),
});

// 查询参数基类 Schema
export const BaseQueryParamsSchema = PaginationParamsSchema
  .merge(SortParamsSchema)
  .extend({
    keyword: z.string().optional(),
  });

// 操作状态枚举 Schema
export const OperationStatusSchema = z.enum(['idle', 'loading', 'success', 'error']);

// 通用错误类型 Schema
export const AppErrorSchema = z.object({
  code: z.string(),
  message: z.string(),
  details: z.any().optional(),
});

// 表单字段错误类型 Schema
export const FieldErrorSchema = z.object({
  field: z.string(),
  message: z.string(),
});

// 操作结果类型 Schema
export const OperationResultSchema = <T extends z.ZodTypeAny>(dataSchema: T) =>
  z.object({
    success: z.boolean(),
    data: dataSchema.optional(),
    error: AppErrorSchema.optional(),
  });

// 通用 ID Schema
export const IdSchema = z.string().min(1);

// 时间戳 Schema
export const TimestampSchema = z.string().datetime().or(z.string());

// 状态 Schema
export const StatusSchema = z.enum(['active', 'inactive']);

// 导出类型
export type ApiResponse<T> = z.infer<ReturnType<typeof ApiResponseSchema<z.ZodType<T>>>>;
export type PaginationParams = z.infer<typeof PaginationParamsSchema>;
export type PaginatedResponse<T> = z.infer<ReturnType<typeof PaginatedResponseSchema<z.ZodType<T>>>>;
export type SortParams = z.infer<typeof SortParamsSchema>;
export type BaseQueryParams = z.infer<typeof BaseQueryParamsSchema>;
export type OperationStatus = z.infer<typeof OperationStatusSchema>;
export type AppError = z.infer<typeof AppErrorSchema>;
export type FieldError = z.infer<typeof FieldErrorSchema>;
export type OperationResult<T> = z.infer<ReturnType<typeof OperationResultSchema<z.ZodType<T>>>>; 