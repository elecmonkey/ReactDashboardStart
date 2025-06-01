import request from '@/utils/request';
import type { 
  ApiResponse, 
  Payment,
  PaymentStats,
  CreatePaymentRequest,
  PaymentQueryParams
} from '@/types';

/**
 * 支付管理相关 API 服务
 */
export const paymentService = {
  /**
   * 获取支付列表
   */
  getPayments: (params?: PaymentQueryParams): Promise<ApiResponse<Payment[]>> => {
    return request.get('/payments', { headers: {}, ...params });
  },

  /**
   * 获取单个支付详情
   */
  getPaymentById: (id: string): Promise<ApiResponse<Payment>> => {
    return request.get(`/payments/${id}`);
  },

  /**
   * 创建支付
   */
  createPayment: (data: CreatePaymentRequest): Promise<ApiResponse<Payment>> => {
    return request.post('/payments', data);
  },

  /**
   * 重试支付
   */
  retryPayment: (id: string): Promise<ApiResponse<Payment>> => {
    return request.post(`/payments/${id}/retry`);
  },

  /**
   * 获取支付统计信息
   */
  getPaymentStats: (): Promise<ApiResponse<PaymentStats>> => {
    return request.get('/payments/stats');
  },

  /**
   * 取消支付
   */
  cancelPayment: (id: string, reason: string): Promise<ApiResponse<Payment>> => {
    return request.post(`/payments/${id}/cancel`, { reason });
  },

  /**
   * 申请退款
   */
  refundPayment: (id: string, amount: number, reason: string): Promise<ApiResponse<Payment>> => {
    return request.post(`/payments/${id}/refund`, { amount, reason });
  },

  /**
   * 获取支付方式列表
   */
  getPaymentMethods: (): Promise<ApiResponse<Array<{
    code: string;
    name: string;
    enabled: boolean;
    icon?: string;
  }>>> => {
    return request.get('/payments/methods');
  },

  /**
   * 更新支付方式状态
   */
  updatePaymentMethod: (code: string, enabled: boolean): Promise<ApiResponse<null>> => {
    return request.patch(`/payments/methods/${code}`, { enabled });
  },

  /**
   * 获取支付趋势
   */
  getPaymentTrends: (params: {
    startDate: string;
    endDate: string;
    groupBy: 'day' | 'week' | 'month';
  }): Promise<ApiResponse<Array<{
    date: string;
    count: number;
    amount: number;
    successRate: number;
  }>>> => {
    return request.get('/payments/trends', { headers: {}, ...params });
  },

  /**
   * 批量处理支付
   */
  batchProcessPayments: (ids: string[], action: 'confirm' | 'cancel' | 'refund'): Promise<ApiResponse<{
    success: number;
    failed: number;
  }>> => {
    return request.post('/payments/batch-process', { ids, action });
  },

  /**
   * 导出支付数据
   */
  exportPayments: (params?: PaymentQueryParams): Promise<ApiResponse<string>> => {
    return request.get('/payments/export', { headers: {}, ...params });
  },

  /**
   * 获取支付渠道费率
   */
  getPaymentRates: (): Promise<ApiResponse<Array<{
    method: string;
    rate: number;
    fixedFee: number;
  }>>> => {
    return request.get('/payments/rates');
  },

  /**
   * 同步支付状态（第三方）
   */
  syncPaymentStatus: (id: string): Promise<ApiResponse<Payment>> => {
    return request.post(`/payments/${id}/sync`);
  },
}; 