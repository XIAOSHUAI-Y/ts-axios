// 用于判断值是否为日期对象的工具函数
const toString = Object.prototype.toString;

// 判断给定的值是否为 Date 类型(val is Date进行类型保护)
export function isDate(val: any): val is Date {
  return toString.call(val) === '[object Date]';
}

// 判断给定的值是否为对象
export function isObject(val: any): val is Object {
  return val !== null && typeof val === 'object';
}