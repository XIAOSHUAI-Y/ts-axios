import Axios from "./core/Axios";
import { extend } from "./helpers/util";
import { AxiosInstance } from "./types";

// 创建一个 Axios 实例的工厂函数
function createInstance(): AxiosInstance {
  // 创建一个新的 Axios 实例
  const context = new Axios()
  // 将 Axios 类的 request 方法与当前的 context（即 Axios 实例）绑定
  // 这样做的目的是让 `instance` 具有 `request` 方法的功能，且能够调用当前的 `context`（Axios 实例）
  const instance = Axios.prototype.request.bind(context)

  // 使用 extend 函数将 context（Axios 实例）上的所有属性和方法扩展到 instance 上
  // 这样 instance 就拥有了 Axios 实例的所有功能（例如 `get`, `post`, 等方法）
  extend(instance, context)

  // 返回扩展后的 instance，确保它是 AxiosInstance 类型
  return instance as AxiosInstance
}

// 创建一个全局的 axios 实例
const axios = createInstance()

export default axios;