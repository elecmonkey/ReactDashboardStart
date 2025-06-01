import request from '@/utils/request';
import type { 
  ApiResponse, 
  Order,
  OrderStats,
  CreateOrderRequest,
  UpdateOrderStatusRequest,
  OrderQueryParams
} from '@/types';

/**
 * 订单管理相关 API 服务
 */
export const orderService = {
  /**
   * 获取订单列表
   */
  getOrders: (params?: OrderQueryParams): Promise<ApiResponse<Order[]>> => {
    return request.get('/orders', { headers: {}, ...params });
  },

  /**
   * 获取单个订单详情
   */
  getOrderById: (id: string): Promise<ApiResponse<Order>> => {
    return request.get(`/orders/${id}`);
  },

  /**
   * 创建订单
   */
  createOrder: (data: CreateOrderRequest): Promise<ApiResponse<Order>> => {
    return request.post('/orders', data);
  },

  /**
   * 更新订单状态
   */
  updateOrderStatus: (id: string, status: Order['status']): Promise<ApiResponse<Order>> => {
    return request.patch(`/orders/${id}/status`, { status });
  },

  /**
   * 删除订单
   */
  deleteOrder: (id: string): Promise<ApiResponse<null>> => {
    return request.delete(`/orders/${id}`);
  },

  /**
   * 获取订单统计信息
   */
  getOrderStats: (): Promise<ApiResponse<OrderStats>> => {
    return request.get('/orders/stats');
  },

  /**
   * 批量更新订单状态
   */
  batchUpdateOrderStatus: (ids: string[], status: Order['status']): Promise<ApiResponse<null>> => {
    return request.post('/orders/batch-update-status', { ids, status });
  },

  /**
   * 获取订单时间趋势
   */
  getOrderTrends: (params: {
    startDate: string;
    endDate: string;
    groupBy: 'day' | 'week' | 'month';
  }): Promise<ApiResponse<Array<{
    date: string;
    count: number;
    amount: number;
  }>>> => {
    return request.get('/orders/trends', { headers: {}, ...params });
  },

  /**
   * 导出订单数据
   */
  exportOrders: (params?: OrderQueryParams): Promise<ApiResponse<string>> => {
    return request.get('/orders/export', { headers: {}, ...params });
  },

  /**
   * 获取订单物流信息
   */
  getOrderLogistics: (id: string): Promise<ApiResponse<Array<{
    time: string;
    status: string;
    location: string;
    description: string;
  }>>> => {
    return request.get(`/orders/${id}/logistics`);
  },

  /**
   * 更新订单备注
   */
  updateOrderNote: (id: string, note: string): Promise<ApiResponse<Order>> => {
    return request.patch(`/orders/${id}/note`, { note });
  },

  /**
   * 取消订单
   */
  cancelOrder: (id: string, reason: string): Promise<ApiResponse<Order>> => {
    return request.post(`/orders/${id}/cancel`, { reason });
  },

  /**
   * 确认收货
   */
  confirmOrder: (id: string): Promise<ApiResponse<Order>> => {
    return request.post(`/orders/${id}/confirm`);
  },

  /**
   * 申请退款
   */
  requestRefund: (id: string, reason: string, amount?: number): Promise<ApiResponse<null>> => {
    return request.post(`/orders/${id}/refund`, { reason, amount });
  },
}; 