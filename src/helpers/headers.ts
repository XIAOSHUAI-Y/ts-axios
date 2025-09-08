import { Method } from "../types";
import { deepMerge, isPlainObject } from "./util";

// 将小写的content-type转化为Content-Type
function normalizeHeaderName (headers: any, normalizedName: string): void {
  if(!headers) return
  // 遍历 headers 对象的每个键
  Object.keys(headers).forEach((name) => {
    // 如果当前键名与标准化名称不相同，但它们的大小写相同
    if (name !== normalizedName && name.toUpperCase() === normalizedName.toUpperCase()) {
      // 将当前键的值赋给标准化名称
      headers[normalizedName] = headers[name]
      // 删除原来的键
      delete headers[name]
    }
  })
}

// 处理请求头
export function processHeaders (headers: any, data: any): any {
  // 标准化 Content-Type 请求头
  normalizeHeaderName(headers, 'Content-Type')

  if (isPlainObject(data)) {
    // 如果没有 Content-Type 请求头，则设置默认值
    if(headers && !headers['Content-Type']) {
      headers['Content-Type'] = 'application/json;charset=utf-8'
    }
  }
  return headers
}

// 解析 HTTP 响应头字符串
export function parseHeaders(headers: string): any {
  // 创建一个空对象用于存储解析后的请求头
  let parsed = Object.create(null)
  // 如果没有提供头部字符串，返回空对象
  if (!headers) {
    return parsed
  }

  // 将头部字符串按行分割，并遍历每一行
  headers.split('\r\n').forEach((line) => {
    // 将每一行按冒号分割为键值对
    let [key, val] = line.split(':')
    // 对键进行修剪并转为小写
    key = key.trim().toLowerCase()
    // 如果没有键，则跳过该行
    if (!key) {
      return 
    }
    if(val) {
      //去除开头和结尾的空白字符
      val = val.trim()
    }
    parsed[key] = val
  })
  return parsed
}

export function flattenHeaders(headers: any, method: Method): any {
  if (!headers) {
    return headers
  }

  headers = deepMerge(headers.common, headers[method], headers)

  const methodsToDelete = ['delete', 'get', 'head', 'options', 'post', 'put', 'patch', 'common']

  methodsToDelete.forEach(method => {
    delete headers[method]
  })

  return headers
}