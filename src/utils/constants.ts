/**
 * API 基础配置
 */
export const API_CONFIG = {
  BASE_URL: 'http://localhost:3001',
  TIMEOUT: 10000,
  RETRY_TIMES: 3,
} as const;

/**
 * 分页配置
 */
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
  PAGE_SIZE_OPTIONS: [10, 20, 50, 100],
  MAX_PAGE_SIZE: 100,
} as const;

/**
 * 状态配置
 */
export const STATUS = {
  ORDER: {
    PENDING: 'pending',
    PAID: 'paid',
    SHIPPED: 'shipped',
    DELIVERED: 'delivered',
    CANCELLED: 'cancelled',
  },
  PAYMENT: {
    PENDING: 'pending',
    SUCCESS: 'success',
    FAILED: 'failed',
    REFUNDED: 'refunded',
  },
  USER: {
    ACTIVE: 'active',
    INACTIVE: 'inactive',
  },
  PRODUCT: {
    AVAILABLE: 'available',
    UNAVAILABLE: 'unavailable',
  },
} as const;

/**
 * 主题配置
 */
export const THEME = {
  LIGHT: 'light',
  DARK: 'dark',
} as const;

/**
 * 本地存储键名
 */
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'auth-storage',
  USER_PREFERENCES: 'user-preferences',
  THEME: 'theme',
  LANGUAGE: 'language',
} as const;

/**
 * 路由路径
 */
export const ROUTES = {
  LOGIN: '/login',
  DASHBOARD: '/dashboard',
  USERS: '/users',
  PRODUCTS: '/products',
  ORDERS: '/orders',
  PAYMENTS: '/payments',
  SETTINGS: '/settings',
} as const;

/**
 * 错误码映射
 */
export const ERROR_CODES = {
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
  BAD_REQUEST: 400,
} as const;

/**
 * 文件上传配置
 */
export const UPLOAD_CONFIG = {
  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
  ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
  ALLOWED_DOCUMENT_TYPES: ['application/pdf', 'application/vnd.ms-excel'],
} as const; 