// 设置类型
export interface Settings {
  siteName: string;
  siteDescription: string;
  adminEmail: string;
  language: string;
  theme?: string;
  maintenanceMode: boolean;
  autoSave: boolean;
  emailNotification: boolean;
  sessionTimeout?: number;
  passwordStrength?: 'low' | 'medium' | 'high';
  loginFailLimit?: number;
}

// 订单设置类型
export interface OrderSettings {
  autoConfirmDays: number;
  autoCompleteAfterShip: boolean;
  allowCancel: boolean;
  cancelTimeLimit: number;
  defaultCurrency: string;
  requirePhone: boolean;
  requireAddress: boolean;
  enableCoupon: boolean;
  maxOrderItems: number;
  orderPrefix?: string;
  invoiceValidation?: boolean;
}

// 系统设置更新请求类型
export interface UpdateSettingsRequest extends Partial<Settings> {}

// 订单设置更新请求类型
export interface UpdateOrderSettingsRequest extends Partial<OrderSettings> {} 