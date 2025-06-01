# 项目架构说明

## 🏗️ 总体架构

本项目采用现代化的前端架构设计，按照业务模块进行分层和拆分，确保代码的可维护性和扩展性。

## 📁 目录结构

```
src/
├── components/           # 通用组件
│   └── Layout.tsx       # 布局组件
├── hooks/               # 自定义Hooks
│   └── useDocumentTitle.ts
├── pages/              # 页面组件
│   ├── Dashboard.tsx   # 仪表板
│   ├── Login.tsx       # 登录页
│   ├── Settings.tsx    # 系统设置
│   ├── UserManagement.tsx    # 用户管理
│   ├── ProductManagement.tsx # 产品管理
│   └── OrderManagement/      # 订单管理模块
│       ├── OrderList.tsx     # 订单列表
│       ├── PaymentManagement.tsx # 支付管理
│       └── OrderSettings.tsx # 订单设置
├── router/             # 路由配置
├── services/           # API服务层 (按业务模块拆分)
│   ├── auth.ts         # 认证服务
│   ├── user.ts         # 用户管理服务
│   ├── product.ts      # 产品管理服务
│   ├── order.ts        # 订单管理服务
│   ├── payment.ts      # 支付管理服务
│   ├── settings.ts     # 设置管理服务
│   ├── dashboard.ts    # 仪表板服务
│   └── index.ts        # 服务统一导出
├── store/              # 状态管理
│   ├── authStore.ts    # 认证状态
│   └── appStore.ts     # 应用状态
├── types/              # TypeScript类型定义 (按业务模块拆分)
│   ├── auth.ts         # 认证相关类型
│   ├── user.ts         # 用户相关类型
│   ├── product.ts      # 产品相关类型
│   ├── order.ts        # 订单相关类型
│   ├── payment.ts      # 支付相关类型
│   ├── settings.ts     # 设置相关类型
│   ├── dashboard.ts    # 仪表板相关类型
│   ├── common.ts       # 通用类型
│   └── index.ts        # 类型统一导出
├── utils/              # 工具函数
│   ├── request.ts      # HTTP请求封装
│   ├── helpers.ts      # 通用工具函数
│   ├── constants.ts    # 常量定义
│   ├── validators.ts   # 验证器
│   └── index.ts        # 工具统一导出
├── App.tsx             # 应用入口
└── index.tsx           # 项目入口
```

## 🔧 技术栈

### 前端框架
- **React 18** - 前端框架
- **TypeScript** - 类型安全
- **Rsbuild** - 构建工具
- **Ant Design** - UI组件库

### 状态管理
- **Zustand** - 轻量级状态管理

### 路由
- **React Router** - 客户端路由

### HTTP请求
- **自定义Request类** - 基于fetch的请求封装

## 📋 模块拆分原则

### 1. Types (类型定义)
按业务模块拆分，每个模块包含：
- 业务实体类型
- 请求/响应类型
- 查询参数类型
- 统计数据类型

### 2. Services (API服务)
按业务模块拆分，每个服务包含：
- 基础CRUD操作
- 业务特定操作
- 统计查询
- 数据导入导出

### 3. Pages (页面组件)
按功能模块组织：
- 单一页面：直接放在pages目录
- 复杂模块：创建子目录(如OrderManagement)

### 4. Utils (工具函数)
按功能类型拆分：
- `request.ts` - HTTP请求封装
- `helpers.ts` - 通用工具函数
- `constants.ts` - 常量定义
- `validators.ts` - 验证器函数

## 🔄 数据流

```
Page Component → Service → Request → Mock Server
     ↑              ↑         ↑           ↓
   State      Type Safety   HTTP      JSON Response
```

## 📦 导入导出规范

### 统一导出入口
```typescript
// 从types导入
import type { User, Product, Order } from '@/types';

// 从services导入
import { userService, productService } from '@/services';

// 从utils导入
import { request, formatCurrency } from '@/utils';
```

### 兼容性导出
为了保持向后兼容，每个模块都提供别名导出：
```typescript
// services/index.ts
export {
  authService as authApi,
  userService as userApi,
  // ...
}
```

## 🎯 设计优势

### 1. 可维护性
- 按业务模块拆分，职责清晰
- 统一的导入导出规范
- 完整的TypeScript类型支持

### 2. 可扩展性
- 新增业务模块只需增加对应的types和services
- 工具函数模块化，易于复用
- 组件按功能组织，便于维护

### 3. 开发体验
- 完整的类型提示
- 统一的错误处理
- 自动化的请求封装

### 4. 团队协作
- 清晰的目录结构
- 统一的代码风格
- 模块间低耦合

## 🚀 后续扩展

当API数量继续增长时，可以进一步拆分：

### Services层
```
services/
├── auth/
│   ├── login.ts
│   ├── register.ts
│   └── index.ts
├── user/
│   ├── crud.ts
│   ├── stats.ts
│   └── index.ts
└── ...
```

### Types层
```
types/
├── entities/      # 业务实体
├── requests/      # 请求类型
├── responses/     # 响应类型
└── enums/         # 枚举类型
```

这种架构设计确保了项目在规模扩大时依然保持清晰的结构和良好的可维护性。 