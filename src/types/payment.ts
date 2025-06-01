// 支付相关类型
export interface Payment {
  id: string;
  orderId: string;
  amount: number;
  method: 'wechat' | 'alipay' | 'credit' | 'bank';
  status: 'pending' | 'success' | 'failed' | 'refunded';
  transactionId: string;
  createdAt: string;
  completedAt?: string;
  refundReason?: string;
}

// 支付统计类型
export interface PaymentStats {
  total: number;
  success: number;
  pending: number;
  failed: number;
  totalAmount: number;
}

// 支付创建请求类型
export interface CreatePaymentRequest {
  orderId: string;
  amount: number;
  method: Payment['method'];
}

// 支付查询参数类型
export interface PaymentQueryParams {
  orderId?: string;
  method?: Payment['method'];
  status?: Payment['status'];
  dateFrom?: string;
  dateTo?: string;
  page?: number;
  limit?: number;
} 