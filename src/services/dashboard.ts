import request from '@/utils/request';
import { buildQueryString } from '@/utils/helpers';
import type { 
  ApiResponse, 
  DashboardData,
  SystemStatus,
  Statistics,
  Order,
  ChartData,
  TrendData
} from '@/types';

/**
 * 仪表板相关 API 服务
 */
export const dashboardService = {
  /**
   * 获取仪表板数据
   */
  getDashboardData: (): Promise<ApiResponse<DashboardData>> => {
    return request.get('/dashboard');
  },

  /**
   * 获取最近订单
   */
  getRecentOrders: (limit: number = 5): Promise<ApiResponse<Order[]>> => {
    return request.get(`/dashboard/recent-orders?limit=${limit}`);
  },

  /**
   * 获取系统状态
   */
  getSystemStatus: (): Promise<ApiResponse<SystemStatus>> => {
    return request.get('/dashboard/system-status');
  },

  /**
   * 获取实时统计
   */
  getRealTimeStats: (): Promise<ApiResponse<Statistics[]>> => {
    return request.get('/dashboard/realtime-stats');
  },

  /**
   * 获取销售趋势
   */
  getSalesTrends: (params: {
    period: 'week' | 'month' | 'quarter' | 'year';
    startDate?: string;
    endDate?: string;
  }): Promise<ApiResponse<ChartData>> => {
    const queryString = buildQueryString(params);
    return request.get(`/dashboard/sales-trends?${queryString}`);
  },

  /**
   * 获取用户增长趋势
   */
  getUserGrowthTrends: (params: {
    period: 'week' | 'month' | 'quarter' | 'year';
  }): Promise<ApiResponse<ChartData>> => {
    const queryString = buildQueryString(params);
    return request.get(`/dashboard/user-growth?${queryString}`);
  },

  /**
   * 获取产品销售排行
   */
  getProductRanking: (params: {
    type: 'sales' | 'revenue' | 'views';
    limit?: number;
    period?: 'week' | 'month' | 'quarter';
  }): Promise<ApiResponse<Array<{
    productId: string;
    productName: string;
    value: number;
    change?: number;
    rank: number;
  }>>> => {
    const queryString = buildQueryString(params);
    return request.get(`/dashboard/product-ranking?${queryString}`);
  },

  /**
   * 获取地区分布
   */
  getRegionDistribution: (): Promise<ApiResponse<Array<{
    region: string;
    count: number;
    percentage: number;
  }>>> => {
    return request.get('/dashboard/region-distribution');
  },

  /**
   * 获取支付方式统计
   */
  getPaymentMethodStats: (): Promise<ApiResponse<Array<{
    method: string;
    count: number;
    amount: number;
    percentage: number;
  }>>> => {
    return request.get('/dashboard/payment-methods');
  },

  /**
   * 获取热门搜索关键词
   */
  getPopularKeywords: (limit: number = 10): Promise<ApiResponse<Array<{
    keyword: string;
    count: number;
    trend: 'up' | 'down' | 'stable';
  }>>> => {
    return request.get(`/dashboard/popular-keywords?limit=${limit}`);
  },

  /**
   * 获取客户满意度
   */
  getCustomerSatisfaction: (): Promise<ApiResponse<{
    averageRating: number;
    totalReviews: number;
    distribution: Array<{
      rating: number;
      count: number;
      percentage: number;
    }>;
  }>> => {
    return request.get('/dashboard/customer-satisfaction');
  },

  /**
   * 获取异常监控
   */
  getAnomalyDetection: (): Promise<ApiResponse<Array<{
    type: 'error' | 'warning' | 'info';
    message: string;
    timestamp: string;
    resolved: boolean;
  }>>> => {
    return request.get('/dashboard/anomalies');
  },

  /**
   * 获取库存预警
   */
  getInventoryAlerts: (): Promise<ApiResponse<Array<{
    productId: string;
    productName: string;
    currentStock: number;
    minStock: number;
    severity: 'low' | 'medium' | 'high';
  }>>> => {
    return request.get('/dashboard/inventory-alerts');
  },

  /**
   * 获取待办任务
   */
  getTodoTasks: (): Promise<ApiResponse<Array<{
    id: string;
    title: string;
    priority: 'low' | 'medium' | 'high';
    dueDate: string;
    completed: boolean;
  }>>> => {
    return request.get('/dashboard/todos');
  },

  /**
   * 标记任务完成
   */
  completeTask: (taskId: string): Promise<ApiResponse<null>> => {
    return request.patch(`/dashboard/todos/${taskId}/complete`);
  },
}; 