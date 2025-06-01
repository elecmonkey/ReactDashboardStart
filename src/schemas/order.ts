import { z } from 'zod';
import { IdSchema, TimestampSchema, BaseQueryParamsSchema } from './common';

// 订单状态 Schema
export const OrderStatusSchema = z.enum(['pending', 'paid', 'shipped', 'delivered', 'cancelled']);

// 订单 Schema
export const OrderSchema = z.object({
  id: IdSchema,
  customerName: z.string().min(1, '客户姓名不能为空').max(50, '客户姓名不超过50个字符'),
  customerPhone: z.string()
    .regex(/^1[3-9]\d{9}$/, '请输入有效的手机号码'),
  products: z.string().min(1, '产品信息不能为空'),
  totalAmount: z.number().min(0, '订单金额不能为负数').max(999999.99, '订单金额超出范围'),
  status: OrderStatusSchema,
  paymentMethod: z.string().min(1, '支付方式不能为空'),
  createdAt: TimestampSchema,
  shippingAddress: z.string().min(1, '收货地址不能为空').max(200, '收货地址不超过200个字符'),
});

// 订单统计 Schema
export const OrderStatsSchema = z.object({
  total: z.number().min(0),
  pending: z.number().min(0),
  paid: z.number().min(0),
  shipped: z.number().min(0),
  totalAmount: z.number().min(0),
});

// 订单创建请求 Schema
export const CreateOrderRequestSchema = z.object({
  customerName: z.string().min(1, '客户姓名不能为空').max(50, '客户姓名不超过50个字符'),
  customerPhone: z.string()
    .regex(/^1[3-9]\d{9}$/, '请输入有效的手机号码'),
  products: z.string().min(1, '产品信息不能为空'),
  totalAmount: z.number().min(0.01, '订单金额必须大于0').max(999999.99, '订单金额超出范围'),
  paymentMethod: z.string().min(1, '支付方式不能为空'),
  shippingAddress: z.string().min(1, '收货地址不能为空').max(200, '收货地址不超过200个字符'),
});

// 订单状态更新请求 Schema
export const UpdateOrderStatusRequestSchema = z.object({
  status: OrderStatusSchema,
});

// 订单查询参数 Schema
export const OrderQueryParamsSchema = BaseQueryParamsSchema.extend({
  status: OrderStatusSchema.optional(),
  customerName: z.string().optional(),
  dateFrom: z.string().datetime().optional().or(z.string().date().optional()),
  dateTo: z.string().datetime().optional().or(z.string().date().optional()),
});

// 导出类型
export type Order = z.infer<typeof OrderSchema>;
export type OrderStats = z.infer<typeof OrderStatsSchema>;
export type CreateOrderRequest = z.infer<typeof CreateOrderRequestSchema>;
export type UpdateOrderStatusRequest = z.infer<typeof UpdateOrderStatusRequestSchema>;
export type OrderQueryParams = z.infer<typeof OrderQueryParamsSchema>;
export type OrderStatus = z.infer<typeof OrderStatusSchema>; 