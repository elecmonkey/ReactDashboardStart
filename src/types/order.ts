// 订单相关类型
export interface Order {
  id: string;
  customerName: string;
  customerPhone: string;
  products: string;
  totalAmount: number;
  status: 'pending' | 'paid' | 'shipped' | 'delivered' | 'cancelled';
  paymentMethod: string;
  createdAt: string;
  shippingAddress: string;
}

// 订单统计类型
export interface OrderStats {
  total: number;
  pending: number;
  paid: number;
  shipped: number;
  totalAmount: number;
}

// 订单创建请求类型
export interface CreateOrderRequest {
  customerName: string;
  customerPhone: string;
  products: string;
  totalAmount: number;
  paymentMethod: string;
  shippingAddress: string;
}

// 订单状态更新请求类型
export interface UpdateOrderStatusRequest {
  status: Order['status'];
}

// 订单查询参数类型
export interface OrderQueryParams {
  status?: Order['status'];
  customerName?: string;
  dateFrom?: string;
  dateTo?: string;
  page?: number;
  limit?: number;
} 