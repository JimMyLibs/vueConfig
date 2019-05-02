/**
 * H5与你我金融APP交互基类，实际使用可根据实际情况扩展
 */

import {
  isApp,
  isAndroid,
  isIOS,
  getAppVersion
} from 'comm/utils/env'
import {
  createRandomId,
  p
} from 'comm/utils/utils'

declare const window: { [propName: string]: any }

// 请求基类，可根据实际需要进行扩展
export default class NativeBridge {
  nativePromise: any
  constructor() {
    this.nativePromise = null

    // 初始化，ios中需先执行bridge.init
    this.init()
  }

  // 初始化操作
  init() {
    this.nativePromise = new Promise((resolve, reject) => {
      function initJavascriptBridge(bridge: any) {
        bridge.registerHandler('JS Echo', (data: any, responseCallback: (data: any) => void) => {
          p('JS Echo called with:', data)
          responseCallback(data)
        })
        bridge.callHandler('ObjC Echo', {
          'key': 'value'
        }, (responseData: any) => {
          p('JS received response:', responseData)
        })
        resolve()
      }

      if (isApp()) {
        if (isIOS()) {
          this.connectWebViewJavascriptBridge(initJavascriptBridge)
        } else {
          resolve()
        }
      } else {
        reject('not in niiwoo ios')
      }
    })

    this.nativePromise.catch((e: any) => {
      p(e)
    })

  }

  /**
   * action 交互入口
   * @param {string} eventName 请求方法名，具体根据相关交互文档而定
   * @param {object} body 调用方法所需参数，具体根据相关交互文档而定
   */
  action(eventName: string, body = {}) {
    return this.nativePromise.then(() => {
      return new Promise((resolve, reject) => {
        // 生成不重复随机函数名
        let tempFnName: string = `_bridge_fn_${createRandomId()}`

        // 注册window回调事件
        window[tempFnName] = function (result: any) {
          // window[tempFnName] = null
          if (typeof result === 'string') {
            resolve(JSON.parse(result))
          } else {
            resolve(result)
          }
        }

        // 通过WebViewJavascriptBridge对象注册回调事件
        function registerJavascriptBridge(bridge: any) {
          if (isAndroid()) {
            bridge.callHandler(eventName, JSON.stringify(body), tempFnName)
          } else {
            bridge.callHandler(eventName, body, window[tempFnName])
          }
        }
        this.connectWebViewJavascriptBridge(registerJavascriptBridge)
      })
    })
  }

  /**
   * [setAction H5设置方法供客户端调用]
   * @param {[String]}   fnName   [提供客户端调用的函数名, 需与客户端协商]
   * @param {Function} callback [客户单调用执行的H5操作函数]
   */
  setAction(fnName: string, callback: any) {
    if (isAndroid()) {
      window[fnName] = (data: any) => {
        callback(data)
      }
    } else if (isIOS()) {
      this.connectWebViewJavascriptBridge((bridge: any) => {
        bridge.registerHandler(fnName, function (data: any, responseCallback: any) {
          callback(data)
        })
      })
    } else {
      p('not in niiwoo')
    }
  }


  // 获取WebViewJavascriptBridge对象
  connectWebViewJavascriptBridge(callback: any) {
    if (window.WebViewJavascriptBridge) {
      return callback(window.WebViewJavascriptBridge)
    }
    if (window.WVJBCallbacks) {
      return window.WVJBCallbacks.push(callback)
    }
    window.WVJBCallbacks = [callback]
    let WVJBIframe = document.createElement('iframe')
    WVJBIframe.style.display = 'none'
    WVJBIframe.src = 'https://__bridge_loaded__'
    document.documentElement.appendChild(WVJBIframe)
    setTimeout(function () {
      document.documentElement.removeChild(WVJBIframe)
    }, 0)
  }

  // 获取当前app版本，如5.5.8
  getVersion() {
    return getAppVersion()
  }
}