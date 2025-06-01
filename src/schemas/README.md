# Zod Schemas 文档

本目录包含了项目中所有的 Zod 验证模式（schemas），用于数据验证和类型安全。

## 文件结构

```
src/schemas/
├── index.ts        # 统一导出入口
├── common.ts       # 通用验证模式
├── auth.ts         # 认证相关验证模式
├── user.ts         # 用户管理验证模式
├── product.ts      # 产品管理验证模式
├── order.ts        # 订单管理验证模式
├── payment.ts      # 支付管理验证模式
├── settings.ts     # 系统设置验证模式
└── dashboard.ts    # 仪表板验证模式
```

## 主要功能

### 1. 数据验证
- 请求数据验证
- 响应数据验证
- 表单字段验证

### 2. 类型安全
- 从 zod schema 自动推导 TypeScript 类型
- 编译时类型检查
- 运行时数据验证

### 3. 错误提示
- 中文错误提示信息
- 字段级别的详细错误信息
- 用户友好的提示文案

## 使用示例

### 基础验证
```typescript
import { LoginRequestSchema } from '@/schemas';

// 验证登录数据
const result = LoginRequestSchema.safeParse(data);
if (result.success) {
  // 数据有效
  console.log(result.data);
} else {
  // 处理验证错误
  console.log(result.error.errors);
}
```

### 在服务层使用
```typescript
import { validate } from '@/utils/validators';
import { LoginRequestSchema } from '@/schemas';

export const authService = {
  async login(data: LoginRequest) {
    // 验证请求数据
    const validationResult = validate(LoginRequestSchema, data);
    if (!validationResult.success) {
      throw new Error(validationResult.errors?.join(', '));
    }
    
    return request.post('/auth/login', validationResult.data);
  }
};
```

### 在组件中使用
```typescript
import { createAntdFormValidator } from '@/utils';
import { LoginRequestSchema } from '@/schemas';

const LoginForm = () => {
  const formValidator = createAntdFormValidator(LoginRequestSchema);
  
  return (
    <Form>
      <Form.Item
        name="username"
        rules={formValidator.getAntdRules('username')}
      >
        <Input />
      </Form.Item>
    </Form>
  );
};
```

## 验证规则

### 通用验证
- **ID**: 非空字符串
- **时间戳**: ISO 8601 格式或字符串
- **状态**: `active` | `inactive`
- **邮箱**: 有效的邮箱格式
- **手机号**: 中国手机号格式 (1[3-9]\d{9})

### 业务特定验证
- **用户名**: 3-20个字符，只能包含字母、数字、下划线
- **密码**: 至少8个字符，包含大小写字母、数字和特殊字符
- **金额**: 0-999999.99，最多2位小数
- **库存**: 非负整数

## 最佳实践

1. **保持一致性**: 所有相同类型的字段使用相同的验证规则
2. **用户友好**: 提供清晰的中文错误提示
3. **类型安全**: 始终从 schema 推导类型，避免重复定义
4. **模块化**: 按业务模块组织 schema 文件
5. **可扩展**: 使用 `.extend()` 和 `.merge()` 来扩展现有 schema

## 工具函数

项目提供了一套完整的工具函数来简化 zod 的使用：

- `validate()`: 通用验证函数
- `validateForm()`: 表单验证函数
- `createFormValidator()`: 创建表单验证器
- `createAntdFormValidator()`: 创建 Ant Design 表单验证器

详细用法请参考 `src/utils/form-validation.ts` 和 `src/utils/validators.ts`。 