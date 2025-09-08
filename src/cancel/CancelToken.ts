import { CancelExecutor, CancelTokenSource, Canceler } from "../types"
import Cancel from "./Cancel"

interface ResolvePromise {
  (reason?: Cancel): void
}

export default class CancelToken {
  promise: Promise<Cancel>

  // 用于存储取消操作的原因
  reason?: Cancel

  // 构造函数接收一个 CancelExecutor 类型的 executor 参数
  constructor(executor: CancelExecutor) {
    let resolvePromise: ResolvePromise

    // 创建一个 Promise，并将 resolve 函数赋给 resolvePromise
    this.promise = new Promise<Cancel>(resolve => {
      resolvePromise = resolve as ResolvePromise
    })

    // 执行传入的 executor 函数，该函数接收一个消息处理函数作为参数
    executor(message => {
      // 如果 reason 已经存在，说明已经取消过了，直接返回不再执行
      if (this.reason) {
        return 
      }
      // 如果 reason 已经存在，说明已经取消过了，直接返回不再执行
      this.reason = new Cancel(message)
      // 调用 resolvePromise，传入取消的原因
      resolvePromise(this.reason)
    })
  }

  throwIfRequested() {
    if (this.reason) {
      throw this.reason
    }
  }

  static source(): CancelTokenSource {
    let cancel!: Canceler
    const token = new CancelToken(c => {
      cancel = c
    })
    return {
      cancel,
      token
    }
  }
}