/**
 * 邮箱验证
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * 手机号验证（中国）
 */
export const isValidPhone = (phone: string): boolean => {
  const phoneRegex = /^1[3-9]\d{9}$/;
  return phoneRegex.test(phone);
};

/**
 * 密码强度验证
 */
export const validatePasswordStrength = (password: string): {
  isValid: boolean;
  strength: 'weak' | 'medium' | 'strong';
  errors: string[];
} => {
  const errors: string[] = [];
  let score = 0;

  if (password.length < 8) {
    errors.push('密码长度至少8位');
  } else {
    score += 1;
  }

  if (!/[A-Z]/.test(password)) {
    errors.push('密码需包含大写字母');
  } else {
    score += 1;
  }

  if (!/[a-z]/.test(password)) {
    errors.push('密码需包含小写字母');
  } else {
    score += 1;
  }

  if (!/\d/.test(password)) {
    errors.push('密码需包含数字');
  } else {
    score += 1;
  }

  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.push('密码需包含特殊字符');
  } else {
    score += 1;
  }

  let strength: 'weak' | 'medium' | 'strong' = 'weak';
  if (score >= 4) {
    strength = 'strong';
  } else if (score >= 2) {
    strength = 'medium';
  }

  return {
    isValid: errors.length === 0,
    strength,
    errors,
  };
};

/**
 * URL验证
 */
export const isValidUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

/**
 * 身份证号验证
 */
export const isValidIdCard = (idCard: string): boolean => {
  const idCardRegex = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
  return idCardRegex.test(idCard);
};

/**
 * 金额验证（正数，最多2位小数）
 */
export const isValidAmount = (amount: string | number): boolean => {
  const amountRegex = /^\d+(\.\d{1,2})?$/;
  return amountRegex.test(String(amount)) && Number(amount) > 0;
};

/**
 * 用户名验证（字母、数字、下划线，3-20位）
 */
export const isValidUsername = (username: string): boolean => {
  const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
  return usernameRegex.test(username);
}; 