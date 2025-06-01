import request from '@/utils/request';
import type { 
  ApiResponse, 
  Product,
  CreateProductRequest,
  UpdateProductRequest,
  ProductQueryParams
} from '@/types';

/**
 * 产品管理相关 API 服务
 */
export const productService = {
  /**
   * 获取产品列表
   */
  getProducts: (params?: ProductQueryParams): Promise<ApiResponse<Product[]>> => {
    return request.get('/products', { headers: {}, ...params });
  },

  /**
   * 获取单个产品详情
   */
  getProductById: (id: string): Promise<ApiResponse<Product>> => {
    return request.get(`/products/${id}`);
  },

  /**
   * 创建产品
   */
  createProduct: (data: CreateProductRequest): Promise<ApiResponse<Product>> => {
    return request.post('/products', data);
  },

  /**
   * 更新产品信息
   */
  updateProduct: (id: string, data: Partial<UpdateProductRequest>): Promise<ApiResponse<Product>> => {
    return request.put(`/products/${id}`, data);
  },

  /**
   * 删除产品
   */
  deleteProduct: (id: string): Promise<ApiResponse<null>> => {
    return request.delete(`/products/${id}`);
  },

  /**
   * 批量删除产品
   */
  batchDeleteProducts: (ids: string[]): Promise<ApiResponse<null>> => {
    return request.post('/products/batch-delete', { ids });
  },

  /**
   * 更新产品状态
   */
  updateProductStatus: (id: string, status: 'available' | 'unavailable'): Promise<ApiResponse<Product>> => {
    return request.patch(`/products/${id}/status`, { status });
  },

  /**
   * 更新产品库存
   */
  updateProductStock: (id: string, stock: number): Promise<ApiResponse<Product>> => {
    return request.patch(`/products/${id}/stock`, { stock });
  },

  /**
   * 获取产品分类列表
   */
  getCategories: (): Promise<ApiResponse<string[]>> => {
    return request.get('/products/categories');
  },

  /**
   * 获取产品统计信息
   */
  getProductStats: (): Promise<ApiResponse<{
    total: number;
    available: number;
    unavailable: number;
    lowStock: number;
    totalValue: number;
  }>> => {
    return request.get('/products/stats');
  },

  /**
   * 批量更新产品价格
   */
  batchUpdatePrices: (updates: { id: string; price: number }[]): Promise<ApiResponse<null>> => {
    return request.post('/products/batch-update-prices', { updates });
  },

  /**
   * 导入产品（CSV/Excel）
   */
  importProducts: (file: File): Promise<ApiResponse<{ success: number; failed: number }>> => {
    const formData = new FormData();
    formData.append('file', file);
    return request.post('/products/import', formData);
  },

  /**
   * 导出产品数据
   */
  exportProducts: (params?: ProductQueryParams): Promise<ApiResponse<string>> => {
    return request.get('/products/export', { headers: {}, ...params });
  },
}; 