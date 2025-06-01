import request from '@/utils/request';
import { validate } from '@/utils/validators';
import type { 
  ApiResponse, 
  LoginRequest, 
  LoginResponse, 
  User,
  RegisterRequest 
} from '@/types';
import {
  LoginRequestSchema,
  LoginResponseSchema,
  RegisterRequestSchema,
  UserSchema,
  ChangePasswordSchema,
  ResetPasswordSchema,
  RefreshTokenResponseSchema,
  ApiResponseSchema,
} from '@/schemas';

/**
 * 认证相关 API 服务
 */
export const authService = {
  /**
   * 用户登录
   */
  login: async (data: LoginRequest): Promise<ApiResponse<LoginResponse>> => {
    // 验证请求数据
    const validationResult = validate(LoginRequestSchema, data);
    if (!validationResult.success) {
      throw new Error(validationResult.errors?.join(', ') || '请求数据格式错误');
    }

    const response = await request.post('/auth/login', validationResult.data);
    
    // 验证响应数据（仅在开发环境）
    if (process.env.NODE_ENV === 'development') {
      const responseValidation = validate(ApiResponseSchema(LoginResponseSchema), response);
      if (!responseValidation.success) {
        console.warn('API响应数据格式异常:', responseValidation.errors);
      }
    }

    return response as ApiResponse<LoginResponse>;
  },

  /**
   * 获取当前用户信息
   */
  getUserInfo: async (): Promise<ApiResponse<User>> => {
    const response = await request.get('/auth/userinfo');
    
    // 验证响应数据（仅在开发环境）
    if (process.env.NODE_ENV === 'development') {
      const responseValidation = validate(ApiResponseSchema(UserSchema), response);
      if (!responseValidation.success) {
        console.warn('用户信息响应数据格式异常:', responseValidation.errors);
      }
    }

    return response as ApiResponse<User>;
  },

  /**
   * 用户注册
   */
  register: async (data: RegisterRequest): Promise<ApiResponse<User>> => {
    // 验证请求数据
    const validationResult = validate(RegisterRequestSchema, data);
    if (!validationResult.success) {
      throw new Error(validationResult.errors?.join(', ') || '请求数据格式错误');
    }

    const response = await request.post('/auth/register', validationResult.data);
    
    // 验证响应数据（仅在开发环境）
    if (process.env.NODE_ENV === 'development') {
      const responseValidation = validate(ApiResponseSchema(UserSchema), response);
      if (!responseValidation.success) {
        console.warn('注册响应数据格式异常:', responseValidation.errors);
      }
    }

    return response as ApiResponse<User>;
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
  refreshToken: async (): Promise<ApiResponse<{ token: string }>> => {
    const response = await request.post('/auth/refresh');
    
    // 验证响应数据（仅在开发环境）
    if (process.env.NODE_ENV === 'development') {
      const responseValidation = validate(ApiResponseSchema(RefreshTokenResponseSchema), response);
      if (!responseValidation.success) {
        console.warn('刷新令牌响应数据格式异常:', responseValidation.errors);
      }
    }

    return response as ApiResponse<{ token: string }>;
  },

  /**
   * 修改密码
   */
  changePassword: async (data: {
    oldPassword: string;
    newPassword: string;
  }): Promise<ApiResponse<null>> => {
    // 验证请求数据
    const validationResult = validate(ChangePasswordSchema, data);
    if (!validationResult.success) {
      throw new Error(validationResult.errors?.join(', ') || '请求数据格式错误');
    }

    return request.post('/auth/change-password', validationResult.data);
  },

  /**
   * 重置密码
   */
  resetPassword: async (data: {
    email: string;
  }): Promise<ApiResponse<null>> => {
    // 验证请求数据
    const validationResult = validate(ResetPasswordSchema, data);
    if (!validationResult.success) {
      throw new Error(validationResult.errors?.join(', ') || '请求数据格式错误');
    }

    return request.post('/auth/reset-password', validationResult.data);
  },
}; 