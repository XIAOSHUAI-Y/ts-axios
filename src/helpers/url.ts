import { isDate, isPlainObject, isURLSearchParams } from './util';

interface URLOrigin {
	protocol: string;
	host: string;
}

// 对字符串进行 URL 编码
function encode(val: string): string {
	return encodeURIComponent(val)
		.replace(/%40/g, '@') // 替换 %40 为 @
		.replace(/%3A/gi, ':') // 替换 %3A 为 :
		.replace(/%24/g, '$') // 替换 %24 为 $
		.replace(/%2C/gi, ',') // 替换 %2C 为 ,
		.replace(/%20/g, '+') // 替换 %20 为 +
		.replace(/%5B/gi, '[') // 替换 %5B 为 [
		.replace(/%5D/gi, ']'); // 替换 %5D 为 ]
}

// 构建带有查询参数的 URL
export function buildURL(
	url: string,
	params?: any,
	paramsSerializer?: (params: any) => string
): string {
	// 如果没有参数，直接返回原始 URL
	if (!params) {
		return url;
	}

  let serializedParams

  if (paramsSerializer) {
    serializedParams = paramsSerializer(params)
  } else if(isURLSearchParams(params)) {
    serializedParams = params.toString()
  } else {
    const parts: string[] = []; // 用于存储序列化的参数

    // 遍历参数对象的每个键
    Object.keys(params).forEach((key) => {
      const val = params[key]; // 获取当前键的值
      // 跳过 null 和 undefined 的值
      if (val === null || typeof val === 'undefined') return;

      let values = []; // 用于存储当前键的值
      if (Array.isArray(val)) {
        // 如果值是数组，追加 [] 到键名
        values = val;
        key += '[]';
      } else {
        values = [val]; // 否则将值包装成数组
      }

      // 对每个值进行编码并添加到参数部分
      values.forEach((val) => {
        if (isDate(val)) {
          // 如果值是日期，转换为 ISO 字符串
          val = val.toISOString();
        } else if (isPlainObject(val)) {
          // 如果值是对象，转换为 JSON 字符串
          val = JSON.stringify(val);
        }
        // 将编码后的键值对添加到 parts 数组
        parts.push(`${encode(key)}=${encode(val)}`);
      });
    });
    // 将参数部分连接成查询字符串
    serializedParams = parts.join('&')
  }

	if (serializedParams) {
		// 查找 URL 中的哈希标记
		const markIndex = url.indexOf('#');
		if (markIndex !== -1) {
			// 如果存在哈希标记，截断 URL
			url = url.slice(0, markIndex);
		}
		// 将序列化的参数附加到 URL，处理已有的查询字符串
		url += (url.indexOf('?') === -1 ? '?' : '&') + serializedParams;
	}

	return url; // 返回最终的 URL
}

// 判断是否是同域
export function isURLSameOrigin(requestURL: string): boolean {
	const parsedOrigin = resolveURL(requestURL);
	return (
		parsedOrigin.protocol === currentOrigin.protocol &&
		parsedOrigin.host === currentOrigin.host
	);
}

const urlParsingNode = document.createElement('a');
const currentOrigin = resolveURL(window.location.href);

function resolveURL(url: string): URLOrigin {
	urlParsingNode.setAttribute('href', url);
	const { protocol, host } = urlParsingNode;

	return {
		protocol,
		host,
	};
}
