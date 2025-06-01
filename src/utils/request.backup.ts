interface RequestConfig {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  headers?: Record<string, string>;
  body?: any;
  timeout?: number;
}

interface ApiResponse<T = any> {
  data: T;
  code: number;
  message: string;
  success: boolean;
}

class Request {
  private baseURL: string;
  private defaultHeaders: Record<string, string>;
  private timeout: number;

  constructor(baseURL: string = 'http://localhost:3001/api') {
    this.baseURL = baseURL;
    this.defaultHeaders = {
      'Content-Type': 'application/json',
    };
    this.timeout = 10000; // 10秒超时
  }

  private async request<T>(url: string, config: RequestConfig = {}): Promise<ApiResponse<T>> {
    const {
      method = 'GET',
      headers = {},
      body,
      timeout = this.timeout,
    } = config;

    // 处理URL
    const fullURL = url.startsWith('http') ? url : `${this.baseURL}${url}`;

    // 处理headers
    const finalHeaders = {
      ...this.defaultHeaders,
      ...headers,
    };

    // 添加认证token
    const token = this.getToken();
    if (token) {
      finalHeaders['Authorization'] = `Bearer ${token}`;
    }

    // 处理body
    let finalBody: string | FormData | undefined;
    if (body) {
      if (body instanceof FormData) {
        finalBody = body;
        delete finalHeaders['Content-Type']; // 让浏览器自动设置
      } else {
        finalBody = JSON.stringify(body);
      }
    }

    // 创建AbortController用于超时控制
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      const response = await fetch(fullURL, {
        method,
        headers: finalHeaders,
        body: finalBody,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      // 处理响应
      if (!response.ok) {
        throw new Error(`HTTP Error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      clearTimeout(timeoutId);
      
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          throw new Error('请求超时');
        }
        throw error;
      }
      throw new Error('未知错误');
    }
  }

  // GET请求
  get<T>(url: string, config?: Omit<RequestConfig, 'method' | 'body'>): Promise<ApiResponse<T>> {
    return this.request<T>(url, { ...config, method: 'GET' });
  }

  // POST请求
  post<T>(url: string, data?: any, config?: Omit<RequestConfig, 'method'>): Promise<ApiResponse<T>> {
    return this.request<T>(url, { ...config, method: 'POST', body: data });
  }

  // PUT请求
  put<T>(url: string, data?: any, config?: Omit<RequestConfig, 'method'>): Promise<ApiResponse<T>> {
    return this.request<T>(url, { ...config, method: 'PUT', body: data });
  }

  // DELETE请求
  delete<T>(url: string, config?: Omit<RequestConfig, 'method' | 'body'>): Promise<ApiResponse<T>> {
    return this.request<T>(url, { ...config, method: 'DELETE' });
  }

  // PATCH请求
  patch<T>(url: string, data?: any, config?: Omit<RequestConfig, 'method'>): Promise<ApiResponse<T>> {
    return this.request<T>(url, { ...config, method: 'PATCH', body: data });
  }

  // 设置默认headers
  setDefaultHeader(key: string, value: string) {
    this.defaultHeaders[key] = value;
  }

  // 移除默认header
  removeDefaultHeader(key: string) {
    delete this.defaultHeaders[key];
  }

  // 获取token
  private getToken(): string | null {
    try {
      const authData = localStorage.getItem('auth-storage');
      if (authData) {
        const parsed = JSON.parse(authData);
        return parsed.state?.token || null;
      }
    } catch {
      // ignore
    }
    return null;
  }

  // 设置基础URL
  setBaseURL(baseURL: string) {
    this.baseURL = baseURL;
  }

  // 设置超时时间
  setTimeout(timeout: number) {
    this.timeout = timeout;
  }
}

// 创建默认实例
const request = new Request();

export default request;
export { Request };
export type { ApiResponse, RequestConfig };