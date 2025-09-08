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

// 判断是否为普通对象
export function isPlainObject(val: any): val is Object {
  return toString.call(val) === '[object Object]'
}

// extend 函数用于将一个对象的属性合并到另一个对象中，返回合并后的对象。
// 泛型 T 和 U 表示目标对象和源对象的类型，返回类型是这两者类型的交叉类型（T & U）。
export function extend<T, U>(to: T, from: U): T & U {
  // 遍历源对象 from 的所有属性
  for (const key in from) {
    // 将源对象 from 中的每个属性赋值给目标对象 to
    // 使用类型断言将目标对象强制转换为 T & U 以便可以访问所有的属性
    // 注意：这里的 `key` 是从 `from` 中动态获取的属性名
    (to as T & U)[key] = from[key] as any
  }
  // 返回合并后的目标对象，目标对象的类型为 T & U，即包含了源对象和目标对象的所有属性
  return to as T & U
}

export function deepMerge(...objs: any[]): any {
  const result = Object.create(null)

  objs.forEach(obj => {
    if (obj) {
      Object.keys(obj).forEach(key => {
        const val = obj[key]
        if (isPlainObject(val)) {
          if (isPlainObject(result[key])) {
            result[key] = deepMerge(result[key], val)
          } else {
            result[key] = deepMerge(val)
          }
        } else {
          result[key] = val
        }
      })
    }
  })
  return result
}