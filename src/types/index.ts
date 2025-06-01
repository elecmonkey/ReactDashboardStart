// 通用类型
export * from './common';

// 业务模块类型
export * from './auth';
export * from './product';
export * from './order';
export * from './payment';
export * from './settings';
export * from './dashboard';

// 兼容性：重新导出一些常用类型别名
export type { User, LoginResponse } from './auth';
export type { Product } from './product';
export type { Order, OrderStats } from './order';
export type { Payment, PaymentStats } from './payment';
export type { Settings, OrderSettings } from './settings';
export type { Statistics, DashboardData, SystemStatus } from './dashboard';
export type { ApiResponse, PaginatedResponse, OperationResult } from './common'; 