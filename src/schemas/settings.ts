import { z } from 'zod';

// 密码强度 Schema
export const PasswordStrengthSchema = z.enum(['low', 'medium', 'high']);

// 系统设置 Schema
export const SettingsSchema = z.object({
  siteName: z.string().min(1, '站点名称不能为空').max(50, '站点名称不超过50个字符'),
  siteDescription: z.string().max(200, '站点描述不超过200个字符'),
  adminEmail: z.string().email('请输入有效的邮箱地址'),
  language: z.string().min(1, '语言设置不能为空'),
  theme: z.string().optional(),
  maintenanceMode: z.boolean(),
  autoSave: z.boolean(),
  emailNotification: z.boolean(),
  sessionTimeout: z.number().int('会话超时必须为整数').min(1, '会话超时至少1分钟').max(1440, '会话超时不超过24小时').optional(),
  passwordStrength: PasswordStrengthSchema.optional(),
  loginFailLimit: z.number().int('登录失败限制必须为整数').min(1, '登录失败限制至少1次').max(10, '登录失败限制不超过10次').optional(),
});

// 订单设置 Schema
export const OrderSettingsSchema = z.object({
  autoConfirmDays: z.number().int('自动确认天数必须为整数').min(1, '自动确认天数至少1天').max(30, '自动确认天数不超过30天'),
  autoCompleteAfterShip: z.boolean(),
  allowCancel: z.boolean(),
  cancelTimeLimit: z.number().int('取消时限必须为整数').min(1, '取消时限至少1小时').max(72, '取消时限不超过72小时'),
  defaultCurrency: z.string().min(1, '默认货币不能为空'),
  requirePhone: z.boolean(),
  requireAddress: z.boolean(),
  enableCoupon: z.boolean(),
  maxOrderItems: z.number().int('最大订单项目必须为整数').min(1, '最大订单项目至少1个').max(100, '最大订单项目不超过100个'),
  orderPrefix: z.string().optional(),
  invoiceValidation: z.boolean().optional(),
});

// 系统设置更新请求 Schema
export const UpdateSettingsRequestSchema = SettingsSchema.partial();

// 订单设置更新请求 Schema
export const UpdateOrderSettingsRequestSchema = OrderSettingsSchema.partial();

// 备份设置 Schema
export const BackupSettingsSchema = z.object({
  enabled: z.boolean(),
  frequency: z.enum(['daily', 'weekly', 'monthly']),
  retention: z.number().int('保留天数必须为整数').min(1, '保留天数至少1天').max(365, '保留天数不超过365天'),
  location: z.string().min(1, '备份位置不能为空'),
});

// 邮件设置 Schema
export const EmailSettingsSchema = z.object({
  smtp: z.object({
    host: z.string().min(1, 'SMTP主机不能为空'),
    port: z.number().int('端口必须为整数').min(1, '端口至少为1').max(65535, '端口不超过65535'),
    secure: z.boolean(),
    username: z.string().min(1, '用户名不能为空'),
    password: z.string().min(1, '密码不能为空'),
  }),
  from: z.string().email('发件人邮箱格式不正确'),
  templates: z.record(z.string()).optional(),
});

// 安全设置 Schema
export const SecuritySettingsSchema = z.object({
  enableTwoFactor: z.boolean(),
  allowMultipleLogin: z.boolean(),
  ipWhitelist: z.array(z.string().ip('IP地址格式不正确')).optional(),
  sessionTimeout: z.number().int('会话超时必须为整数').min(1, '会话超时至少1分钟').max(1440, '会话超时不超过24小时'),
  passwordPolicy: z.object({
    minLength: z.number().int().min(6).max(20),
    requireUppercase: z.boolean(),
    requireLowercase: z.boolean(),
    requireNumbers: z.boolean(),
    requireSpecialChars: z.boolean(),
  }),
});

// 导出类型
export type Settings = z.infer<typeof SettingsSchema>;
export type OrderSettings = z.infer<typeof OrderSettingsSchema>;
export type UpdateSettingsRequest = z.infer<typeof UpdateSettingsRequestSchema>;
export type UpdateOrderSettingsRequest = z.infer<typeof UpdateOrderSettingsRequestSchema>;
export type BackupSettings = z.infer<typeof BackupSettingsSchema>;
export type EmailSettings = z.infer<typeof EmailSettingsSchema>;
export type SecuritySettings = z.infer<typeof SecuritySettingsSchema>;
export type PasswordStrength = z.infer<typeof PasswordStrengthSchema>; 