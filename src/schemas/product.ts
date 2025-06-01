import { z } from 'zod';
import { IdSchema, TimestampSchema, BaseQueryParamsSchema } from './common';

// 产品状态 Schema
export const ProductStatusSchema = z.enum(['available', 'unavailable']);

// 产品 Schema
export const ProductSchema = z.object({
  id: IdSchema,
  name: z.string().min(1, '产品名称不能为空').max(100, '产品名称不超过100个字符'),
  category: z.string().min(1, '产品分类不能为空'),
  price: z.number().min(0, '价格不能为负数').max(999999.99, '价格超出范围'),
  stock: z.number().int('库存必须为整数').min(0, '库存不能为负数'),
  status: ProductStatusSchema,
  image: z.string().url('请输入有效的图片URL').optional().or(z.literal('')),
  description: z.string().max(1000, '描述不超过1000个字符').optional(),
  createdAt: TimestampSchema,
});

// 产品创建请求 Schema
export const CreateProductRequestSchema = z.object({
  name: z.string().min(1, '产品名称不能为空').max(100, '产品名称不超过100个字符'),
  category: z.string().min(1, '产品分类不能为空'),
  price: z.number().min(0, '价格不能为负数').max(999999.99, '价格超出范围'),
  stock: z.number().int('库存必须为整数').min(0, '库存不能为负数'),
  status: ProductStatusSchema,
  image: z.string().url('请输入有效的图片URL').optional().or(z.literal('')),
  description: z.string().max(1000, '描述不超过1000个字符').optional(),
});

// 产品更新请求 Schema
export const UpdateProductRequestSchema = CreateProductRequestSchema
  .partial()
  .extend({
    id: IdSchema,
  });

// 产品查询参数 Schema
export const ProductQueryParamsSchema = BaseQueryParamsSchema.extend({
  category: z.string().optional(),
  status: ProductStatusSchema.optional(),
  sortBy: z.enum(['price', 'createdAt', 'name']).optional(),
});

// 产品批量操作 Schema
export const BatchProductOperationSchema = z.object({
  ids: z.array(IdSchema).min(1, '至少选择一个产品'),
  operation: z.enum(['delete', 'updateStatus', 'updateCategory']),
  data: z.record(z.any()).optional(),
});

// 产品导入 Schema
export const ProductImportSchema = z.object({
  file: z.any().refine((file) => file instanceof File, {
    message: '请选择文件',
  }),
  overwrite: z.boolean().default(false),
});

// 导出类型
export type Product = z.infer<typeof ProductSchema>;
export type CreateProductRequest = z.infer<typeof CreateProductRequestSchema>;
export type UpdateProductRequest = z.infer<typeof UpdateProductRequestSchema>;
export type ProductQueryParams = z.infer<typeof ProductQueryParamsSchema>;
export type BatchProductOperation = z.infer<typeof BatchProductOperationSchema>;
export type ProductImport = z.infer<typeof ProductImportSchema>;
export type ProductStatus = z.infer<typeof ProductStatusSchema>;