const http = require('http');
const url = require('url');
// const util = require('util');

// 模拟数据
const mockData = {
  users: [
    {
      id: '1',
      username: 'admin',
      email: 'admin@example.com',
      role: 'admin',
      status: 'active',
      createdAt: '2024-01-01',
    },
    {
      id: '2',
      username: 'user1',
      email: 'user1@example.com',
      role: 'user',
      status: 'active',
      createdAt: '2024-01-02',
    },
    {
      id: '3',
      username: 'user2',
      email: 'user2@example.com',
      role: 'user',
      status: 'inactive',
      createdAt: '2024-01-03',
    },
  ],
  
  products: [
    {
      id: '1',
      name: 'iPhone 15',
      category: '手机',
      price: 7999,
      stock: 50,
      status: 'available',
      image: 'https://via.placeholder.com/100x100?text=iPhone',
      description: '最新款iPhone',
      createdAt: '2024-01-01',
    },
    {
      id: '2',
      name: 'MacBook Pro',
      category: '电脑',
      price: 15999,
      stock: 20,
      status: 'available',
      image: 'https://via.placeholder.com/100x100?text=MacBook',
      description: '专业级笔记本电脑',
      createdAt: '2024-01-02',
    },
    {
      id: '3',
      name: 'iPad Air',
      category: '平板',
      price: 4599,
      stock: 0,
      status: 'unavailable',
      image: 'https://via.placeholder.com/100x100?text=iPad',
      description: '轻薄便携平板',
      createdAt: '2024-01-03',
    },
  ],
  
  orders: [
    {
      id: 'ORD-2024-001',
      customerName: '张三',
      customerPhone: '13800138000',
      products: 'iPhone 15, AirPods Pro',
      totalAmount: 8999,
      status: 'paid',
      paymentMethod: '微信支付',
      createdAt: '2024-01-15 14:30:00',
      shippingAddress: '北京市朝阳区xxx街道xxx号',
    },
    {
      id: 'ORD-2024-002',
      customerName: '李四',
      customerPhone: '13900139000',
      products: 'MacBook Pro 14寸',
      totalAmount: 15999,
      status: 'pending',
      paymentMethod: '支付宝',
      createdAt: '2024-01-14 16:20:00',
      shippingAddress: '上海市浦东新区xxx路xxx号',
    },
    {
      id: 'ORD-2024-003',
      customerName: '王五',
      customerPhone: '13700137000',
      products: 'iPad Air, Apple Pencil',
      totalAmount: 5299,
      status: 'shipped',
      paymentMethod: '信用卡',
      createdAt: '2024-01-13 10:15:00',
      shippingAddress: '广州市天河区xxx大道xxx号',
    },
  ],
  
  payments: [
    {
      id: 'PAY-2024-001',
      orderId: 'ORD-2024-001',
      amount: 8999,
      method: 'wechat',
      status: 'success',
      transactionId: 'WX20240115143000123456',
      createdAt: '2024-01-15 14:30:00',
      completedAt: '2024-01-15 14:30:05',
    },
    {
      id: 'PAY-2024-002',
      orderId: 'ORD-2024-002',
      amount: 15999,
      method: 'alipay',
      status: 'pending',
      transactionId: 'AP20240114162000789012',
      createdAt: '2024-01-14 16:20:00',
    },
    {
      id: 'PAY-2024-003',
      orderId: 'ORD-2024-003',
      amount: 5299,
      method: 'credit',
      status: 'failed',
      transactionId: 'CC20240113101500345678',
      createdAt: '2024-01-13 10:15:00',
    },
  ],
  
  settings: {
    siteName: '智能管理系统',
    siteDescription: '基于React和TypeScript的企业级后台管理系统',
    adminEmail: 'admin@smartsystem.com',
    language: 'zh-CN',
    theme: 'light',
    maintenanceMode: false,
    autoSave: true,
    emailNotification: true,
    sessionTimeout: 30,
    passwordStrength: 'medium',
    loginFailLimit: 5,
  },
  
  orderSettings: {
    autoConfirmDays: 7,
    autoCompleteAfterShip: true,
    allowCancel: true,
    cancelTimeLimit: 30,
    defaultCurrency: 'CNY',
    requirePhone: true,
    requireAddress: true,
    enableCoupon: true,
    maxOrderItems: 20,
    orderPrefix: 'ORD',
    invoiceValidation: true,
  }
};

// 日志工具函数
function logRequest(method, url, headers, body) {
  console.log('\n' + '='.repeat(80));
  console.log(`📥 REQUEST: ${method} ${url}`);
  console.log(`🕐 Time: ${new Date().toISOString()}`);
  
  // 只显示关键的headers
  const relevantHeaders = {};
  if (headers['content-type']) relevantHeaders['content-type'] = headers['content-type'];
  if (headers['authorization']) relevantHeaders['authorization'] = headers['authorization'];
  if (headers['user-agent']) relevantHeaders['user-agent'] = headers['user-agent'];
  
  if (Object.keys(relevantHeaders).length > 0) {
    console.log('📋 Headers:', JSON.stringify(relevantHeaders, null, 2));
  }
  
  if (body && Object.keys(body).length > 0) {
    console.log('📦 Body:', JSON.stringify(body, null, 2));
  }
}

function logResponse(statusCode, responseData, responseTime) {
  console.log(`📤 RESPONSE: ${statusCode}`);
  console.log(`⏱️  Response Time: ${responseTime}ms`);
  
  if (responseData) {
    // 如果响应数据太大，只显示摘要
    const dataStr = JSON.stringify(responseData);
    if (dataStr.length > 1000) {
      console.log('📄 Response (truncated):', dataStr.substring(0, 500) + '...[truncated]');
    } else {
      console.log('📄 Response:', JSON.stringify(responseData, null, 2));
    }
  }
  console.log('='.repeat(80));
}

// 工具函数
function sendResponse(res, data, code = 200, message = 'success', startTime) {
  const responseTime = Date.now() - startTime;
  
  res.writeHead(200, {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  });
  
  const responseData = {
    success: code === 200,
    code,
    message,
    data,
    timestamp: new Date().toISOString(),
    responseTime: `${responseTime}ms`
  };
  
  logResponse(code, responseData, responseTime);
  
  res.end(JSON.stringify(responseData));
}

function sendError(res, message = 'Error', code = 500, startTime) {
  sendResponse(res, null, code, message, startTime);
}

// 修复的parseBody函数
function parseBody(req) {
  return new Promise((resolve) => {
    let body = '';
    let timeout;
    
    // 设置超时
    timeout = setTimeout(() => {
      console.log('❌ Request body parsing timeout');
      resolve({});
    }, 5000); // 5秒超时
    
    req.on('data', chunk => {
      body += chunk.toString();
      // 如果body太大，直接返回
      if (body.length > 1024 * 1024) { // 1MB限制
        clearTimeout(timeout);
        console.log('❌ Request body too large');
        resolve({});
      }
    });
    
    req.on('end', () => {
      clearTimeout(timeout);
      try {
        const parsed = body ? JSON.parse(body) : {};
        resolve(parsed);
      } catch (error) {
        console.log('❌ JSON parse error:', error.message);
        resolve({});
      }
    });
    
    req.on('error', (error) => {
      clearTimeout(timeout);
      console.log('❌ Request error:', error.message);
      resolve({});
    });
  });
}

function generateId() {
  return Date.now().toString() + Math.random().toString(36).slice(2, 11);
}

// 路由处理
const routes = {
  // 认证相关
  'POST /api/auth/login': async (req, res, params, startTime) => {
    const body = await parseBody(req);
    if (body.username === 'admin' && body.password === 'admin123') {
      sendResponse(res, {
        user: {
          id: '1',
          username: 'admin',
          email: 'admin@example.com',
          role: 'admin',
        },
        token: 'mock-jwt-token-' + Date.now()
      }, 200, '登录成功', startTime);
    } else {
      sendError(res, '用户名或密码错误', 401, startTime);
    }
  },
  
  'GET /api/auth/userinfo': (req, res, params, startTime) => {
    sendResponse(res, {
      id: '1',
      username: 'admin',
      email: 'admin@example.com',
      role: 'admin',
    }, 200, '获取用户信息成功', startTime);
  },
  
  // 用户管理
  'GET /api/users': (req, res, params, startTime) => {
    sendResponse(res, mockData.users, 200, '获取用户列表成功', startTime);
  },
  
  'POST /api/users': async (req, res, params, startTime) => {
    const body = await parseBody(req);
    const newUser = {
      id: generateId(),
      ...body,
      createdAt: new Date().toISOString().split('T')[0],
    };
    mockData.users.push(newUser);
    sendResponse(res, newUser, 200, '创建用户成功', startTime);
  },
  
  'PUT /api/users/:id': async (req, res, params, startTime) => {
    const body = await parseBody(req);
    const index = mockData.users.findIndex(u => u.id === params.id);
    if (index !== -1) {
      mockData.users[index] = { ...mockData.users[index], ...body };
      sendResponse(res, mockData.users[index], 200, '更新用户成功', startTime);
    } else {
      sendError(res, '用户不存在', 404, startTime);
    }
  },
  
  'DELETE /api/users/:id': (req, res, params, startTime) => {
    const index = mockData.users.findIndex(u => u.id === params.id);
    if (index !== -1) {
      mockData.users.splice(index, 1);
      sendResponse(res, null, 200, '删除用户成功', startTime);
    } else {
      sendError(res, '用户不存在', 404, startTime);
    }
  },
  
  // 产品管理
  'GET /api/products': (req, res, params, startTime) => {
    sendResponse(res, mockData.products, 200, '获取产品列表成功', startTime);
  },
  
  'POST /api/products': async (req, res, params, startTime) => {
    const body = await parseBody(req);
    const newProduct = {
      id: generateId(),
      ...body,
      image: body.image || 'https://via.placeholder.com/100x100?text=Product',
      createdAt: new Date().toISOString().split('T')[0],
    };
    mockData.products.push(newProduct);
    sendResponse(res, newProduct, 200, '创建产品成功', startTime);
  },
  
  'PUT /api/products/:id': async (req, res, params, startTime) => {
    const body = await parseBody(req);
    const index = mockData.products.findIndex(p => p.id === params.id);
    if (index !== -1) {
      mockData.products[index] = { ...mockData.products[index], ...body };
      sendResponse(res, mockData.products[index], 200, '更新产品成功', startTime);
    } else {
      sendError(res, '产品不存在', 404, startTime);
    }
  },
  
  'DELETE /api/products/:id': (req, res, params, startTime) => {
    const index = mockData.products.findIndex(p => p.id === params.id);
    if (index !== -1) {
      mockData.products.splice(index, 1);
      sendResponse(res, null, 200, '删除产品成功', startTime);
    } else {
      sendError(res, '产品不存在', 404, startTime);
    }
  },
  
  // 订单管理
  'GET /api/orders': (req, res, params, startTime) => {
    sendResponse(res, mockData.orders, 200, '获取订单列表成功', startTime);
  },
  
  'GET /api/orders/:id': (req, res, params, startTime) => {
    const order = mockData.orders.find(o => o.id === params.id);
    if (order) {
      sendResponse(res, order, 200, '获取订单详情成功', startTime);
    } else {
      sendError(res, '订单不存在', 404, startTime);
    }
  },
  
  'PATCH /api/orders/:id/status': async (req, res, params, startTime) => {
    const body = await parseBody(req);
    const index = mockData.orders.findIndex(o => o.id === params.id);
    if (index !== -1) {
      mockData.orders[index].status = body.status;
      sendResponse(res, mockData.orders[index], 200, '更新订单状态成功', startTime);
    } else {
      sendError(res, '订单不存在', 404, startTime);
    }
  },
  
  'GET /api/orders/stats': (req, res, params, startTime) => {
    const orders = mockData.orders;
    const stats = {
      total: orders.length,
      pending: orders.filter(o => o.status === 'pending').length,
      paid: orders.filter(o => o.status === 'paid').length,
      shipped: orders.filter(o => o.status === 'shipped').length,
      totalAmount: orders.reduce((sum, order) => sum + order.totalAmount, 0),
    };
    sendResponse(res, stats, 200, '获取订单统计成功', startTime);
  },
  
  // 支付管理
  'GET /api/payments': (req, res, params, startTime) => {
    sendResponse(res, mockData.payments, 200, '获取支付列表成功', startTime);
  },
  
  'GET /api/payments/:id': (req, res, params, startTime) => {
    const payment = mockData.payments.find(p => p.id === params.id);
    if (payment) {
      sendResponse(res, payment, 200, '获取支付详情成功', startTime);
    } else {
      sendError(res, '支付记录不存在', 404, startTime);
    }
  },
  
  'POST /api/payments/:id/retry': (req, res, params, startTime) => {
    const index = mockData.payments.findIndex(p => p.id === params.id);
    if (index !== -1) {
      mockData.payments[index].status = 'pending';
      sendResponse(res, mockData.payments[index], 200, '重试支付成功', startTime);
    } else {
      sendError(res, '支付记录不存在', 404, startTime);
    }
  },
  
  'GET /api/payments/stats': (req, res, params, startTime) => {
    const payments = mockData.payments;
    const stats = {
      total: payments.length,
      success: payments.filter(p => p.status === 'success').length,
      pending: payments.filter(p => p.status === 'pending').length,
      failed: payments.filter(p => p.status === 'failed').length,
      totalAmount: payments
        .filter(p => p.status === 'success')
        .reduce((sum, payment) => sum + payment.amount, 0),
    };
    sendResponse(res, stats, 200, '获取支付统计成功', startTime);
  },
  
  // 设置管理
  'GET /api/settings': (req, res, params, startTime) => {
    sendResponse(res, mockData.settings, 200, '获取系统设置成功', startTime);
  },
  
  'PUT /api/settings': async (req, res, params, startTime) => {
    const body = await parseBody(req);
    mockData.settings = { ...mockData.settings, ...body };
    sendResponse(res, mockData.settings, 200, '更新系统设置成功', startTime);
  },
  
  'GET /api/settings/order': (req, res, params, startTime) => {
    sendResponse(res, mockData.orderSettings, 200, '获取订单设置成功', startTime);
  },
  
  'PUT /api/settings/order': async (req, res, params, startTime) => {
    const body = await parseBody(req);
    mockData.orderSettings = { ...mockData.orderSettings, ...body };
    sendResponse(res, mockData.orderSettings, 200, '更新订单设置成功', startTime);
  },
  
  // 仪表板
  'GET /api/dashboard': (req, res, params, startTime) => {
    const statistics = [
      {
        title: '总用户数',
        value: mockData.users.length,
        suffix: '人',
        color: '#1890ff',
      },
      {
        title: '总订单数',
        value: mockData.orders.length,
        suffix: '单',
        color: '#52c41a',
      },
      {
        title: '总收入',
        value: mockData.orders.reduce((sum, order) => sum + order.totalAmount, 0),
        suffix: '元',
        color: '#faad14',
      },
      {
        title: '完成率',
        value: Math.round((mockData.orders.filter(o => o.status === 'paid' || o.status === 'delivered').length / mockData.orders.length) * 100 * 10) / 10,
        suffix: '%',
        color: '#eb2f96',
      },
    ];
    
    sendResponse(res, { statistics }, 200, '获取仪表板数据成功', startTime);
  },
  
  'GET /api/dashboard/recent-orders': (req, res, params, startTime) => {
    const recentOrders = mockData.orders
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5);
    sendResponse(res, recentOrders, 200, '获取最近订单成功', startTime);
  },
  
  'GET /api/dashboard/system-status': (req, res, params, startTime) => {
    // 模拟动态系统状态
    const status = {
      cpu: Math.floor(Math.random() * 30) + 40, // 40-70%
      memory: Math.floor(Math.random() * 40) + 50, // 50-90%
      disk: Math.floor(Math.random() * 20) + 20, // 20-40%
      network: Math.floor(Math.random() * 50) + 50, // 50-100%
    };
    sendResponse(res, status, 200, '获取系统状态成功', startTime);
  },
};

// 创建服务器
const server = http.createServer(async (req, res) => {
  const startTime = Date.now();
  
  // 处理CORS预检请求
  if (req.method === 'OPTIONS') {
    res.writeHead(200, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    });
    res.end();
    return;
  }
  
  const parsedUrl = url.parse(req.url, true);
  const method = req.method;
  const pathname = parsedUrl.pathname;
  
  // 记录请求日志（不包含body，因为还没解析）
  logRequest(method, pathname, req.headers, {});
  
  // 匹配路由
  let matchedRoute = null;
  let params = {};
  
  for (const route in routes) {
    const [routeMethod, routePath] = route.split(' ');
    if (method !== routeMethod) continue;
    
    // 处理参数路由
    const routePattern = routePath.replace(/:([^/]+)/g, '([^/]+)');
    const regex = new RegExp(`^${routePattern}$`);
    const match = pathname.match(regex);
    
    if (match) {
      matchedRoute = route;
      // 提取参数
      const paramNames = (routePath.match(/:([^/]+)/g) || []).map(p => p.slice(1));
      paramNames.forEach((name, index) => {
        params[name] = match[index + 1];
      });
      break;
    }
  }
  
  if (matchedRoute) {
    try {
      await routes[matchedRoute](req, res, params, startTime);
    } catch (error) {
      console.error('❌ Route error:', error);
      sendError(res, '服务器内部错误', 500, startTime);
    }
  } else {
    console.log(`❌ Route not found: ${method} ${pathname}`);
    sendError(res, '接口不存在', 404, startTime);
  }
});

const PORT = 3001;
server.listen(PORT, () => {
  console.log('🚀 Mock Server Started!');
  console.log(`📍 Server: http://localhost:${PORT}`);
  console.log(`🕐 Time: ${new Date().toISOString()}`);
  console.log('\n📋 Available Routes:');
  Object.keys(routes).forEach(route => {
    console.log(`   ${route}`);
  });
  console.log('\n🔍 Debug mode enabled - all requests will be logged\n');
}); 