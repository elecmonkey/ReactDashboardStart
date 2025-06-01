import { z } from 'zod';

// 基础验证 Schema
export const emailSchema = z.string().email('请输入有效的邮箱地址');
export const phoneSchema = z.string().regex(/^1[3-9]\d{9}$/, '请输入有效的手机号码');
export const urlSchema = z.string().url('请输入有效的URL地址');
export const idCardSchema = z.string().regex(/(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/, '请输入有效的身份证号');
export const amountSchema = z.number().min(0, '金额不能为负数').max(999999.99, '金额超出范围');
export const usernameSchema = z.string()
  .min(3, '用户名至少3个字符')
  .max(20, '用户名不超过20个字符')
  .regex(/^[a-zA-Z0-9_]+$/, '用户名只能包含字母、数字和下划线');

// 密码强度验证 Schema
export const passwordSchema = z.string()
  .min(8, '密码至少8个字符')
  .regex(/^(?=.*[a-z])/, '密码必须包含小写字母')
  .regex(/^(?=.*[A-Z])/, '密码必须包含大写字母')
  .regex(/^(?=.*\d)/, '密码必须包含数字')
  .regex(/^(?=.*[!@#$%^&*(),.?":{}|<>])/, '密码必须包含特殊字符');

// IP地址验证 Schema
export const ipSchema = z.string().ip('请输入有效的IP地址');

// 端口验证 Schema
export const portSchema = z.number().int('端口必须为整数').min(1, '端口至少为1').max(65535, '端口不超过65535');

/**
 * 邮箱验证
 */
export const isValidEmail = (email: string): boolean => {
  try {
    emailSchema.parse(email);
    return true;
  } catch {
    return false;
  }
};

/**
 * 手机号验证（中国）
 */
export const isValidPhone = (phone: string): boolean => {
  try {
    phoneSchema.parse(phone);
    return true;
  } catch {
    return false;
  }
};

/**
 * 密码强度验证
 */
export const validatePasswordStrength = (password: string): {
  isValid: boolean;
  strength: 'weak' | 'medium' | 'strong';
  errors: string[];
} => {
  const result = passwordSchema.safeParse(password);
  
  if (result.success) {
    return {
      isValid: true,
      strength: 'strong',
      errors: [],
    };
  }

  const errors = result.error.errors.map(err => err.message);
  let score = 0;

  // 计算密码强度得分
  if (password.length >= 8) score += 1;
  if (/[A-Z]/.test(password)) score += 1;
  if (/[a-z]/.test(password)) score += 1;
  if (/\d/.test(password)) score += 1;
  if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) score += 1;

  let strength: 'weak' | 'medium' | 'strong' = 'weak';
  if (score >= 4) {
    strength = 'strong';
  } else if (score >= 2) {
    strength = 'medium';
  }

  return {
    isValid: false,
    strength,
    errors,
  };
};

/**
 * URL验证
 */
export const isValidUrl = (url: string): boolean => {
  try {
    urlSchema.parse(url);
    return true;
  } catch {
    return false;
  }
};

/**
 * 身份证号验证
 */
export const isValidIdCard = (idCard: string): boolean => {
  try {
    idCardSchema.parse(idCard);
    return true;
  } catch {
    return false;
  }
};

/**
 * 金额验证（正数，最多2位小数）
 */
export const isValidAmount = (amount: string | number): boolean => {
  try {
    const amountValue = typeof amount === 'string' ? parseFloat(amount) : amount;
    amountSchema.parse(amountValue);
    
    // 检查小数位数
    const amountStr = String(amountValue);
    const decimalPlaces = amountStr.includes('.') ? amountStr.split('.')[1].length : 0;
    return decimalPlaces <= 2;
  } catch {
    return false;
  }
};

/**
 * 用户名验证（字母、数字、下划线，3-20位）
 */
export const isValidUsername = (username: string): boolean => {
  try {
    usernameSchema.parse(username);
    return true;
  } catch {
    return false;
  }
};

/**
 * IP地址验证
 */
export const isValidIp = (ip: string): boolean => {
  try {
    ipSchema.parse(ip);
    return true;
  } catch {
    return false;
  }
};

/**
 * 端口验证
 */
export const isValidPort = (port: number): boolean => {
  try {
    portSchema.parse(port);
    return true;
  } catch {
    return false;
  }
};

/**
 * 通用验证函数
 */
export const validate = <T>(schema: z.ZodSchema<T>, data: unknown): {
  success: boolean;
  data?: T;
  errors?: string[];
} => {
  const result = schema.safeParse(data);
  
  if (result.success) {
    return {
      success: true,
      data: result.data,
    };
  }

  return {
    success: false,
    errors: result.error.errors.map(err => err.message),
  };
};

/**
 * 创建自定义验证器
 */
export const createValidator = <T>(schema: z.ZodSchema<T>) => {
  return (data: unknown) => validate(schema, data);
};

/**
 * 表单验证助手
 */
export const validateForm = <T extends Record<string, any>>(
  schema: z.ZodSchema<T>,
  formData: T
): {
  success: boolean;
  data?: T;
  fieldErrors?: Record<keyof T, string>;
  errors?: string[];
} => {
  const result = schema.safeParse(formData);
  
  if (result.success) {
    return {
      success: true,
      data: result.data,
    };
  }

  const fieldErrors: Record<string, string> = {};
  const errors: string[] = [];

  result.error.errors.forEach(err => {
    if (err.path.length > 0) {
      const field = err.path[0] as string;
      fieldErrors[field] = err.message;
    } else {
      errors.push(err.message);
    }
  });

  return {
    success: false,
    fieldErrors: fieldErrors as Record<keyof T, string>,
    errors,
  };
};

/**
 * 批量验证
 */
export const validateBatch = <T>(
  items: unknown[],
  schema: z.ZodSchema<T>
): {
  success: boolean;
  validItems: T[];
  invalidItems: { index: number; errors: string[] }[];
} => {
  const validItems: T[] = [];
  const invalidItems: { index: number; errors: string[] }[] = [];

  items.forEach((item, index) => {
    const result = validate(schema, item);
    if (result.success && result.data) {
      validItems.push(result.data);
    } else {
      invalidItems.push({
        index,
        errors: result.errors || [],
      });
    }
  });

  return {
    success: invalidItems.length === 0,
    validItems,
    invalidItems,
  };
}; 