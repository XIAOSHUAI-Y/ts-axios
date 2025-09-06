import { Method } from './../types/index';
import { AxiosPromise, AxiosRequestConfig } from "../types";
import dispatchRequest from "./dispatchRequest";

export default class Axios {
  // 发起请求的通用方法
  request(config: AxiosRequestConfig): AxiosPromise {
    return dispatchRequest(config)
  }

  // GET 请求，通常用于获取资源
  get(url: string, config?: AxiosRequestConfig): AxiosPromise {
    return this._requestMethodWithoutData('get', url, config)
  }

  // DELETE 请求，用于删除指定资源
  delete(url: string, config?: AxiosRequestConfig): AxiosPromise {
    return this._requestMethodWithoutData('delete', url, config)
  }

  // HEAD 请求，类似 GET 请求，但不返回响应体，通常用于检查资源的头信息
  head(url: string, config?: AxiosRequestConfig): AxiosPromise {
    return this._requestMethodWithoutData('head', url, config)
  }

  // OPTIONS 请求，用于查询支持的 HTTP 方法和其他信息
  options(url: string, config?: AxiosRequestConfig): AxiosPromise {
    return this._requestMethodWithoutData('options', url, config)
  }

  // POST 请求，用于提交数据
  post(url: string, data?: any, config?: AxiosRequestConfig): AxiosPromise {
    return this._requestMethodWithData('post', url, data, config)
  }

  // PUT 请求，用于更新资源
  put(url: string, data?: any, config?: AxiosRequestConfig): AxiosPromise {
    return this._requestMethodWithData('put', url, data, config)
  }

  // PATCH 请求，用于部分更新资源
  patch(url: string, data?: any, config?: AxiosRequestConfig): AxiosPromise {
    return this._requestMethodWithData('patch', url, data, config)
  }

  // 内部方法，处理没有请求体的数据请求（如 GET、DELETE 等）
  _requestMethodWithoutData(method: Method, url: string, config?: AxiosRequestConfig): AxiosPromise {
    return this.request(Object.assign(config || {}, { // 合并配置并发起请求
      method,  // HTTP 方法
      url,     // 请求的 URL
    }));
  }

 // 内部方法，处理需要请求体的数据请求（如 POST、PUT、PATCH 等）
  _requestMethodWithData(method: Method, url: string, data?: any, config?: AxiosRequestConfig): AxiosPromise {
    return this.request(Object.assign(config || {}, { // 合并配置并发起请求
      method,  // HTTP 方法
      url,     // 请求的 URL
      data     // 请求的数据体（如果有的话）
    }));
  }
}