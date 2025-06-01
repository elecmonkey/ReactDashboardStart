import request from './request';
import type { ApiResponse } from './request';

/**
 * 新axios请求库使用示例
 */

// 示例1: 基本的GET请求
export const getUserInfo = async (userId: string) => {
  try {
    const response = await request.get<{ id: string; name: string; email: string }>(`/users/${userId}`);
    return response;
  } catch (error) {
    console.error('获取用户信息失败:', error);
    throw error;
  }
};

// 示例2: 带参数的GET请求
export const getUserList = async (params: { page?: number; size?: number; keyword?: string }) => {
  try {
    const response = await request.get<{ list: any[]; total: number }>('/users', params);
    return response;
  } catch (error) {
    console.error('获取用户列表失败:', error);
    throw error;
  }
};

// 示例3: POST请求
export const createUser = async (userData: { name: string; email: string; role: string }) => {
  try {
    const response = await request.post<{ id: string }>('/users', userData);
    return response;
  } catch (error) {
    console.error('创建用户失败:', error);
    throw error;
  }
};

// 示例4: 文件上传
export const uploadAvatar = async (file: File) => {
  try {
    const response = await request.upload<{ url: string }>('/upload/avatar', file);
    return response;
  } catch (error) {
    console.error('上传头像失败:', error);
    throw error;
  }
};

// 示例5: 文件下载
export const downloadReport = async (reportId: string) => {
  try {
    await request.download(`/reports/${reportId}/download`, `report-${reportId}.pdf`);
  } catch (error) {
    console.error('下载报告失败:', error);
    throw error;
  }
};

// 示例6: 带重试的请求
export const unreliableRequest = async () => {
  try {
    const response = await request.get<any>('/unreliable-endpoint', undefined, {
      retryCount: 3, // 重试3次
      timeout: 5000, // 5秒超时
    });
    return response;
  } catch (error) {
    console.error('不稳定接口请求失败:', error);
    throw error;
  }
};

// 示例7: 并发请求
export const loadDashboardData = async () => {
  try {
    const [userStats, orderStats, productStats] = await request.all([
      request.get<any>('/stats/users'),
      request.get<any>('/stats/orders'),
      request.get<any>('/stats/products'),
    ]);

    return {
      userStats: userStats.data,
      orderStats: orderStats.data,
      productStats: productStats.data,
    };
  } catch (error) {
    console.error('加载仪表板数据失败:', error);
    throw error;
  }
};

// 示例8: 自定义拦截器使用
export const setupCustomInterceptors = () => {
  // 添加请求拦截器 - 例如添加请求ID
  const requestInterceptor = request.addRequestInterceptor(
    (config) => {
      config.headers['X-Request-ID'] = Date.now().toString();
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  // 添加响应拦截器 - 例如统一处理业务错误码
  const responseInterceptor = request.addResponseInterceptor(
    (response) => {
      if (response.data.code === 1001) {
        // 处理特定业务错误
        console.warn('业务警告:', response.data.message);
      }
      return response;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  // 返回拦截器ID，可以用于后续移除
  return { requestInterceptor, responseInterceptor };
};

// 示例9: 动态配置
export const configureRequest = () => {
  // 设置不同环境的基础URL
  const isDev = process.env.NODE_ENV === 'development';
  request.setBaseURL(isDev ? 'http://localhost:3001/api' : 'https://api.production.com');

  // 设置全局默认headers
  request.setDefaultHeader('X-Client-Version', '1.0.0');
  request.setDefaultHeader('X-Platform', 'web');

  // 设置超时时间
  request.setTimeout(15000); // 15秒
};

// 示例10: 取消请求
export const cancelableRequest = () => {
  const cancelToken = request.cancelRequest('用户主动取消');
  
  // 发起可取消的请求
  const fetchData = async () => {
    try {
      const response = await request.get('/long-running-task', undefined, {
        cancelToken: cancelToken.token
      });
      return response;
    } catch (error: any) {
      if (error.message === '用户主动取消') {
        console.log('请求已被用户取消');
      } else {
        console.error('请求失败:', error);
      }
      throw error;
    }
  };

  return { fetchData, cancel: () => cancelToken.cancel() };
}; 