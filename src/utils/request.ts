import axios, { 
  AxiosInstance, 
  AxiosRequestConfig, 
  AxiosResponse, 
  AxiosError,
  InternalAxiosRequestConfig 
} from 'axios';

// 请求配置接口
interface RequestConfig extends AxiosRequestConfig {
  showError?: boolean; // 是否显示错误提示
  showLoading?: boolean; // 是否显示加载状态
  retryCount?: number; // 重试次数
}

// API响应接口
interface ApiResponse<T = any> {
  data: T;
  code: number;
  message: string;
  success: boolean;
}

// 错误响应接口
interface ErrorResponse {
  code: number;
  message: string;
  success: false;
}

class Request {
  private instance: AxiosInstance;
  private requestInterceptors: number[] = [];
  private responseInterceptors: number[] = [];
  
  constructor(baseURL: string = 'http://localhost:3001/api') {
    this.instance = axios.create({
      baseURL,
      timeout: 10000, // 10秒超时
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  /**
   * 设置拦截器
   */
  private setupInterceptors() {
    // 请求拦截器
    const requestInterceptor = this.instance.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        // 添加认证token
        const token = this.getToken();
        if (token && config.headers) {
          config.headers['Authorization'] = `Bearer ${token}`;
        }

        // 处理FormData
        if (config.data instanceof FormData && config.headers) {
          delete config.headers['Content-Type'];
        }

        console.log(`[请求] ${config.method?.toUpperCase()} ${config.url}`, config.data || config.params);
        return config;
      },
      (error: AxiosError) => {
        console.error('[请求错误]', error);
        return Promise.reject(error);
      }
    );

    // 响应拦截器
    const responseInterceptor = this.instance.interceptors.response.use(
      (response: AxiosResponse<ApiResponse>) => {
        console.log(`[响应] ${response.config.method?.toUpperCase()} ${response.config.url}`, response.data);
        
        // 如果后端返回的不是标准格式，进行转换
        if (response.data && typeof response.data === 'object') {
          if (!('success' in response.data)) {
            response.data = {
              data: response.data,
              code: 200,
              message: 'success',
              success: true
            };
          }
        }

        return response;
      },
      async (error: AxiosError) => {
        const { response, config } = error;
        
        console.error('[响应错误]', error);

        // 处理不同的HTTP状态码
        if (response) {
          const status = response.status;
          let message = '请求失败';

          switch (status) {
            case 400:
              message = '请求参数错误';
              break;
            case 401:
              message = '未授权，请重新登录';
              // 可以在这里触发登出逻辑
              this.handleUnauthorized();
              break;
            case 403:
              message = '拒绝访问';
              break;
            case 404:
              message = '请求地址不存在';
              break;
            case 408:
              message = '请求超时';
              break;
            case 500:
              message = '服务器内部错误';
              break;
            case 502:
              message = '网关错误';
              break;
            case 503:
              message = '服务不可用';
              break;
            case 504:
              message = '网关超时';
              break;
            default:
              message = `连接错误 ${status}`;
          }

          // 尝试从响应中获取后端返回的错误信息
          const responseData = response.data as any;
          if (responseData?.message) {
            message = responseData.message;
          }

          const errorResponse: ErrorResponse = {
            code: status,
            message,
            success: false
          };

          return Promise.reject(errorResponse);
        }

        // 网络错误或其他错误
        if (error.code === 'ECONNABORTED') {
          return Promise.reject({
            code: 408,
            message: '请求超时',
            success: false
          });
        }

        // 重试逻辑
        const retryConfig = config as RequestConfig;
        if (retryConfig?.retryCount && retryConfig.retryCount > 0) {
          retryConfig.retryCount--;
          console.log(`[重试] 剩余重试次数: ${retryConfig.retryCount}`);
          return this.instance.request(retryConfig);
        }

        return Promise.reject({
          code: 0,
          message: error.message || '网络连接异常',
          success: false
        });
      }
    );

    this.requestInterceptors.push(requestInterceptor);
    this.responseInterceptors.push(responseInterceptor);
  }

  /**
   * 处理401未授权
   */
  private handleUnauthorized() {
    // 清除本地存储的token
    localStorage.removeItem('auth-storage');
    
    // 可以在这里添加跳转到登录页的逻辑
    // window.location.href = '/login';
  }

  /**
   * 获取存储的token
   */
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

  /**
   * 通用请求方法
   */
  private async request<T>(config: RequestConfig): Promise<ApiResponse<T>> {
    try {
      const response = await this.instance.request<ApiResponse<T>>(config);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * GET请求
   */
  get<T>(url: string, params?: any, config?: RequestConfig): Promise<ApiResponse<T>> {
    return this.request<T>({
      ...config,
      method: 'GET',
      url,
      params,
    });
  }

  /**
   * POST请求
   */
  post<T>(url: string, data?: any, config?: RequestConfig): Promise<ApiResponse<T>> {
    return this.request<T>({
      ...config,
      method: 'POST',
      url,
      data,
    });
  }

  /**
   * PUT请求
   */
  put<T>(url: string, data?: any, config?: RequestConfig): Promise<ApiResponse<T>> {
    return this.request<T>({
      ...config,
      method: 'PUT',
      url,
      data,
    });
  }

  /**
   * DELETE请求
   */
  delete<T>(url: string, config?: RequestConfig): Promise<ApiResponse<T>> {
    return this.request<T>({
      ...config,
      method: 'DELETE',
      url,
    });
  }

  /**
   * PATCH请求
   */
  patch<T>(url: string, data?: any, config?: RequestConfig): Promise<ApiResponse<T>> {
    return this.request<T>({
      ...config,
      method: 'PATCH',
      url,
      data,
    });
  }

  /**
   * 上传文件
   */
  upload<T>(url: string, file: File | FormData, config?: RequestConfig): Promise<ApiResponse<T>> {
    const formData = file instanceof File ? new FormData() : file;
    if (file instanceof File) {
      formData.append('file', file);
    }

    return this.request<T>({
      ...config,
      method: 'POST',
      url,
      data: formData,
      headers: {
        'Content-Type': 'multipart/form-data',
        ...config?.headers,
      },
    });
  }

  /**
   * 下载文件
   */
  download(url: string, filename?: string, config?: RequestConfig): Promise<void> {
    return this.request({
      ...config,
      method: 'GET',
      url,
      responseType: 'blob',
    }).then((response: any) => {
      const blob = new Blob([response.data]);
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = filename || 'download';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);
    });
  }

  /**
   * 并发请求
   */
  all<T>(requests: Promise<ApiResponse<T>>[]): Promise<ApiResponse<T>[]> {
    return Promise.all(requests);
  }

  /**
   * 设置默认配置
   */
  setDefaultConfig(config: Partial<AxiosRequestConfig>) {
    Object.assign(this.instance.defaults, config);
  }

  /**
   * 设置基础URL
   */
  setBaseURL(baseURL: string) {
    this.instance.defaults.baseURL = baseURL;
  }

  /**
   * 设置超时时间
   */
  setTimeout(timeout: number) {
    this.instance.defaults.timeout = timeout;
  }

  /**
   * 设置默认headers
   */
  setDefaultHeader(key: string, value: string) {
    this.instance.defaults.headers.common[key] = value;
  }

  /**
   * 移除默认header
   */
  removeDefaultHeader(key: string) {
    delete this.instance.defaults.headers.common[key];
  }

  /**
   * 添加请求拦截器
   */
  addRequestInterceptor(
    fulfilled: (value: InternalAxiosRequestConfig) => InternalAxiosRequestConfig | Promise<InternalAxiosRequestConfig>,
    rejected?: (error: any) => any
  ): number {
    const interceptorId = this.instance.interceptors.request.use(fulfilled, rejected);
    this.requestInterceptors.push(interceptorId);
    return interceptorId;
  }

  /**
   * 添加响应拦截器
   */
  addResponseInterceptor(
    fulfilled: (value: AxiosResponse) => AxiosResponse | Promise<AxiosResponse>,
    rejected?: (error: any) => any
  ): number {
    const interceptorId = this.instance.interceptors.response.use(fulfilled, rejected);
    this.responseInterceptors.push(interceptorId);
    return interceptorId;
  }

  /**
   * 移除请求拦截器
   */
  removeRequestInterceptor(interceptorId: number) {
    this.instance.interceptors.request.eject(interceptorId);
    const index = this.requestInterceptors.indexOf(interceptorId);
    if (index > -1) {
      this.requestInterceptors.splice(index, 1);
    }
  }

  /**
   * 移除响应拦截器
   */
  removeResponseInterceptor(interceptorId: number) {
    this.instance.interceptors.response.eject(interceptorId);
    const index = this.responseInterceptors.indexOf(interceptorId);
    if (index > -1) {
      this.responseInterceptors.splice(index, 1);
    }
  }

  /**
   * 取消请求
   */
  cancelRequest(message?: string) {
    const source = axios.CancelToken.source();
    source.cancel(message || '请求已取消');
    return source;
  }

  /**
   * 获取axios实例
   */
  getInstance(): AxiosInstance {
    return this.instance;
  }
}

// 创建默认实例
const request = new Request();

export default request;
export { Request };
export type { ApiResponse, RequestConfig, ErrorResponse }; 