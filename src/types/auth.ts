// 用户相关类型
export interface User {
  id: string;
  username: string;
  email: string;
  role: string;
  status?: 'active' | 'inactive';
  createdAt?: string;
}

// 登录响应类型
export interface LoginResponse {
  user: User;
  token: string;
}

// 登录请求类型
export interface LoginRequest {
  username: string;
  password: string;
}

// 注册请求类型
export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  role?: string;
} 