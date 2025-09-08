import { buildURL } from "../helpers/url"
import { transformRequest } from "../helpers/data"
import { AxiosPromise, AxiosRequestConfig, AxiosResponse } from "../types"
import xhr from "./xhr"
import { flattenHeaders, processHeaders } from "../helpers/headers"
import transform from "./transform"


export default function dispatchRequest(config: AxiosRequestConfig): AxiosPromise {
  throwCancellationRequested(config)
  processConfig(config)
  return xhr(config).then((res) => {
    return transformResponseData(res)
  })
}

function processConfig(config: AxiosRequestConfig): void {
	config.url = transformURL(config);
	config.data = transform(
		config.data,
		config.headers,
		config.transformRequest!
	);
	config.headers = flattenHeaders(config.headers, config.method!);
}

function transformURL(config: AxiosRequestConfig): string {
  const {url, params} = config
  return buildURL(url!, params)
}

function transformResponseData(res: AxiosResponse): AxiosResponse {
    res.data = transform(res.data, res.headers, res.config.transformResponse!);
    return res;
}

function throwCancellationRequested(config: AxiosRequestConfig): void {
	if(config.cancelToken) {
		config.cancelToken.throwIfRequested()
	}
}
