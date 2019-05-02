import FetchBase from 'comm/utils/core/FetchBase'
import {
  apiUrl
} from 'config/comm'

// 存储api数据的sessionStorage标识
const apiInfoSessionId = '__apiInfoSessionId__'

const http = new FetchBase()

// 获取接口地址信息， 类似下述devApiInfo
export function getApiInfo() {
  return new Promise((resolve, reject) => {
    let sessionInfo = JSON.parse(sessionStorage.getItem(apiInfoSessionId))
    if (sessionInfo) {
      resolve(sessionInfo)
    } else {
      http.toGet(apiUrl).then(res => {
        setApiInfo(res)
        resolve(res)
      }).catch(reson => {
        reject(reson)
      })
    }
  })
}

/**
 * [setApiInfo 存储apiInfo信息]
 * @param {Object} [info={}] [apiInfo信息]
 */
export function setApiInfo(info = {}) {
  sessionStorage.setItem(apiInfoSessionId, JSON.stringify(info))
}
