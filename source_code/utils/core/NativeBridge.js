// H5与你我金融交互基类NativeBridge

import {createRandomId, isInNiiwooApp, isAndroid, isIOS, p} from 'utils/utils'

// 请求基类，可根据实际需要进行扩展
export default class NativeBridge {
  constructor() {
    this.nativePromise = null
    // 初始化，ios中执行bridge.init
    this.init()
  }

  init() {
    // 获取api信息，并存储
    this.nativePromise = new Promise((resolve, reject) => {
      function initJavascriptBridge(bridge) {
        bridge.registerHandler('JS Echo', (data, responseCallback)=> {
          p('JS Echo called with:', data)
          responseCallback(data)
        })
        bridge.callHandler('ObjC Echo', {
          'key': 'value'
        }, responseData => {
          p('JS received response:', responseData)
        })
        resolve()
      }

      if (isInNiiwooApp()) {
        if (isIOS()) {
          this.connectWebViewJavascriptBridge(initJavascriptBridge)
        } else {
          resolve()
        }
      } else {
        reject('not in niiwoo ios')
      }
    })

    this.nativePromise.catch(e => {
      p(e)
    })

  }

  // 交互统一入口
  // actionName为事件代码，data为json参数
  action(actionName, data) {
    // 获取转换后的actionName及data
    return this.toAction(actionName, data)
  }

  toAction(realCode, realData = {}) {
    return this.nativePromise.then(() => {
      return new Promise((resolve, reject) => {

        // 生成不重复随机函数名
        let tempFnName = '_bridge_fn_' + createRandomId()

        // 注册window回调事件
        window[tempFnName] = function(result) {
          // window[tempFnName] = null
          if (typeof result == 'string') {
            resolve(JSON.parse(result))
          } else {
            resolve(result)
          }

        }

        // 通过WebViewJavascriptBridge对象注册回调事件
        function registerJavascriptBridge(bridge) {
          if (isAndroid()) {
            bridge.callHandler(realCode, JSON.stringify(realData), tempFnName)
          } else {
            bridge.callHandler(realCode, realData, window[tempFnName])
          }
        }
        this.connectWebViewJavascriptBridge(registerJavascriptBridge)
      })
    })
  }

  // 获取WebViewJavascriptBridge对象
  connectWebViewJavascriptBridge(callback) {
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
    setTimeout(function() {
      document.documentElement.removeChild(WVJBIframe)
    }, 0)
  }
}
