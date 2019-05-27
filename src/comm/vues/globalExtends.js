import Vue from 'vue'
import { isApp, isWechat, isAndroid, isIOS } from 'comm/js/env/env'
import { p, isEmpty, deepAssign } from 'comm/js/utils/utils'
import { getQueryString, jsonToParams, getUrlDir } from 'comm/js/url/url'


export default (projectExtends = {}, isAutoCollect = true, utm) => {
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
    Object.defineProperty(Vue.prototype, '$utm', { value: utm })
    utm.device()
  }

  // 自定义扩展
  Object.keys(projectExtends).forEach(item => {
    Object.defineProperty(Vue.prototype, item, { value: projectExtends[item] })
  })

}
