/**
 * [fetchPromise fetch请求]
 * [timeout 超时时间]
 * @promise {[promise Promise.race 谁先跑出结果（成功或失败）就采纳谁]}
 */
export default(fetchPromise, timeout = 10000) => {
  return Promise.race([
    fetchPromise,
    new Promise((resolve, reject) => {
      setTimeout(() => {
        reject('请求超时')
      }, timeout)
    })
  ])
}
