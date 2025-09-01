import { AxiosPromise, AxiosRequestConfig, AxiosResponse } from "./types";

export default function xhr(config: AxiosRequestConfig): 
  AxiosPromise {
  return new Promise((resolve) => {
    const {data = null, url, method = 'get', headers, responseType } = config

    const request = new XMLHttpRequest()

    // 如果配置中指定了响应类型，则设置 XMLHttpRequest 的响应类型
    if (responseType) {
      request.responseType = responseType
    }

    // 初始化请求，设置请求方法和 URL，第三个参数为 true 表示异步请求
    request.open(method.toUpperCase(), url, true)

    // 设置请求状态变化的回调函数
    request.onreadystatechange = function handleLoad() {

      if (request.readyState !== 4) return 

      // 获取所有响应头
      const responseHeaders = request.getAllResponseHeaders()
      // 根据响应类型获取响应数据
      const responseData = responseType !== 'text' ? request.response : request.responseText
      // 构建 AxiosResponse 对象
      const response: AxiosResponse = {
        data:  responseData,
        status: request.status,
        statusText: request.statusText,
        headers: responseHeaders,
        config,
        request
      } 
      // 解析 Promise，并返回响应对象
      resolve(response)
    }

    // 遍历请求头对象并设置请求头
    Object.keys(headers).forEach((name) => {
      // 如果数据为 null 且 Content-Type 头存在，则删除 Content-Type 头
      if (data === null && name.toLowerCase() === 'content-type') {
        delete headers[name]
      } else {
        // 设置请求头
        request.setRequestHeader(name, headers[name])
      }
    })

    request.send(data)
  })
}