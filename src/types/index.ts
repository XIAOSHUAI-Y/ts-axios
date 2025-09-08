export type Method = 'get' | 'GET'
| 'delete' | 'DELETE'
| 'head' | 'HEAD'
| 'options' | 'OPTIONS'
| 'post' | 'POST'
| 'put' | 'PUT'
| 'patch' | 'PATCH'

export interface AxiosRequestConfig {
  url?: string
  method?: Method
  data?: any
  params?: any
  headers?: any
  responseType?: XMLHttpRequestResponseType
  timeout?: number
  transformRequest?: AxiosTransformer | AxiosTransformer[]
  transformResponse?: AxiosTransformer | AxiosTransformer[]
  CancelToken?: CancelToken

  [propName: string]: any
}

export interface AxiosResponse<T=any> {
  data: T
  status: number
  statusText: string
  headers: any
  config: AxiosRequestConfig
  request: any
}

export interface AxiosPromise<T=any> extends 
  Promise<AxiosResponse<T>> {
}

export interface AxiosError extends Error {
  isAxiosError: boolean
  config: AxiosRequestConfig
  code?: string | null
  request?: any
  response?: AxiosResponse
}

export interface Axios {
  defaults: AxiosRequestConfig
  interceptors: {
    request: AxiosInterceptorManager<AxiosRequestConfig>
    response: AxiosInterceptorManager<AxiosResponse>
  }
  request<T=any>(config: AxiosRequestConfig): AxiosPromise<T>

  get<T=any>(url: string, config?: AxiosRequestConfig): AxiosPromise<T>

  delete<T=any>(url: string, config?: AxiosRequestConfig): AxiosPromise<T>

  head<T=any>(url: string, config?: AxiosRequestConfig): AxiosPromise<T>

  options<T=any>(url: string, config?: AxiosRequestConfig): AxiosPromise<T>

  post<T=any>(url: string, data?: any, config?: AxiosRequestConfig): AxiosPromise<T>

  put<T=any>(url: string, data?: any, config?: AxiosRequestConfig): AxiosPromise<T>

  patch<T=any>(url: string, data?: any, config?: AxiosRequestConfig): AxiosPromise<T>
}

// AxiosInstance这个接口是一个混合对象本身有函数又继承了很多方法
export interface AxiosInstance extends Axios{
  <T=any>(config: AxiosRequestConfig): AxiosPromise<T>

  <T=any>(url: string, config?: AxiosRequestConfig): AxiosPromise<T>
}

export interface AxiosStatic extends AxiosInstance {
  create(config?: AxiosRequestConfig): AxiosInstance
}

export interface AxiosStatic extends AxiosInstance {
  create(config?: AxiosRequestConfig): AxiosInstance

  CancelToken: CancelTokenStatic
  Cancel: CancelStatic
  isCancel: (value: any) => boolean
}

export interface AxiosInterceptorManager<T> {
  // 添加拦截器, 返回拦截器id
  use(resolve: ResolvedFn<T>, reject: RejectedFn): number

  // 删除拦截器，根据拦截器id删除拦截器
  eject(id: number): void
}

export interface ResolvedFn<T> {
  (val: T): T | Promise<T>
}

export interface RejectedFn {
  (error: any): any
}

export interface AxiosTransformer {
	(data: any, headers?: any): any
}

export interface CancelToken {
  promise: Promise<Cancel>
  reason?: Cancel

  throwIfRequested(): void
}

export interface Canceler {
  (message?: string): void
}

export interface CancelExecutor {
  (cancel: Canceler): void
}

// 定义 CancelTokenSource 接口，表示一个取消源
// 其中包含一个 CancelToken 和一个 Canceler
export interface CancelTokenSource {
  // 一个 CancelToken 对象
  token: CancelToken

  // 一个 Canceler 函数，允许调用者取消操作
  cancel: Canceler
}

// 定义 CancelTokenStatic 接口，表示 CancelToken 类的构造函数
// 该构造函数接受一个 CancelExecutor 类型的参数并返回一个 CancelToken 对象
export interface CancelTokenStatic {
  // 创建一个新的 CancelToken 实例
  new(executor: CancelExecutor): CancelToken

  // 创建一个 CancelTokenSource 实例，返回一个对象包含 token 和 cancel
  source(): CancelTokenSource
}

export interface Cancel {
  message?: string
}

export interface CancelStatic {
  new(message?: string): Cancel
}