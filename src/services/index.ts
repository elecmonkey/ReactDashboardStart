// 认证服务
export { authService } from './auth';

// 用户管理服务
export { userService } from './user';

// 产品管理服务
export { productService } from './product';

// 订单管理服务
export { orderService } from './order';

// 支付管理服务
export { paymentService } from './payment';

// 设置管理服务
export { settingsService } from './settings';

// 仪表板服务
export { dashboardService } from './dashboard';

// 兼容性：保持原有API导出
export { authService as authApi } from './auth';
export { userService as userApi } from './user';
export { productService as productApi } from './product';
export { orderService as orderApi } from './order';
export { paymentService as paymentApi } from './payment';
export { settingsService as settingsApi } from './settings';
export { dashboardService as dashboardApi } from './dashboard'; 