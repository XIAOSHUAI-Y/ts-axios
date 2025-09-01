import { isPlainObject } from "./util";

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