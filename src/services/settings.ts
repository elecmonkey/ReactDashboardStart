import request from '@/utils/request';
import type { 
  ApiResponse, 
  Settings,
  OrderSettings,
  UpdateSettingsRequest,
  UpdateOrderSettingsRequest
} from '@/types';

/**
 * 设置管理相关 API 服务
 */
export const settingsService = {
  /**
   * 获取系统设置
   */
  getSettings: (): Promise<ApiResponse<Settings>> => {
    return request.get('/settings');
  },

  /**
   * 更新系统设置
   */
  updateSettings: (data: UpdateSettingsRequest): Promise<ApiResponse<Settings>> => {
    return request.put('/settings', data);
  },

  /**
   * 获取订单设置
   */
  getOrderSettings: (): Promise<ApiResponse<OrderSettings>> => {
    return request.get('/settings/order');
  },

  /**
   * 更新订单设置
   */
  updateOrderSettings: (data: UpdateOrderSettingsRequest): Promise<ApiResponse<OrderSettings>> => {
    return request.put('/settings/order', data);
  },

  /**
   * 重置系统设置
   */
  resetSettings: (): Promise<ApiResponse<Settings>> => {
    return request.post('/settings/reset');
  },

  /**
   * 获取邮件设置
   */
  getEmailSettings: (): Promise<ApiResponse<{
    smtpHost: string;
    smtpPort: number;
    smtpUser: string;
    smtpPassword?: string;
    fromEmail: string;
    fromName: string;
    enableSsl: boolean;
  }>> => {
    return request.get('/settings/email');
  },

  /**
   * 更新邮件设置
   */
  updateEmailSettings: (data: {
    smtpHost: string;
    smtpPort: number;
    smtpUser: string;
    smtpPassword?: string;
    fromEmail: string;
    fromName: string;
    enableSsl: boolean;
  }): Promise<ApiResponse<null>> => {
    return request.put('/settings/email', data);
  },

  /**
   * 测试邮件发送
   */
  testEmail: (email: string): Promise<ApiResponse<null>> => {
    return request.post('/settings/email/test', { email });
  },

  /**
   * 获取短信设置
   */
  getSmsSettings: (): Promise<ApiResponse<{
    provider: string;
    apiKey: string;
    apiSecret?: string;
    signName: string;
    enabled: boolean;
  }>> => {
    return request.get('/settings/sms');
  },

  /**
   * 更新短信设置
   */
  updateSmsSettings: (data: {
    provider: string;
    apiKey: string;
    apiSecret?: string;
    signName: string;
    enabled: boolean;
  }): Promise<ApiResponse<null>> => {
    return request.put('/settings/sms', data);
  },

  /**
   * 获取存储设置
   */
  getStorageSettings: (): Promise<ApiResponse<{
    provider: 'local' | 'oss' | 's3';
    localPath?: string;
    ossConfig?: any;
    s3Config?: any;
  }>> => {
    return request.get('/settings/storage');
  },

  /**
   * 更新存储设置
   */
  updateStorageSettings: (data: any): Promise<ApiResponse<null>> => {
    return request.put('/settings/storage', data);
  },

  /**
   * 备份系统设置
   */
  backupSettings: (): Promise<ApiResponse<{ backupId: string; downloadUrl: string }>> => {
    return request.post('/settings/backup');
  },

  /**
   * 恢复系统设置
   */
  restoreSettings: (backupId: string): Promise<ApiResponse<null>> => {
    return request.post('/settings/restore', { backupId });
  },

  /**
   * 清除缓存
   */
  clearCache: (): Promise<ApiResponse<null>> => {
    return request.post('/settings/clear-cache');
  },
}; 