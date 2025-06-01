import request from '@/utils/request';
import type { 
  ApiResponse, 
  User,
  PaginatedResponse,
  BaseQueryParams
} from '@/types';

/**
 * 用户管理相关 API 服务
 */
export const userService = {
  /**
   * 获取用户列表
   */
  getUsers: (params?: BaseQueryParams): Promise<ApiResponse<User[]>> => {
    return request.get('/users', { headers: {}, ...params });
  },

  /**
   * 获取单个用户详情
   */
  getUserById: (id: string): Promise<ApiResponse<User>> => {
    return request.get(`/users/${id}`);
  },

  /**
   * 创建用户
   */
  createUser: (data: Omit<User, 'id' | 'createdAt'>): Promise<ApiResponse<User>> => {
    return request.post('/users', data);
  },

  /**
   * 更新用户信息
   */
  updateUser: (id: string, data: Partial<User>): Promise<ApiResponse<User>> => {
    return request.put(`/users/${id}`, data);
  },

  /**
   * 删除用户
   */
  deleteUser: (id: string): Promise<ApiResponse<null>> => {
    return request.delete(`/users/${id}`);
  },

  /**
   * 批量删除用户
   */
  batchDeleteUsers: (ids: string[]): Promise<ApiResponse<null>> => {
    return request.post('/users/batch-delete', { ids });
  },

  /**
   * 更新用户状态
   */
  updateUserStatus: (id: string, status: 'active' | 'inactive'): Promise<ApiResponse<User>> => {
    return request.patch(`/users/${id}/status`, { status });
  },

  /**
   * 重置用户密码
   */
  resetUserPassword: (id: string): Promise<ApiResponse<{ password: string }>> => {
    return request.post(`/users/${id}/reset-password`);
  },

  /**
   * 获取用户统计信息
   */
  getUserStats: (): Promise<ApiResponse<{
    total: number;
    active: number;
    inactive: number;
    newThisMonth: number;
  }>> => {
    return request.get('/users/stats');
  },
}; 