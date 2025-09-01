import { buildURL } from "./helpers/url"
import { transformRequest } from "./helpers/data"
import { AxiosPromise, AxiosRequestConfig, AxiosResponse } from "./types"
import xhr from "./xhr"
import { processHeaders } from "./helpers/headers"


function axios(config: AxiosRequestConfig): AxiosPromise {
  processConfig(config)
  return xhr(config).then((res) => {
    return transformResponseData(res)
  })
}

function processConfig(config: AxiosRequestConfig): void {
  config.url = transformURL(config)
  config.headers = transformHeaders(config)
  config.data = transformRequestData(config)
}

function transformURL(config: AxiosRequestConfig): string {
  const {url, params} = config
  return buildURL(url, params)
}

function transformRequestData (config: AxiosRequestConfig): any {
  return transformRequest(config.data)
}

// 定义 transformHeaders 函数，用于处理请求头
function transformHeaders (config: AxiosRequestConfig): any {
  // 从配置中解构出 headers 和 data，默认 headers 为空对象
  const {headers = {}, data} = config
  return processHeaders(headers, data)
}

function transformResponseData(res: AxiosResponse): AxiosResponse {
  res.data = transformRequest(res.data)
  return res
}

export default axios