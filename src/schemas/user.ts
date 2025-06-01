import { z } from 'zod';
import { IdSchema, TimestampSchema, StatusSchema, BaseQueryParamsSchema } from './common';

// 用户角色 Schema
export const UserRoleSchema = z.enum(['admin', 'manager', 'user', 'guest']);

// 用户 Schema（扩展了认证模块的用户）
export const UserManagementSchema = z.object({
  id: IdSchema,
  username: z.string().min(3, '用户名至少3个字符').max(20, '用户名不超过20个字符'),
  email: z.string().email('请输入有效的邮箱地址'),
  role: UserRoleSchema,
  status: StatusSchema,
  phone: z.string().regex(/^1[3-9]\d{9}$/, '请输入有效的手机号码').optional(),
  avatar: z.string().url('请输入有效的头像URL').optional(),
  realName: z.string().max(50, '真实姓名不超过50个字符').optional(),
  department: z.string().max(50, '部门不超过50个字符').optional(),
  position: z.string().max(50, '职位不超过50个字符').optional(),
  lastLoginAt: TimestampSchema.optional(),
  lastLoginIp: z.string().ip('IP地址格式不正确').optional(),
  loginCount: z.number().int('登录次数必须为整数').min(0, '登录次数不能为负数').optional(),
  isEmailVerified: z.boolean().optional(),
  isPhoneVerified: z.boolean().optional(),
  createdAt: TimestampSchema,
  updatedAt: TimestampSchema.optional(),
});

// 用户创建请求 Schema
export const CreateUserRequestSchema = z.object({
  username: z.string()
    .min(3, '用户名至少3个字符')
    .max(20, '用户名不超过20个字符')
    .regex(/^[a-zA-Z0-9_]+$/, '用户名只能包含字母、数字和下划线'),
  email: z.string().email('请输入有效的邮箱地址'),
  password: z.string()
    .min(8, '密码至少8个字符')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>])/, 
           '密码必须包含大小写字母、数字和特殊字符'),
  role: UserRoleSchema,
  status: StatusSchema.optional(),
  phone: z.string().regex(/^1[3-9]\d{9}$/, '请输入有效的手机号码').optional(),
  realName: z.string().max(50, '真实姓名不超过50个字符').optional(),
  department: z.string().max(50, '部门不超过50个字符').optional(),
  position: z.string().max(50, '职位不超过50个字符').optional(),
});

// 用户更新请求 Schema
export const UpdateUserRequestSchema = z.object({
  id: IdSchema,
  username: z.string()
    .min(3, '用户名至少3个字符')
    .max(20, '用户名不超过20个字符')
    .regex(/^[a-zA-Z0-9_]+$/, '用户名只能包含字母、数字和下划线')
    .optional(),
  email: z.string().email('请输入有效的邮箱地址').optional(),
  role: UserRoleSchema.optional(),
  status: StatusSchema.optional(),
  phone: z.string().regex(/^1[3-9]\d{9}$/, '请输入有效的手机号码').optional(),
  realName: z.string().max(50, '真实姓名不超过50个字符').optional(),
  department: z.string().max(50, '部门不超过50个字符').optional(),
  position: z.string().max(50, '职位不超过50个字符').optional(),
});

// 用户查询参数 Schema
export const UserQueryParamsSchema = BaseQueryParamsSchema.extend({
  role: UserRoleSchema.optional(),
  status: StatusSchema.optional(),
  department: z.string().optional(),
  dateFrom: z.string().datetime().optional().or(z.string().date().optional()),
  dateTo: z.string().datetime().optional().or(z.string().date().optional()),
});

// 用户统计 Schema
export const UserStatsSchema = z.object({
  total: z.number().min(0),
  active: z.number().min(0),
  inactive: z.number().min(0),
  newThisMonth: z.number().min(0),
  byRole: z.record(UserRoleSchema, z.number().min(0)),
  byDepartment: z.record(z.string(), z.number().min(0)).optional(),
});

// 用户权限 Schema
export const UserPermissionSchema = z.object({
  module: z.string().min(1, '模块名称不能为空'),
  actions: z.array(z.string().min(1, '操作不能为空')),
});

// 用户角色权限 Schema
export const UserRolePermissionSchema = z.object({
  role: UserRoleSchema,
  permissions: z.array(UserPermissionSchema),
});

// 用户批量操作 Schema
export const BatchUserOperationSchema = z.object({
  ids: z.array(IdSchema).min(1, '至少选择一个用户'),
  operation: z.enum(['activate', 'deactivate', 'delete', 'updateRole']),
  data: z.record(z.any()).optional(),
});

// 用户导入 Schema
export const UserImportSchema = z.object({
  file: z.any().refine((file) => file instanceof File, {
    message: '请选择文件',
  }),
  overwrite: z.boolean().default(false),
  template: z.enum(['basic', 'detailed']).default('basic'),
});

// 用户密码重置 Schema
export const UserPasswordResetSchema = z.object({
  userId: IdSchema,
  newPassword: z.string()
    .min(8, '新密码至少8个字符')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>])/, 
           '新密码必须包含大小写字母、数字和特殊字符'),
  notifyUser: z.boolean().default(true),
});

// 导出类型
export type UserManagement = z.infer<typeof UserManagementSchema>;
export type CreateUserRequest = z.infer<typeof CreateUserRequestSchema>;
export type UpdateUserRequest = z.infer<typeof UpdateUserRequestSchema>;
export type UserQueryParams = z.infer<typeof UserQueryParamsSchema>;
export type UserStats = z.infer<typeof UserStatsSchema>;
export type UserPermission = z.infer<typeof UserPermissionSchema>;
export type UserRolePermission = z.infer<typeof UserRolePermissionSchema>;
export type BatchUserOperation = z.infer<typeof BatchUserOperationSchema>;
export type UserImport = z.infer<typeof UserImportSchema>;
export type UserPasswordReset = z.infer<typeof UserPasswordResetSchema>;
export type UserRole = z.infer<typeof UserRoleSchema>; 