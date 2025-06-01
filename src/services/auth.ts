import request from '@/utils/request';
import type { 
  ApiResponse, 
  LoginRequest, 
  LoginResponse, 
  User,
  RegisterRequest 
} from '@/types';

/**
 * 认证相关 API 服务
 */
export const authService = {
  /**
   * 用户登录
   */
  login: (data: LoginRequest): Promise<ApiResponse<LoginResponse>> => {
    return request.post('/auth/login', data);
  },

  /**
   * 获取当前用户信息
   */
  getUserInfo: (): Promise<ApiResponse<User>> => {
    return request.get('/auth/userinfo');
  },

  /**
   * 用户注册
   */
  register: (data: RegisterRequest): Promise<ApiResponse<User>> => {
    return request.post('/auth/register', data);
  },

  /**
   * 用户登出
   */
  logout: (): Promise<ApiResponse<null>> => {
    return request.post('/auth/logout');
  },

  /**
   * 刷新令牌
   */
  refreshToken: (): Promise<ApiResponse<{ token: string }>> => {
    return request.post('/auth/refresh');
  },

  /**
   * 修改密码
   */
  changePassword: (data: {
    oldPassword: string;
    newPassword: string;
  }): Promise<ApiResponse<null>> => {
    return request.post('/auth/change-password', data);
  },

  /**
   * 重置密码
   */
  resetPassword: (data: {
    email: string;
  }): Promise<ApiResponse<null>> => {
    return request.post('/auth/reset-password', data);
  },
}; 