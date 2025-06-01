import { z } from 'zod';
import { IdSchema, TimestampSchema, BaseQueryParamsSchema } from './common';

// 支付方式 Schema
export const PaymentMethodSchema = z.enum(['wechat', 'alipay', 'credit', 'bank']);

// 支付状态 Schema
export const PaymentStatusSchema = z.enum(['pending', 'success', 'failed', 'refunded']);

// 支付 Schema
export const PaymentSchema = z.object({
  id: IdSchema,
  orderId: IdSchema,
  amount: z.number().min(0.01, '支付金额必须大于0').max(999999.99, '支付金额超出范围'),
  method: PaymentMethodSchema,
  status: PaymentStatusSchema,
  transactionId: z.string().min(1, '交易ID不能为空'),
  createdAt: TimestampSchema,
  completedAt: TimestampSchema.optional(),
  refundReason: z.string().max(200, '退款原因不超过200个字符').optional(),
});

// 支付统计 Schema
export const PaymentStatsSchema = z.object({
  total: z.number().min(0),
  success: z.number().min(0),
  pending: z.number().min(0),
  failed: z.number().min(0),
  totalAmount: z.number().min(0),
});

// 支付创建请求 Schema
export const CreatePaymentRequestSchema = z.object({
  orderId: IdSchema,
  amount: z.number().min(0.01, '支付金额必须大于0').max(999999.99, '支付金额超出范围'),
  method: PaymentMethodSchema,
});

// 支付查询参数 Schema
export const PaymentQueryParamsSchema = BaseQueryParamsSchema.extend({
  orderId: IdSchema.optional(),
  method: PaymentMethodSchema.optional(),
  status: PaymentStatusSchema.optional(),
  dateFrom: z.string().datetime().optional().or(z.string().date().optional()),
  dateTo: z.string().datetime().optional().or(z.string().date().optional()),
});

// 支付退款 Schema
export const PaymentRefundSchema = z.object({
  paymentId: IdSchema,
  amount: z.number().min(0.01, '退款金额必须大于0'),
  reason: z.string().min(1, '退款原因不能为空').max(200, '退款原因不超过200个字符'),
});

// 导出类型
export type Payment = z.infer<typeof PaymentSchema>;
export type PaymentStats = z.infer<typeof PaymentStatsSchema>;
export type CreatePaymentRequest = z.infer<typeof CreatePaymentRequestSchema>;
export type PaymentQueryParams = z.infer<typeof PaymentQueryParamsSchema>;
export type PaymentRefund = z.infer<typeof PaymentRefundSchema>;
export type PaymentMethod = z.infer<typeof PaymentMethodSchema>;
export type PaymentStatus = z.infer<typeof PaymentStatusSchema>; 