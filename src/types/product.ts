// 产品相关类型
export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  status: 'available' | 'unavailable';
  image?: string;
  description?: string;
  createdAt: string;
}

// 产品创建请求类型
export interface CreateProductRequest {
  name: string;
  category: string;
  price: number;
  stock: number;
  status: 'available' | 'unavailable';
  image?: string;
  description?: string;
}

// 产品更新请求类型
export interface UpdateProductRequest extends Partial<CreateProductRequest> {
  id: string;
}

// 产品查询参数类型
export interface ProductQueryParams {
  category?: string;
  status?: 'available' | 'unavailable';
  keyword?: string;
  page?: number;
  limit?: number;
  sortBy?: 'price' | 'createdAt' | 'name';
  sortOrder?: 'asc' | 'desc';
} 