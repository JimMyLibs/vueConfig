import Vue from 'vue'
import {isApp, isWechat, isAndroid, isIOS} from 'comm/utils/env'
import {p, isEmpty, deepAssign} from 'comm/utils/utils'
import {getQueryString, jsonToParams, getUrlDir} from 'comm/utils/url'


export default(vueExtends = {}, isAutoCollect = true, utm) => {
  // Vue扩展G_Utils全局工具方法对象
  Object.defineProperty(Vue.prototype, '$utils', {
    value: {
      p,
      isEmpty,
      deepAssign,
      getQueryString,
      jsonToParams,
      getUrlDir,
      isApp: isApp(),
      isWechat: isWechat(),
      isAndroid: isAndroid(),
      isIOS: isIOS()
    }
  })

  // 扩展utm埋点功能
  if (utm) {
    Object.defineProperty(Vue.prototype, '$utm', {value: utm})
    utm.device()
  }

  // 自定义扩展
  Object.keys(vueExtends).forEach(item => {
    Object.defineProperty(Vue.prototype, item, {value: vueExtends[item]})
  })

}
