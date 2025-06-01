import { z } from 'zod';
import { IdSchema, TimestampSchema, StatusSchema } from './common';

// 用户 Schema
export const UserSchema = z.object({
  id: IdSchema,
  username: z.string().min(3, '用户名至少3个字符').max(20, '用户名不超过20个字符'),
  email: z.string().email('请输入有效的邮箱地址'),
  role: z.string().min(1, '角色不能为空'),
  status: StatusSchema.optional(),
  createdAt: TimestampSchema.optional(),
});

// 登录请求 Schema
export const LoginRequestSchema = z.object({
  username: z.string().min(1, '用户名不能为空'),
  password: z.string().min(6, '密码至少6个字符'),
});

// 登录响应 Schema
export const LoginResponseSchema = z.object({
  user: UserSchema,
  token: z.string().min(1, 'Token不能为空'),
});

// 注册请求 Schema
export const RegisterRequestSchema = z.object({
  username: z.string()
    .min(3, '用户名至少3个字符')
    .max(20, '用户名不超过20个字符')
    .regex(/^[a-zA-Z0-9_]+$/, '用户名只能包含字母、数字和下划线'),
  email: z.string().email('请输入有效的邮箱地址'),
  password: z.string()
    .min(8, '密码至少8个字符')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>])/, 
           '密码必须包含大小写字母、数字和特殊字符'),
  role: z.string().optional(),
});

// 修改密码 Schema
export const ChangePasswordSchema = z.object({
  oldPassword: z.string().min(1, '旧密码不能为空'),
  newPassword: z.string()
    .min(8, '新密码至少8个字符')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>])/, 
           '新密码必须包含大小写字母、数字和特殊字符'),
});

// 重置密码 Schema
export const ResetPasswordSchema = z.object({
  email: z.string().email('请输入有效的邮箱地址'),
});

// 刷新令牌响应 Schema
export const RefreshTokenResponseSchema = z.object({
  token: z.string().min(1, 'Token不能为空'),
});

// 导出类型
export type User = z.infer<typeof UserSchema>;
export type LoginRequest = z.infer<typeof LoginRequestSchema>;
export type LoginResponse = z.infer<typeof LoginResponseSchema>;
export type RegisterRequest = z.infer<typeof RegisterRequestSchema>;
export type ChangePasswordRequest = z.infer<typeof ChangePasswordSchema>;
export type ResetPasswordRequest = z.infer<typeof ResetPasswordSchema>;
export type RefreshTokenResponse = z.infer<typeof RefreshTokenResponseSchema>; 