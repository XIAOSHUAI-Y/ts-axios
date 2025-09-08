import Axios from "./core/Axios";
import mergeConfig from "./core/mergeConfig";
import defaults from "./defaults";
import { extend } from "./helpers/util";
import { AxiosRequestConfig, AxiosStatic } from "./types";

function createInstance(config: AxiosRequestConfig): AxiosStatic {
  // 创建一个新的 Axios 实例
  const context = new Axios(config)
  // 将 Axios 类的 request 方法与当前的 context（即 Axios 实例）绑定
  // 这样做的目的是让 `instance` 具有 `request` 方法的功能，且能够调用当前的 `context`（Axios 实例）
  const instance = Axios.prototype.request.bind(context)

  // 使用 extend 函数将 context（Axios 实例）上的所有属性和方法扩展到 instance 上
  // 这样 instance 就拥有了 Axios 实例的所有功能（例如 `get`, `post`, 等方法）
  extend(instance, context)

  // 返回扩展后的 instance，确保它是 AxiosInstance 类型
  return instance as AxiosStatic
}

// 创建一个全局的 axios 实例
const axios = createInstance(defaults)

axios.create = function create(config) {
  return createInstance(mergeConfig(defaults, config))
}

export default axios;