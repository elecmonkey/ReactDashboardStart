import { z } from 'zod';
import { validateForm, validate } from './validators';

/**
 * 表单验证结果类型
 */
export interface FormValidationResult<T> {
  success: boolean;
  data?: T;
  fieldErrors?: Record<keyof T, string>;
  errors?: string[];
}

/**
 * 表单验证器类
 */
export class FormValidator<T extends Record<string, any>> {
  private schema: z.ZodSchema<T>;

  constructor(schema: z.ZodSchema<T>) {
    this.schema = schema;
  }

  /**
   * 验证单个字段
   */
  validateField(fieldName: keyof T, value: any): { valid: boolean; error?: string } {
    try {
      // 创建只包含该字段的临时对象进行验证
      const testData = { [fieldName]: value } as Partial<T>;
      const result = (this.schema as any).partial().safeParse(testData);
      
      if (result.success) {
        return { valid: true };
      } else {
        const fieldError = result.error.errors.find((err: any) => 
          err.path.length > 0 && err.path[0] === fieldName
        );
        return { 
          valid: false, 
          error: fieldError?.message || '验证失败' 
        };
      }
    } catch (error) {
      return { valid: false, error: '验证失败' };
    }
  }

  /**
   * 验证整个表单
   */
  validateForm(formData: T): FormValidationResult<T> {
    return validateForm(this.schema, formData);
  }

  /**
   * 异步验证（可以添加远程验证逻辑）
   */
  async validateAsync(formData: T): Promise<FormValidationResult<T>> {
    // 基础验证
    const basicResult = this.validateForm(formData);
    if (!basicResult.success) {
      return basicResult;
    }

    // 这里可以添加异步验证逻辑，比如检查用户名是否已存在
    // const remoteValidation = await this.performRemoteValidation(formData);
    
    return basicResult;
  }

  /**
   * 获取字段的验证规则描述
   */
  getFieldRules(fieldName: keyof T): string[] {
    const rules: string[] = [];
    
    // 由于 zod 的 shape 属性在不同版本中可能有差异，
    // 这里提供一个通用的验证规则描述
    rules.push('请遵循表单字段的验证要求');
    
    return rules;
  }
}

/**
 * 创建表单验证器
 */
export function createFormValidator<T extends Record<string, any>>(
  schema: z.ZodSchema<T>
): FormValidator<T> {
  return new FormValidator(schema);
}

/**
 * React Hook 风格的表单验证
 */
export function useFormValidation<T extends Record<string, any>>(
  schema: z.ZodSchema<T>,
  initialData?: Partial<T>
) {
  const validator = new FormValidator(schema);

  const validateField = (fieldName: keyof T, value: any) => {
    return validator.validateField(fieldName, value);
  };

  const validateForm = (formData: T) => {
    return validator.validateForm(formData);
  };

  const validateAsync = async (formData: T) => {
    return validator.validateAsync(formData);
  };

  return {
    validateField,
    validateForm,
    validateAsync,
    getFieldRules: (fieldName: keyof T) => validator.getFieldRules(fieldName),
  };
}

/**
 * Ant Design Form 集成助手
 */
export class AntdFormValidator<T extends Record<string, any>> {
  private validator: FormValidator<T>;

  constructor(schema: z.ZodSchema<T>) {
    this.validator = new FormValidator(schema);
  }

  /**
   * 转换为 Ant Design Form 的验证规则
   */
  getAntdRules(fieldName: keyof T) {
    return [
      {
        validator: (_: any, value: any) => {
          const result = this.validator.validateField(fieldName, value);
          if (result.valid) {
            return Promise.resolve();
          }
          return Promise.reject(new Error(result.error));
        },
      },
    ];
  }

  /**
   * 批量获取所有字段的 Ant Design 验证规则
   */
  getAllAntdRules(fieldNames: (keyof T)[]): Record<keyof T, any[]> {
    const rules: Record<keyof T, any[]> = {} as Record<keyof T, any[]>;
    fieldNames.forEach(fieldName => {
      rules[fieldName] = this.getAntdRules(fieldName);
    });
    return rules;
  }

  /**
   * 表单提交时的验证
   */
  async validateBeforeSubmit(formData: T): Promise<T> {
    const result = await this.validator.validateAsync(formData);
    if (!result.success) {
      const errorMessage = result.errors?.join('; ') || '表单验证失败';
      throw new Error(errorMessage);
    }
    return result.data!;
  }
}

/**
 * 创建 Ant Design 表单验证器
 */
export function createAntdFormValidator<T extends Record<string, any>>(
  schema: z.ZodSchema<T>
): AntdFormValidator<T> {
  return new AntdFormValidator(schema);
}