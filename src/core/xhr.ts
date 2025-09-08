import cookie from '../helpers/cookie';
import { createError } from '../helpers/error';
import { parseHeaders } from '../helpers/headers';
import { isURLSameOrigin } from '../helpers/url';
import { isFormData } from '../helpers/util';
import { AxiosPromise, AxiosRequestConfig, AxiosResponse } from '../types';

export default function xhr(config: AxiosRequestConfig): AxiosPromise {
	return new Promise((resolve, reject) => {
		const {
			data = null,
			url,
			method = 'get',
			headers,
			responseType,
			timeout,
			cancelToken,
			withCredentials,
			xsrfCookieName,
			xsrfHeaderName,
			onDownloadProgress,
			onUploadProgress, 
			auth,
			validateStatus,
		} = config;

		// 创建request实例
		const request = new XMLHttpRequest();

		// 初始化请求，设置请求方法和 URL，第三个参数为 true 表示异步请求
		request.open(method.toUpperCase(), url!, true)

		// 配置request对象
		configureRequest()

		// 添加事件处理函数
		addEvents()

		// 处理请求headers
		processHeaders()

		// 处理请求取消逻辑
		processCancel()

		request.send(data)

		function configureRequest(): void {
			// 如果配置中指定了响应类型，则设置 XMLHttpRequest 的响应类型
			if (responseType) {
				request.responseType = responseType;
			}

			if (timeout) {
				request.timeout = timeout;
			}

			if (withCredentials) {
				request.withCredentials = withCredentials
			}
		}

		function addEvents(): void {
			// 设置请求状态变化的回调函数
			request.onreadystatechange = function handleLoad() {
				if (request.readyState !== 4) return;

				if (request.status === 0) return;

				// 获取所有响应头
				const responseHeaders = parseHeaders(request.getAllResponseHeaders());
				// 根据响应类型获取响应数据
				const responseData =
					responseType !== 'text' ? request.response : request.responseText;
				// 构建 AxiosResponse 对象
				const response: AxiosResponse = {
					data: responseData,
					status: request.status,
					statusText: request.statusText,
					headers: responseHeaders,
					config,
					request,
				};
				// 解析 Promise，并返回响应对象
				handleResponse(response);
			}

			request.onerror = function handleError() {
				reject(createError('Network Error', config, null, request));
			};
	
			request.ontimeout = function handleTimeout() {
				reject(
					createError(
						`Timeout of ${timeout} ms exceeded`,
						config,
						'ECONNABORTED',
						request
					)
				);
			}
	
			if (onDownloadProgress) {
				request.onprogress = onDownloadProgress
			}
	
			if (onUploadProgress) {
				 request.onprogress = onUploadProgress
			}	
		}

		function processHeaders(): void {
			if (isFormData(data)) {
				delete headers['Content-Type']
			}
	
			if((withCredentials || isURLSameOrigin(url!)) && xsrfCookieName) {
				const xsrfValue = cookie.read(xsrfCookieName)
				if (xsrfValue && xsrfHeaderName) {
					headers[xsrfHeaderName] = xsrfValue
				}
			}

			if(auth) {
				headers['Authorization'] = 'Basic ' + btoa(auth.username + ':' + auth.password)
			}
	
			// 遍历请求头对象并设置请求头
			Object.keys(headers).forEach((name) => {
				// 如果数据为 null 且 Content-Type 头存在，则删除 Content-Type 头
				if (data === null && name.toLowerCase() === 'content-type') {
					delete headers[name];
				} else {
					// 设置请求头
					request.setRequestHeader(name, headers[name]);
				}
			})	
		}

		function processCancel(): void {
			if(cancelToken) {
				cancelToken.promise.then((reason: any) => {
					request.abort()
					reject(reason)
				})
			}	
		}

		function handleResponse(response: AxiosResponse): void {
			if (!validateStatus || validateStatus(response.status)) {
				resolve(response);
			} else {
				reject(
					createError(
						`Request failed with status code ${response.status}`,
						config,
						null,
						request,
						response
					)
				);
			}
		}
	});
}